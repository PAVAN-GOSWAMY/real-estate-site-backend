-- =============================================================================
-- Migration: Optimize Search Reverse Indexes
-- Description: Adds a reverse index on property_amenities to optimize searches
--              where properties are filtered by amenity_id.
-- =============================================================================

-- The primary key is (property_id, amenity_id), which optimizes lookups BY property.
-- When searching BY amenity (e.g. amenity_id IN (...)), we need an index starting with amenity_id.
CREATE INDEX IF NOT EXISTS property_amenities_amenity_id_idx 
ON public.property_amenities (amenity_id);
