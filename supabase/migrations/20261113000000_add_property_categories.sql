-- Migration: Add property_categories array to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS property_categories text[] DEFAULT '{}'::text[];

-- Backfill from existing property_category column
UPDATE properties
SET property_categories = ARRAY[property_category]
WHERE property_category IS NOT NULL
  AND (property_categories IS NULL OR property_categories = '{}');

-- Create GIN index on property_categories for high-performance array containment queries
CREATE INDEX IF NOT EXISTS idx_properties_categories ON properties USING GIN (property_categories);
