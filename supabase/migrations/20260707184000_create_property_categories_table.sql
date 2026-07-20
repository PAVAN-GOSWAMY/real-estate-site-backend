-- Phase 3.3.3: Property Categories Master Table
-- Established according to Square AR Spaces Database Engineering Standards

CREATE TABLE property_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core Information
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    short_description TEXT,
    detailed_description TEXT,
    
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
    CONSTRAINT uq_property_categories_name UNIQUE (name),
    CONSTRAINT uq_property_categories_slug UNIQUE (slug),
    CONSTRAINT chk_property_categories_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT chk_property_categories_display_order CHECK (display_order >= 0),
    CONSTRAINT chk_property_categories_theme_color CHECK (theme_color IS NULL OR theme_color ~ '^#[0-9a-fA-F]{6}$')
);

-- Documentation Comments
COMMENT ON TABLE property_categories IS 'Master table representing business and marketing categories for properties.';
COMMENT ON COLUMN property_categories.id IS 'Primary UUID v4 identifier.';
COMMENT ON COLUMN property_categories.name IS 'Display name of the category (e.g., Luxury).';
COMMENT ON COLUMN property_categories.slug IS 'Unique URL-friendly identifier. Must be lowercase alphanumeric with hyphens.';
COMMENT ON COLUMN property_categories.icon_name IS 'String identifier mapping to a frontend Lucide icon (e.g., "building", "home").';
COMMENT ON COLUMN property_categories.theme_color IS 'Hex color code (e.g., #C9A227) for dynamic UI theming.';
COMMENT ON COLUMN property_categories.deleted_at IS 'Soft delete timestamp. If populated, the record is considered deleted.';

-- B-Tree Indexes
CREATE INDEX idx_property_categories_slug ON property_categories(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_property_categories_is_active ON property_categories(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_property_categories_is_featured ON property_categories(is_featured) WHERE deleted_at IS NULL AND is_featured = true;
CREATE INDEX idx_property_categories_display_order ON property_categories(display_order);
