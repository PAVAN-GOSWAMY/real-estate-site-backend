-- Phase 3.4: Projects Master Table
-- Established according to Square AR Spaces Database Engineering Standards

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationships
    builder_id UUID NOT NULL REFERENCES builders(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    location_id UUID NOT NULL REFERENCES locations(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES property_categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    
    -- Core Information
    project_name VARCHAR(255) NOT NULL,
    project_code VARCHAR(100) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    short_description TEXT,
    detailed_description TEXT,
    rera_number VARCHAR(100),
    
    -- Status & Timeline
    launch_date DATE,
    expected_possession_date DATE,
    actual_possession_date DATE,
    project_status property_status NOT NULL DEFAULT 'PRE_LAUNCH'::property_status,
    property_type property_type NOT NULL DEFAULT 'APARTMENT'::property_type,
    
    -- Master Metrics
    total_land_area NUMERIC(10, 2),
    land_area_unit VARCHAR(50), -- e.g., 'Acres', 'Sq.Ft', 'Sq.M'
    total_towers INTEGER,
    total_units INTEGER,
    total_floors INTEGER,
    
    -- Pricing (Absolute numeric values, formatting belongs to frontend)
    price_starting_from NUMERIC(15, 2),
    price_up_to NUMERIC(15, 2),
    
    -- UI & Config
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- SEO
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT,
    canonical_url VARCHAR(255),
    
    -- Temporary Media (Before `project_media` phase)
    brochure_url VARCHAR(1024),
    master_plan_url VARCHAR(1024),
    
    -- Audit & Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    created_by UUID, -- Reserved for auth.users(id) in future Phase
    updated_by UUID, -- Reserved for auth.users(id) in future Phase
    
    -- Constraints
    CONSTRAINT uq_projects_code UNIQUE (project_code),
    CONSTRAINT uq_projects_slug UNIQUE (slug),
    CONSTRAINT chk_projects_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT chk_projects_towers_positive CHECK (total_towers IS NULL OR total_towers >= 0),
    CONSTRAINT chk_projects_units_positive CHECK (total_units IS NULL OR total_units >= 0),
    CONSTRAINT chk_projects_floors_positive CHECK (total_floors IS NULL OR total_floors >= 0),
    CONSTRAINT chk_projects_pricing_positive CHECK (
        (price_starting_from IS NULL OR price_starting_from >= 0) AND
        (price_up_to IS NULL OR price_up_to >= 0)
    ),
    CONSTRAINT chk_projects_area_positive CHECK (total_land_area IS NULL OR total_land_area >= 0)
);

-- Documentation Comments
COMMENT ON TABLE projects IS 'Central master table representing an entire real estate development (e.g., Godrej Tropical Isle). NOT an individual unit.';
COMMENT ON COLUMN projects.builder_id IS 'Foreign key linking the project to its developer.';
COMMENT ON COLUMN projects.location_id IS 'Foreign key linking the project to its geographic area.';
COMMENT ON COLUMN projects.category_id IS 'Foreign key defining the primary business classification (e.g., Luxury).';
COMMENT ON COLUMN projects.project_code IS 'Unique CRM identifier (e.g., GOD001).';
COMMENT ON COLUMN projects.price_starting_from IS 'Absolute numeric value in INR (e.g., 12500000). Formatting is delegated to frontend.';
COMMENT ON COLUMN projects.deleted_at IS 'Soft delete timestamp. If populated, the record is considered deleted.';

-- B-Tree Indexes
CREATE INDEX idx_projects_slug ON projects(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_builder_id ON projects(builder_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_location_id ON projects(location_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_category_id ON projects(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_status ON projects(project_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_is_active ON projects(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_is_featured ON projects(is_featured) WHERE deleted_at IS NULL AND is_featured = true;
CREATE INDEX idx_projects_is_verified ON projects(is_verified) WHERE deleted_at IS NULL AND is_verified = true;
CREATE INDEX idx_projects_dates ON projects(launch_date, expected_possession_date);
CREATE INDEX idx_projects_price ON projects(price_starting_from);
