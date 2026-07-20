-- Phase 4.2: Lead Preferences Master Table
-- Established according to Square AR Spaces Database Engineering Standards

CREATE TABLE lead_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core Relationships
    lead_id UUID NOT NULL REFERENCES leads(id) ON UPDATE CASCADE ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON UPDATE CASCADE ON DELETE SET NULL,
    category_id UUID REFERENCES property_categories(id) ON UPDATE CASCADE ON DELETE SET NULL,
    configuration_id UUID REFERENCES property_configurations(id) ON UPDATE CASCADE ON DELETE SET NULL,
    
    -- Specific Entity Preferences
    -- Using UUID to securely link to reference tables without hardcoding strings
    preferred_builder UUID REFERENCES builders(id) ON UPDATE CASCADE ON DELETE SET NULL,
    preferred_project UUID REFERENCES projects(id) ON UPDATE CASCADE ON DELETE SET NULL,
    preferred_tower UUID REFERENCES project_towers(id) ON UPDATE CASCADE ON DELETE SET NULL,
    
    -- Financial Parameters
    budget_min NUMERIC(15, 2),
    budget_max NUMERIC(15, 2),
    
    -- Area Parameters
    minimum_area NUMERIC(10, 2),
    maximum_area NUMERIC(10, 2),
    area_unit VARCHAR(50) DEFAULT 'SQ_FT',
    
    -- Structural Preferences
    preferred_floor_min INTEGER,
    preferred_floor_max INTEGER,
    preferred_facing VARCHAR(100),
    preferred_bedrooms NUMERIC(3, 1),
    preferred_bathrooms INTEGER,
    
    -- Status Preferences (Reusing Phase 3.2 ENUMs)
    preferred_possession_status property_status,
    preferred_availability property_availability,
    
    -- Business Intent Flags
    parking_required BOOLEAN DEFAULT false,
    furnished_required BOOLEAN DEFAULT false,
    loan_required BOOLEAN DEFAULT false,
    investment_purpose BOOLEAN DEFAULT false,
    self_use BOOLEAN DEFAULT false,
    
    -- Notes
    remarks TEXT,
    
    -- Configuration
    is_current BOOLEAN NOT NULL DEFAULT true,
    
    -- Audit & Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    created_by UUID, -- Reserved for auth.users(id) in future Phase
    updated_by UUID, -- Reserved for auth.users(id) in future Phase
    
    -- Constraints
    CONSTRAINT chk_lead_preferences_budget CHECK (
        (budget_min IS NULL OR budget_min >= 0) AND
        (budget_max IS NULL OR budget_max >= 0) AND
        (budget_min IS NULL OR budget_max IS NULL OR budget_min <= budget_max)
    ),
    CONSTRAINT chk_lead_preferences_area CHECK (
        (minimum_area IS NULL OR minimum_area >= 0) AND
        (maximum_area IS NULL OR maximum_area >= 0) AND
        (minimum_area IS NULL OR maximum_area IS NULL OR minimum_area <= maximum_area)
    ),
    CONSTRAINT chk_lead_preferences_floor CHECK (
        (preferred_floor_min IS NULL OR preferred_floor_max IS NULL OR preferred_floor_min <= preferred_floor_max)
    ),
    CONSTRAINT chk_lead_preferences_rooms CHECK (
        (preferred_bedrooms IS NULL OR preferred_bedrooms >= 0) AND
        (preferred_bathrooms IS NULL OR preferred_bathrooms >= 0)
    )
);

-- Documentation Comments
COMMENT ON TABLE lead_preferences IS 'Stores historical and current property preferences for a CRM lead to drive AI matchmaking.';
COMMENT ON COLUMN lead_preferences.lead_id IS 'Foreign key to the parent lead. ON DELETE CASCADE ensures data cleanup if the lead is permanently wiped.';
COMMENT ON COLUMN lead_preferences.location_id IS 'Foreign key to locations. ON DELETE SET NULL ensures preference survives if location is deleted.';
COMMENT ON COLUMN lead_preferences.preferred_project IS 'Foreign key to projects. Ensures exact matching rather than generic string search.';
COMMENT ON COLUMN lead_preferences.is_current IS 'Flags the most recent preference profile. Application logic ensures only one active profile per lead.';
COMMENT ON COLUMN lead_preferences.deleted_at IS 'Soft delete timestamp. Historic preferences remain valid for audit and analytics.';

-- B-Tree Indexes
CREATE INDEX idx_lead_preferences_lead_id ON lead_preferences(lead_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_lead_preferences_location_id ON lead_preferences(location_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_lead_preferences_category_id ON lead_preferences(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_lead_preferences_configuration_id ON lead_preferences(configuration_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_lead_preferences_budget ON lead_preferences(budget_min, budget_max) WHERE deleted_at IS NULL;
CREATE INDEX idx_lead_preferences_is_current ON lead_preferences(is_current) WHERE deleted_at IS NULL AND is_current = true;
CREATE INDEX idx_lead_preferences_dates ON lead_preferences(created_at) WHERE deleted_at IS NULL;
