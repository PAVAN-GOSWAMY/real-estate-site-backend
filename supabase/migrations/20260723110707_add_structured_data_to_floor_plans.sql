-- =============================================================================
-- Migration: Add Structured Data to Floor Plans
-- Description: Adds bedrooms, bathrooms, and price to property_floor_plans 
--              for exact-match filtering per architectural review.
-- =============================================================================

ALTER TABLE public.property_floor_plans
ADD COLUMN IF NOT EXISTS bedrooms integer,
ADD COLUMN IF NOT EXISTS bathrooms integer,
ADD COLUMN IF NOT EXISTS price numeric;

-- Create an index on bedrooms for filtering
CREATE INDEX IF NOT EXISTS property_floor_plans_bedrooms_idx ON public.property_floor_plans (bedrooms);
