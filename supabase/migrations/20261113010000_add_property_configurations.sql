-- Migration: Add configurations text array to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS configurations text[] DEFAULT '{}'::text[];

-- Backfill from existing bedrooms column
UPDATE properties
SET configurations = ARRAY[bedrooms::text || ' BHK']
WHERE bedrooms IS NOT NULL AND bedrooms > 0 AND (configurations IS NULL OR configurations = '{}');

-- Handle studio apartments
UPDATE properties
SET configurations = ARRAY['Studio']
WHERE (property_type::text ILIKE '%Studio%' OR property_category::text ILIKE '%Studio%') AND (configurations IS NULL OR configurations = '{}');

-- Create GIN index for high-speed containment search
CREATE INDEX IF NOT EXISTS idx_properties_configurations ON properties USING GIN (configurations);
