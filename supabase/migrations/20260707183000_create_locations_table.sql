-- Phase 3.3.1: Locations Master Table
-- Established according to Square AR Spaces Database Engineering Standards

CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core Information
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    short_description TEXT,
    detailed_description TEXT,
    
    -- Hierarchy (Self-referential)
    parent_location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    
    -- Configuration & Status
    display_order INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Geospatial
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    
    -- SEO
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT,
    canonical_url VARCHAR(255),
    
    -- Audit & Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    created_by UUID, -- Reserved for auth.users(id) in future Phase
    updated_by UUID, -- Reserved for auth.users(id) in future Phase
    
    -- Constraints
    CONSTRAINT uq_locations_slug UNIQUE (slug),
    CONSTRAINT chk_locations_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Documentation Comments
COMMENT ON TABLE locations IS 'Master table representing geographical markets, sectors, and investment zones.';
COMMENT ON COLUMN locations.id IS 'Primary UUID v4 identifier.';
COMMENT ON COLUMN locations.name IS 'Display name of the location (e.g., Sector 150).';
COMMENT ON COLUMN locations.slug IS 'Unique URL-friendly identifier. Must be lowercase alphanumeric with hyphens.';
COMMENT ON COLUMN locations.parent_location_id IS 'Enables hierarchical locations (e.g., Sector 150 -> Noida).';
COMMENT ON COLUMN locations.deleted_at IS 'Soft delete timestamp. If populated, the record is considered deleted.';

-- B-Tree Indexes
CREATE INDEX idx_locations_slug ON locations(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_locations_parent_id ON locations(parent_location_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_locations_is_active ON locations(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_locations_is_featured ON locations(is_featured) WHERE deleted_at IS NULL AND is_featured = true;
CREATE INDEX idx_locations_display_order ON locations(display_order);
