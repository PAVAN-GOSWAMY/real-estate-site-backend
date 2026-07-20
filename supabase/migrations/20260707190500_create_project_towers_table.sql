-- Phase 3.4.1: Project Towers Master Table
-- Established according to Square AR Spaces Database Engineering Standards

CREATE TABLE project_towers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    
    -- Core Information
    tower_name VARCHAR(255) NOT NULL,
    tower_code VARCHAR(100) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    short_description TEXT,
    
    -- Status & Timeline
    construction_status property_status NOT NULL DEFAULT 'PRE_LAUNCH'::property_status,
    launch_date DATE,
    expected_completion_date DATE,
    actual_completion_date DATE,
    
    -- Physical Structural Metrics
    total_floors INTEGER,
    total_units INTEGER,
    tower_height NUMERIC(10, 2), -- Stores height (e.g., meters)
    number_of_lifts INTEGER,
    service_lifts INTEGER,
    parking_levels INTEGER,
    
    -- UI & Config
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    
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
    CONSTRAINT uq_project_towers_code UNIQUE (project_id, tower_code),
    CONSTRAINT uq_project_towers_slug UNIQUE (project_id, slug),
    CONSTRAINT chk_project_towers_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT chk_project_towers_display_order CHECK (display_order >= 0),
    CONSTRAINT chk_project_towers_floors_positive CHECK (total_floors IS NULL OR total_floors >= 0),
    CONSTRAINT chk_project_towers_units_positive CHECK (total_units IS NULL OR total_units >= 0),
    CONSTRAINT chk_project_towers_height_positive CHECK (tower_height IS NULL OR tower_height >= 0),
    CONSTRAINT chk_project_towers_lifts_positive CHECK (number_of_lifts IS NULL OR number_of_lifts >= 0),
    CONSTRAINT chk_project_towers_slifts_positive CHECK (service_lifts IS NULL OR service_lifts >= 0),
    CONSTRAINT chk_project_towers_parking_positive CHECK (parking_levels IS NULL OR parking_levels >= 0)
);

-- Documentation Comments
COMMENT ON TABLE project_towers IS 'Master table representing physical towers/buildings within a project (e.g., Tower A). Acts as the parent to individual Property Units.';
COMMENT ON COLUMN project_towers.project_id IS 'Foreign key linking to the parent project.';
COMMENT ON COLUMN project_towers.tower_code IS 'Unique code within the specific project (e.g., T1).';
COMMENT ON COLUMN project_towers.deleted_at IS 'Soft delete timestamp. If populated, the record is considered deleted.';

-- B-Tree Indexes
CREATE INDEX idx_project_towers_project_id ON project_towers(project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_project_towers_slug ON project_towers(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_project_towers_code ON project_towers(tower_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_project_towers_status ON project_towers(construction_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_project_towers_is_active ON project_towers(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_project_towers_is_featured ON project_towers(is_featured) WHERE deleted_at IS NULL AND is_featured = true;
CREATE INDEX idx_project_towers_display_order ON project_towers(display_order);
CREATE INDEX idx_project_towers_dates ON project_towers(expected_completion_date);
