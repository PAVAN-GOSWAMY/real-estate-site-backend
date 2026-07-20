-- Phase 3.3.5: Amenities Master Table
-- Established according to Square AR Spaces Database Engineering Standards

CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core Information
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    short_description TEXT,
    detailed_description TEXT,
    amenity_group VARCHAR(100) NOT NULL,
    
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
    CONSTRAINT uq_amenities_name UNIQUE (name),
    CONSTRAINT uq_amenities_slug UNIQUE (slug),
    CONSTRAINT chk_amenities_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT chk_amenities_display_order CHECK (display_order >= 0),
    CONSTRAINT chk_amenities_theme_color CHECK (theme_color IS NULL OR theme_color ~ '^#[0-9a-fA-F]{6}$')
);

-- Documentation Comments
COMMENT ON TABLE amenities IS 'Master table representing shared facilities/infrastructure (e.g., Gym, Pool) provided by an entire project.';
COMMENT ON COLUMN amenities.id IS 'Primary UUID v4 identifier.';
COMMENT ON COLUMN amenities.name IS 'Display name of the amenity (e.g., Swimming Pool).';
COMMENT ON COLUMN amenities.slug IS 'Unique URL-friendly identifier. Must be lowercase alphanumeric with hyphens.';
COMMENT ON COLUMN amenities.amenity_group IS 'Logical grouping (e.g., Fitness, Security) for UI organization and filtering.';
COMMENT ON COLUMN amenities.icon_name IS 'String identifier mapping to a frontend Lucide icon (e.g., "dumbbell", "shield").';
COMMENT ON COLUMN amenities.theme_color IS 'Hex color code (e.g., #10B981) for dynamic UI theming.';
COMMENT ON COLUMN amenities.is_premium IS 'Flags high-end amenities (e.g., Infinity Pool) to drive luxury marketing.';
COMMENT ON COLUMN amenities.deleted_at IS 'Soft delete timestamp. If populated, the record is considered deleted.';

-- B-Tree Indexes
CREATE INDEX idx_amenities_slug ON amenities(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_amenities_group ON amenities(amenity_group) WHERE deleted_at IS NULL;
CREATE INDEX idx_amenities_is_active ON amenities(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_amenities_is_featured ON amenities(is_featured) WHERE deleted_at IS NULL AND is_featured = true;
CREATE INDEX idx_amenities_is_premium ON amenities(is_premium) WHERE deleted_at IS NULL AND is_premium = true;
CREATE INDEX idx_amenities_display_order ON amenities(display_order);
