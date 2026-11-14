-- Migration: Add managed_by column to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS managed_by text;

-- Add comment explaining the column
COMMENT ON COLUMN properties.managed_by IS 'The company or organisation currently managing or operating the project (e.g. ABC Developers).';
