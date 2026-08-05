-- =============================================================================
-- Migration: Add Lead Preferences
-- Description: Adds preferred_visit_date and budget columns to the leads table.
-- =============================================================================

ALTER TABLE leads
ADD COLUMN IF NOT EXISTS preferred_visit_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS budget TEXT;
