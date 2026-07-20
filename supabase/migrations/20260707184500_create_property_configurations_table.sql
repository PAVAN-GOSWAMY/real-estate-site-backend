-- Phase 3.3.4: Property Configurations Master Table
-- Established according to Square AR Spaces Database Engineering Standards

CREATE TABLE property_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core Information
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    short_description TEXT,
    detailed_description TEXT,
    
    -- Structural Attributes
    bedrooms NUMERIC(3, 1), -- Supports 1.5, 2.5
    bathrooms INTEGER,
    balconies INTEGER,
    configuration_group VARCHAR(100) NOT NULL, -- e.g., 'Residential', 'Commercial', 'Industrial'
    
    -- UI Configuration
    icon_name VARCHAR(100),
    theme_color VARCHAR(7),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    
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
    CONSTRAINT uq_property_configurations_name UNIQUE (name),
    CONSTRAINT uq_property_configurations_slug UNIQUE (slug),
    CONSTRAINT chk_property_configurations_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT chk_property_configurations_display_order CHECK (display_order >= 0),
    CONSTRAINT chk_property_configurations_theme_color CHECK (theme_color IS NULL OR theme_color ~ '^#[0-9a-fA-F]{6}$')
);

-- Documentation Comments
COMMENT ON TABLE property_configurations IS 'Master table representing the usable layout/configuration (e.g., 2 BHK, Office Space, Warehouse).';
COMMENT ON COLUMN property_configurations.id IS 'Primary UUID v4 identifier.';
COMMENT ON COLUMN property_configurations.name IS 'Display name of the configuration (e.g., 2 BHK, Penthouse).';
COMMENT ON COLUMN property_configurations.slug IS 'Unique URL-friendly identifier. Must be lowercase alphanumeric with hyphens.';
COMMENT ON COLUMN property_configurations.bedrooms IS 'Numeric representation of bedrooms. Allows .5 for half-rooms. Nullable for commercial spaces.';
COMMENT ON COLUMN property_configurations.bathrooms IS 'Numeric representation of bathrooms. Nullable for commercial/raw spaces.';
COMMENT ON COLUMN property_configurations.configuration_group IS 'Broad grouping for top-level filtering (e.g., Residential vs Commercial).';
COMMENT ON COLUMN property_configurations.deleted_at IS 'Soft delete timestamp. If populated, the record is considered deleted.';

-- B-Tree Indexes
CREATE INDEX idx_property_configurations_slug ON property_configurations(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_property_configurations_group ON property_configurations(configuration_group) WHERE deleted_at IS NULL;
CREATE INDEX idx_property_configurations_is_active ON property_configurations(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_property_configurations_is_featured ON property_configurations(is_featured) WHERE deleted_at IS NULL AND is_featured = true;
CREATE INDEX idx_property_configurations_display_order ON property_configurations(display_order);
