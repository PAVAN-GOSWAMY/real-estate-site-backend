-- ============================================================================
-- Authentication Role Resolution & RLS Fix
-- ============================================================================

-- 1. Create the Reusable SECURITY DEFINER Function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.admin_role
LANGUAGE sql 
SECURITY DEFINER 
SET search_path = public
AS $$
  SELECT role 
  FROM public.admin_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;
$$;

COMMENT ON FUNCTION public.get_current_user_role IS
'Securely fetches the authenticated user''s admin role without triggering RLS policies. Returns a single admin_role or NULL.';

-- 2. Drop the recursive policy
DROP POLICY IF EXISTS "Super Admins can manage all roles" ON public.admin_roles;

-- 3. Replace with a clean, non-recursive policy
CREATE POLICY "Super Admins can manage all roles" 
    ON public.admin_roles 
    FOR ALL 
    USING (
        public.get_current_user_role() = 'Super Admin'::public.admin_role
    )
    WITH CHECK (
        public.get_current_user_role() = 'Super Admin'::public.admin_role
    );
