-- Add a unique constraint to prevent duplicate applications for the same job by the same email
ALTER TABLE public.job_applications
    ADD CONSTRAINT unique_job_application_email UNIQUE (job_id, email);
