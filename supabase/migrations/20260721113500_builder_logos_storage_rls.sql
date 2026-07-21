-- ============================================================================
-- Secure Builder Logos Storage Bucket
-- ============================================================================

-- Ensure idempotency by dropping any existing policies for the builder-logos bucket
DROP POLICY IF EXISTS "Public can view builder logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can insert builder logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update builder logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete builder logos" ON storage.objects;

-- --------------------------------------------------------------------------
-- Public Read Access
-- Anyone can view logos because the bucket is public
-- --------------------------------------------------------------------------
CREATE POLICY "Public can view builder logos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'builder-logos');

-- --------------------------------------------------------------------------
-- Admin Insert Access
-- Only active admins can upload new logos
-- --------------------------------------------------------------------------
CREATE POLICY "Admins can insert builder logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'builder-logos' AND
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
          AND profiles.is_active = true
    )
);

-- --------------------------------------------------------------------------
-- Admin Update Access
-- Only active admins can update existing logos
-- --------------------------------------------------------------------------
CREATE POLICY "Admins can update builder logos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'builder-logos' AND
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
          AND profiles.is_active = true
    )
);

-- --------------------------------------------------------------------------
-- Admin Delete Access
-- Only active admins can delete logos
-- --------------------------------------------------------------------------
CREATE POLICY "Admins can delete builder logos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'builder-logos' AND
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
          AND profiles.is_active = true
    )
);
