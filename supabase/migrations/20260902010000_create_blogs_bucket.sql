-- Create the blogs bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('blogs', 'blogs', true)
ON CONFLICT (id) DO NOTHING;

-- Update the public read policy to include blogs
DROP POLICY IF EXISTS "Public can view media" ON storage.objects;

CREATE POLICY "Public can view media"
ON storage.objects FOR SELECT
USING (bucket_id IN ('builder-logos', 'property-media', 'property-assets', 'lead-attachments', 'blogs'));
