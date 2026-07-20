-- Phase 3.3.2: Builders Master Table
-- Established according to Square AR Spaces Database Engineering Standards

CREATE TABLE builders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core Information
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    short_description TEXT,
    detailed_description TEXT,
    logo_url VARCHAR(1024),
    
    -- Contact & Corporate
    website VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    rera_number VARCHAR(100),
    founded_year INTEGER,
    headquarters VARCHAR(255),
    
    -- Statistics & Metrics
    experience_years INTEGER DEFAULT 0,
    projects_delivered INTEGER DEFAULT 0,
    projects_ongoing INTEGER DEFAULT 0,
    awards_count INTEGER DEFAULT 0,
    
    -- Integrations
    google_map_link VARCHAR(1024),
    
    -- SEO
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT,
    canonical_url VARCHAR(255),
    
    -- Configuration & Status
    display_order INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Audit & Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    created_by UUID, -- Reserved for auth.users(id) in future Phase
    updated_by UUID, -- Reserved for auth.users(id) in future Phase
    
    -- Constraints
    CONSTRAINT uq_builders_name UNIQUE (name),
    CONSTRAINT uq_builders_slug UNIQUE (slug),
    CONSTRAINT chk_builders_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT chk_builders_stats_positive CHECK (
        experience_years >= 0 AND 
        projects_delivered >= 0 AND 
        projects_ongoing >= 0 AND 
        awards_count >= 0
    )
);

-- Documentation Comments
COMMENT ON TABLE builders IS 'Master table representing real estate developers and builders.';
COMMENT ON COLUMN builders.id IS 'Primary UUID v4 identifier.';
COMMENT ON COLUMN builders.name IS 'Display name of the builder (e.g., Godrej Properties).';
COMMENT ON COLUMN builders.slug IS 'Unique URL-friendly identifier. Must be lowercase alphanumeric with hyphens.';
COMMENT ON COLUMN builders.logo_url IS 'Temporary URL pointing to the logo image. Future relations will link to a media table.';
COMMENT ON COLUMN builders.deleted_at IS 'Soft delete timestamp. If populated, the record is considered deleted.';

-- B-Tree Indexes
CREATE INDEX idx_builders_slug ON builders(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_builders_is_active ON builders(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_builders_is_featured ON builders(is_featured) WHERE deleted_at IS NULL AND is_featured = true;
CREATE INDEX idx_builders_display_order ON builders(display_order);
