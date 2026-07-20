-- Phase 3.4.3: Property Units (Inventory) Master Table
-- Established according to Square AR Spaces Database Engineering Standards

CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationships
    tower_id UUID NOT NULL REFERENCES project_towers(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    configuration_id UUID NOT NULL REFERENCES property_configurations(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    
    -- Identification
    unit_number VARCHAR(100) NOT NULL,
    unit_code VARCHAR(100) NOT NULL,
    floor_number INTEGER,
    
    -- Status
    property_status property_status NOT NULL DEFAULT 'PRE_LAUNCH'::property_status,
    availability_status property_availability NOT NULL DEFAULT 'AVAILABLE'::property_availability,
    
    -- Content
    listing_title VARCHAR(255) NOT NULL,
    short_description TEXT,
    detailed_description TEXT,
    
    -- Area Metrics
    carpet_area NUMERIC(10, 2),
    built_up_area NUMERIC(10, 2),
    super_built_up_area NUMERIC(10, 2),
    area_unit VARCHAR(50) DEFAULT 'SQ_FT',
    
    -- Financials (Absolute numeric values)
    price NUMERIC(15, 2),
    maintenance_charge NUMERIC(10, 2),
    booking_amount NUMERIC(15, 2),
    
    -- Structural Details (Can differ from base configuration)
    bedrooms NUMERIC(3, 1),
    bathrooms INTEGER,
    balconies INTEGER,
    facing VARCHAR(100),
    ownership_type VARCHAR(100),
    furnishing_status VARCHAR(100),
    parking_slots INTEGER DEFAULT 0,
    is_corner_unit BOOLEAN DEFAULT false,
    
    -- UI & Config
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_verified BOOLEAN NOT NULL DEFAULT false,
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
    CONSTRAINT uq_properties_unit_code UNIQUE (unit_code),
    CONSTRAINT uq_properties_unit_number UNIQUE (tower_id, unit_number),
    CONSTRAINT chk_properties_pricing_positive CHECK (
        (price IS NULL OR price >= 0) AND
        (maintenance_charge IS NULL OR maintenance_charge >= 0) AND
        (booking_amount IS NULL OR booking_amount >= 0)
    ),
    CONSTRAINT chk_properties_areas_positive CHECK (
        (carpet_area IS NULL OR carpet_area >= 0) AND
        (built_up_area IS NULL OR built_up_area >= 0) AND
        (super_built_up_area IS NULL OR super_built_up_area >= 0)
    ),
    CONSTRAINT chk_properties_parking_positive CHECK (parking_slots IS NULL OR parking_slots >= 0)
);

-- Documentation Comments
COMMENT ON TABLE properties IS 'Central inventory engine representing actual sellable/rentable real estate units (e.g., Unit A-1203).';
COMMENT ON COLUMN properties.tower_id IS 'Foreign key linking the unit to a specific physical tower.';
COMMENT ON COLUMN properties.configuration_id IS 'Foreign key linking the unit to its structural layout (e.g., 3 BHK).';
COMMENT ON COLUMN properties.unit_code IS 'Globally unique CRM identifier (e.g., GTI-A1203).';
COMMENT ON COLUMN properties.unit_number IS 'Apartment number. Unique strictly within its parent tower (e.g., A-1203).';
COMMENT ON COLUMN properties.price IS 'Absolute numeric value in INR (e.g., 23500000). Formatting belongs to the frontend.';
COMMENT ON COLUMN properties.deleted_at IS 'Soft delete timestamp. Historic inventory must remain valid.';

-- B-Tree Indexes
CREATE INDEX idx_properties_tower_id ON properties(tower_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_configuration_id ON properties(configuration_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_unit_code ON properties(unit_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_availability ON properties(availability_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_status ON properties(property_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_is_active ON properties(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_is_featured ON properties(is_featured) WHERE deleted_at IS NULL AND is_featured = true;
CREATE INDEX idx_properties_is_verified ON properties(is_verified) WHERE deleted_at IS NULL AND is_verified = true;
CREATE INDEX idx_properties_price ON properties(price) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_carpet_area ON properties(carpet_area) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_floor ON properties(floor_number) WHERE deleted_at IS NULL;
