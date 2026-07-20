-- Phase 3.4.7: Property Floor Plans Master Table
-- Established according to Square AR Spaces Database Engineering Standards

CREATE TABLE property_floor_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationships
    property_id UUID NOT NULL REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE,
    
    -- Core Classification
    plan_name VARCHAR(255) NOT NULL,
    plan_code VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Storage Engine Mapping
    storage_bucket VARCHAR(100) NOT NULL,
    storage_path VARCHAR(1024) NOT NULL,
    public_url VARCHAR(1024) NOT NULL,
    thumbnail_url VARCHAR(1024),
    
    -- Architectural Metadata
    file_format VARCHAR(50) NOT NULL,
    drawing_scale VARCHAR(50),
    orientation VARCHAR(100),
    
    -- Physical Dimensions
    carpet_area NUMERIC(10, 2),
    built_up_area NUMERIC(10, 2),
    super_built_up_area NUMERIC(10, 2),
    area_unit VARCHAR(50) DEFAULT 'SQ_FT',
    
    -- Structural Details
    bedrooms NUMERIC(3, 1),
    bathrooms INTEGER,
    balconies INTEGER,
    
    -- File Metadata
    mime_type VARCHAR(100),
    file_size BIGINT,
    width INTEGER,
    height INTEGER,
    
    -- UI & Config
    display_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    is_downloadable BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Audit & Timestamps
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    created_by UUID, -- Reserved for auth.users(id) in future Phase
    updated_by UUID, -- Reserved for auth.users(id) in future Phase
    
    -- Constraints
    CONSTRAINT uq_property_floor_plans_code UNIQUE (property_id, plan_code),
    CONSTRAINT chk_property_floor_plans_format CHECK (
        file_format IN ('PDF', 'PNG', 'JPEG', 'SVG', 'DWG')
    ),
    CONSTRAINT chk_property_floor_plans_display_order CHECK (display_order >= 0),
    CONSTRAINT chk_property_floor_plans_dimensions CHECK (
        (width IS NULL OR width > 0) AND 
        (height IS NULL OR height > 0)
    ),
    CONSTRAINT chk_property_floor_plans_file_size CHECK (file_size IS NULL OR file_size > 0),
    CONSTRAINT chk_property_floor_plans_areas CHECK (
        (carpet_area IS NULL OR carpet_area >= 0) AND
        (built_up_area IS NULL OR built_up_area >= 0) AND
        (super_built_up_area IS NULL OR super_built_up_area >= 0)
    ),
    CONSTRAINT chk_property_floor_plans_structural CHECK (
        (bedrooms IS NULL OR bedrooms >= 0) AND
        (bathrooms IS NULL OR bathrooms >= 0) AND
        (balconies IS NULL OR balconies >= 0)
    )
);

-- Documentation Comments
COMMENT ON TABLE property_floor_plans IS 'Stores architectural floor plans for individual property units. Separated from standard images due to the requirement of tracking structured architectural metadata (like dimensions and orientation).';
COMMENT ON COLUMN property_floor_plans.property_id IS 'Foreign key linking the floor plan to its parent property unit.';
COMMENT ON COLUMN property_floor_plans.plan_code IS 'Unique code within the property (e.g., STD-01) for CRM and version tracking.';
COMMENT ON COLUMN property_floor_plans.is_primary IS 'Indicates the default floor plan shown to the user. Enforced via application logic.';
COMMENT ON COLUMN property_floor_plans.deleted_at IS 'Soft delete timestamp. Historic architectural documents must remain valid for CRM audits.';

-- B-Tree Indexes
CREATE INDEX idx_property_floor_plans_property_id ON property_floor_plans(property_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_property_floor_plans_code ON property_floor_plans(plan_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_property_floor_plans_is_primary ON property_floor_plans(is_primary) WHERE deleted_at IS NULL AND is_primary = true;
CREATE INDEX idx_property_floor_plans_is_downloadable ON property_floor_plans(is_downloadable) WHERE deleted_at IS NULL AND is_downloadable = true;
CREATE INDEX idx_property_floor_plans_is_active ON property_floor_plans(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_property_floor_plans_display_order ON property_floor_plans(display_order);
