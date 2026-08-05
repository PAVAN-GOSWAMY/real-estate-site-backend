-- =============================================================================
-- Migration: Optimize Properties Search
-- Description: Adds B-Tree and GIN pg_trgm indexes for faster search queries.
-- =============================================================================

-- Enable pg_trgm extension for fast text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- B-Tree indexes for exact match and range filters
CREATE INDEX IF NOT EXISTS properties_status_idx ON public.properties (status);
CREATE INDEX IF NOT EXISTS properties_property_type_idx ON public.properties (property_type);
CREATE INDEX IF NOT EXISTS properties_price_idx ON public.properties (price);
CREATE INDEX IF NOT EXISTS properties_bedrooms_idx ON public.properties (bedrooms);

-- GIN indexes with pg_trgm for ilike searches
CREATE INDEX IF NOT EXISTS properties_title_trgm_idx ON public.properties USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS properties_locality_trgm_idx ON public.properties USING gin (locality gin_trgm_ops);
CREATE INDEX IF NOT EXISTS properties_city_trgm_idx ON public.properties USING gin (city gin_trgm_ops);
