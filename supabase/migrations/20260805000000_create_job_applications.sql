-- Create job_applications table
CREATE TABLE public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    cover_letter TEXT,
    resume_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Reviewing', 'Shortlisted', 'Rejected', 'Hired')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.job_applications
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can insert an application (public)
CREATE POLICY "Anyone can insert job applications" ON public.job_applications
    FOR INSERT WITH CHECK (true);

-- Only Super Admins and Admins can view/update/delete applications
CREATE POLICY "Admins can manage job applications" ON public.job_applications
    FOR ALL USING (
        auth.role() = 'authenticated' AND
        (
            (auth.jwt() ->> 'role' = 'Super Admin') OR
            (auth.jwt() ->> 'role' = 'Admin')
        )
    );

-- Create resumes storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false) ON CONFLICT (id) DO NOTHING;

-- Anyone can upload a resume (we allow anon/public insert)
CREATE POLICY "Anyone can upload resumes" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'resumes');

-- Only Admins can view resumes
CREATE POLICY "Admins can view resumes" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'resumes' AND
        auth.role() = 'authenticated' AND
        (
            (auth.jwt() ->> 'role' = 'Super Admin') OR
            (auth.jwt() ->> 'role' = 'Admin')
        )
    );
