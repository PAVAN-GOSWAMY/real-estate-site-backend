-- Add is_premium column to properties table
ALTER TABLE properties
ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;

-- Update existing rows to ensure they have the default value
UPDATE properties
SET is_premium = FALSE
WHERE is_premium IS NULL;
