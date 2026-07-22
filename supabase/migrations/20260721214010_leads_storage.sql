-- =============================================================================
-- Migration: Lead Attachments Storage Bucket & RLS
-- Description: Creates the bucket for CRM lead attachments and configures security.
-- =============================================================================

-- 1. Create the lead-attachments bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('lead-attachments', 'lead-attachments', true) -- Publicly readable for MVP, but obfuscated UUID paths
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on storage.objects for this bucket
-- (RLS on storage.objects is usually enabled by default, but ensuring it)
-- Removed ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY as it causes ownership error

-- 3. Policy: Allow public read access to lead attachments
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'lead-attachments' );

-- 4. Policy: Allow authenticated users to upload lead attachments
CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'lead-attachments' );

-- 5. Policy: Allow authenticated users to update lead attachments
CREATE POLICY "Admin Update Access"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'lead-attachments' );

-- 6. Policy: Allow authenticated users to delete lead attachments
CREATE POLICY "Admin Delete Access"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'lead-attachments' );
