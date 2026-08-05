-- ============================================================================
-- Add Location Fields to Properties Table
-- ============================================================================

ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS landmark text,
ADD COLUMN IF NOT EXISTS sector text,
ADD COLUMN IF NOT EXISTS google_maps_url text;

-- We don't alter the columns locality, city, state to NOT NULL at DB level 
-- because old records might be missing them and it would break.
-- We handle the strict requirement at the application (Zod) layer.
