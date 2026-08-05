-- ============================================================================
-- Restore Storage RLS Policies
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. Public Read Access (for public buckets)
-- --------------------------------------------------------------------------
CREATE POLICY "Public can view media"
ON storage.objects FOR SELECT
USING (bucket_id IN ('builder-logos', 'property-media', 'property-assets', 'lead-attachments'));

-- --------------------------------------------------------------------------
-- 2. Admin Write Access (for all buckets)
-- --------------------------------------------------------------------------
CREATE POLICY "Admins can insert media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  public.get_current_user_role() = ANY (ARRAY['Super Admin'::public.admin_role, 'Admin'::public.admin_role])
);

CREATE POLICY "Admins can update media"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  public.get_current_user_role() = ANY (ARRAY['Super Admin'::public.admin_role, 'Admin'::public.admin_role])
);

CREATE POLICY "Admins can delete media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  public.get_current_user_role() = ANY (ARRAY['Super Admin'::public.admin_role, 'Admin'::public.admin_role])
);

-- --------------------------------------------------------------------------
-- 3. Public Uploads (Resumes)
-- --------------------------------------------------------------------------
CREATE POLICY "Anyone can upload resumes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resumes');

-- --------------------------------------------------------------------------
-- 4. Admin Read Access (for private buckets)
-- --------------------------------------------------------------------------
CREATE POLICY "Admins can view resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes' AND
  public.get_current_user_role() = ANY (ARRAY['Super Admin'::public.admin_role, 'Admin'::public.admin_role])
);
