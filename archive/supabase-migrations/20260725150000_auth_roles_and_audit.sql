-- ============================================================================
-- Auth Roles and Audit Logging
-- ============================================================================

-- Create Admin Role Enum
CREATE TYPE public.admin_role AS ENUM ('Super Admin', 'Admin', 'Sales Executive');

-- --------------------------------------------------------------------------
-- 1. Admin Roles Table
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.admin_role NOT NULL DEFAULT 'Sales Executive',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

CREATE TRIGGER update_admin_roles_updated_at
    BEFORE UPDATE ON public.admin_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Users can read their own role
CREATE POLICY "Users can read own role" 
    ON public.admin_roles 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Only Super Admins can manage roles
-- We use a subquery to check if the current user is a Super Admin to prevent recursion
CREATE POLICY "Super Admins can manage all roles" 
    ON public.admin_roles 
    FOR ALL 
    USING (
        (SELECT role FROM public.admin_roles WHERE user_id = auth.uid()) = 'Super Admin'::public.admin_role
    );

-- Automatically create role when a user signs up (default to Sales Executive, can be elevated later by Super Admin)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_roles (user_id, role)
  VALUES (new.id, 'Sales Executive');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- --------------------------------------------------------------------------
-- 2. Audit Logs Table
-- --------------------------------------------------------------------------
CREATE TYPE public.audit_event_type AS ENUM ('LOGIN', 'LOGOUT', 'PASSWORD_RESET_REQUEST', 'PASSWORD_CHANGED', 'PROFILE_UPDATED');

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type public.audit_event_type NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins and Super Admins can view audit logs
CREATE POLICY "Super Admin and Admin can view logs" 
    ON public.audit_logs 
    FOR SELECT 
    USING (
        (SELECT role FROM public.admin_roles WHERE user_id = auth.uid()) IN ('Super Admin'::public.admin_role, 'Admin'::public.admin_role)
    );

-- Users can insert their own logs
CREATE POLICY "Users can insert own logs" 
    ON public.audit_logs 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- System can insert logs unconditionally (when using service role key)
