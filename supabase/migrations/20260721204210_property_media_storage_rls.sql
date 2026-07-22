-- ============================================================================
-- Secure Property Media Storage Bucket
-- ============================================================================

-- Ensure idempotency by dropping any existing policies for the property-media bucket
DROP POLICY IF EXISTS "Public can view property media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can insert property media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update property media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete property media" ON storage.objects;

-- Insert the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-media', 'property-media', true)
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------------
-- Public Read Access
-- Anyone can view media because the bucket is public
-- --------------------------------------------------------------------------
CREATE POLICY "Public can view property media"
ON storage.objects
FOR SELECT
USING (bucket_id = 'property-media');

-- --------------------------------------------------------------------------
-- Admin Insert Access
-- Only active admins can upload new media
-- --------------------------------------------------------------------------
CREATE POLICY "Admins can insert property media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'property-media' AND
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
-- Only active admins can update existing media
-- --------------------------------------------------------------------------
CREATE POLICY "Admins can update property media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'property-media' AND
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
-- Only active admins can delete media
-- --------------------------------------------------------------------------
CREATE POLICY "Admins can delete property media"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'property-media' AND
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
          AND profiles.is_active = true
    )
);
