-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    employment_type TEXT NOT NULL,
    location TEXT NOT NULL,
    experience TEXT NOT NULL,
    salary TEXT,
    openings INTEGER NOT NULL DEFAULT 1,
    description TEXT,
    requirements TEXT,
    responsibilities TEXT,
    benefits TEXT,
    skills TEXT,
    status TEXT NOT NULL DEFAULT 'Draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT check_job_status CHECK (status IN ('Draft', 'Published', 'Closed'))
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policies

-- 1. Public can view only published jobs
CREATE POLICY "Public can view published jobs"
ON public.jobs
FOR SELECT
USING (status = 'Published');

-- 2. Authenticated users with Super Admin or Admin roles can view all jobs
CREATE POLICY "Admins can view all jobs"
ON public.jobs
FOR SELECT
TO authenticated
USING (public.get_current_user_role() IN ('Super Admin', 'Admin'));

-- 3. Only Super Admin and Admin can insert jobs
CREATE POLICY "Admins can create jobs"
ON public.jobs
FOR INSERT
TO authenticated
WITH CHECK (public.get_current_user_role() IN ('Super Admin', 'Admin'));

-- 4. Only Super Admin and Admin can update jobs
CREATE POLICY "Admins can update jobs"
ON public.jobs
FOR UPDATE
TO authenticated
USING (public.get_current_user_role() IN ('Super Admin', 'Admin'));

-- 5. Only Super Admin and Admin can delete jobs
CREATE POLICY "Admins can delete jobs"
ON public.jobs
FOR DELETE
TO authenticated
USING (public.get_current_user_role() IN ('Super Admin', 'Admin'));

-- Create updated_at trigger
CREATE TRIGGER handle_updated_at_jobs
    BEFORE UPDATE ON public.jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
