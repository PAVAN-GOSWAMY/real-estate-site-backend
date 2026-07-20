-- Phase 3.4.2: Property Features Master Table
-- Established according to Square AR Spaces Database Engineering Standards

CREATE TABLE property_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core Information
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    short_description TEXT,
    detailed_description TEXT,
    feature_group VARCHAR(100) NOT NULL,
    
    -- UI Configuration
    icon_name VARCHAR(100),
    theme_color VARCHAR(7),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_premium BOOLEAN NOT NULL DEFAULT false,
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
    CONSTRAINT uq_property_features_name UNIQUE (name),
    CONSTRAINT uq_property_features_slug UNIQUE (slug),
    CONSTRAINT chk_property_features_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT chk_property_features_display_order CHECK (display_order >= 0),
    CONSTRAINT chk_property_features_theme_color CHECK (theme_color IS NULL OR theme_color ~ '^#[0-9a-fA-F]{6}$')
);

-- Documentation Comments
COMMENT ON TABLE property_features IS 'Master table representing features belonging to an individual unit (e.g., Smart Home, Private Terrace). NOT community amenities.';
COMMENT ON COLUMN property_features.id IS 'Primary UUID v4 identifier.';
COMMENT ON COLUMN property_features.name IS 'Display name of the feature (e.g., Smart Home).';
COMMENT ON COLUMN property_features.slug IS 'Unique URL-friendly identifier. Must be lowercase alphanumeric with hyphens.';
COMMENT ON COLUMN property_features.feature_group IS 'Logical grouping (e.g., Technology, Luxury) for UI organization and filtering.';
COMMENT ON COLUMN property_features.icon_name IS 'String identifier mapping to a frontend Lucide icon (e.g., "wifi", "wind").';
COMMENT ON COLUMN property_features.theme_color IS 'Hex color code (e.g., #8B5CF6) for dynamic UI theming.';
COMMENT ON COLUMN property_features.is_premium IS 'Flags high-end unit features (e.g., Private Lift) to drive luxury marketing.';
COMMENT ON COLUMN property_features.deleted_at IS 'Soft delete timestamp. If populated, the record is considered deleted.';

-- B-Tree Indexes
CREATE INDEX idx_property_features_slug ON property_features(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_property_features_group ON property_features(feature_group) WHERE deleted_at IS NULL;
CREATE INDEX idx_property_features_is_active ON property_features(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_property_features_is_featured ON property_features(is_featured) WHERE deleted_at IS NULL AND is_featured = true;
CREATE INDEX idx_property_features_is_premium ON property_features(is_premium) WHERE deleted_at IS NULL AND is_premium = true;
CREATE INDEX idx_property_features_display_order ON property_features(display_order);
