-- Phase 4.4: Site Visits Master Table
-- Established according to Square AR Spaces Database Engineering Standards

CREATE TABLE site_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationships
    lead_id UUID NOT NULL REFERENCES leads(id) ON UPDATE CASCADE ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON UPDATE CASCADE ON DELETE SET NULL,
    tower_id UUID REFERENCES project_towers(id) ON UPDATE CASCADE ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON UPDATE CASCADE ON DELETE SET NULL,
    
    -- Visit Details
    visit_title VARCHAR(255) NOT NULL,
    visit_type VARCHAR(100) NOT NULL,
    visit_status site_visit_status NOT NULL DEFAULT 'SCHEDULED'::site_visit_status,
    
    -- Scheduling
    scheduled_date DATE NOT NULL,
    scheduled_start_time TIME NOT NULL,
    scheduled_end_time TIME,
    actual_start_time TIMESTAMPTZ,
    actual_end_time TIMESTAMPTZ,
    visit_duration_minutes INTEGER,
    
    -- Location & Virtual
    meeting_location TEXT,
    meeting_latitude NUMERIC(10, 8),
    meeting_longitude NUMERIC(11, 8),
    is_virtual BOOLEAN NOT NULL DEFAULT false,
    meeting_link VARCHAR(1024),
    
    -- Logistics
    transport_required BOOLEAN NOT NULL DEFAULT false,
    refreshments_required BOOLEAN NOT NULL DEFAULT false,
    
    -- Execution
    assigned_sales_executive UUID, -- Future auth.users relation
    customer_attended BOOLEAN NOT NULL DEFAULT false,
    sales_executive_attended BOOLEAN NOT NULL DEFAULT false,
    
    -- Feedback & Outcome
    feedback_rating INTEGER,
    customer_feedback TEXT,
    sales_notes TEXT,
    
    -- Business KPIs
    documents_shared BOOLEAN NOT NULL DEFAULT false,
    brochures_shared BOOLEAN NOT NULL DEFAULT false,
    price_discussed BOOLEAN NOT NULL DEFAULT false,
    negotiation_started BOOLEAN NOT NULL DEFAULT false,
    booking_interest BOOLEAN NOT NULL DEFAULT false,
    visit_photos_uploaded BOOLEAN NOT NULL DEFAULT false,
    
    -- Follow-up Flow
    next_action VARCHAR(255),
    follow_up_required BOOLEAN NOT NULL DEFAULT false,
    follow_up_date TIMESTAMPTZ,
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Audit & Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    created_by UUID, -- Reserved for auth.users(id) in future Phase
    updated_by UUID, -- Reserved for auth.users(id) in future Phase
    
    -- Constraints
    CONSTRAINT chk_site_visits_type CHECK (
        visit_type IN (
            'Project Visit', 'Property Visit', 'Sample Flat', 
            'Virtual Tour', 'Builder Office Visit', 'Revisit'
        )
    ),
    CONSTRAINT chk_site_visits_duration CHECK (visit_duration_minutes IS NULL OR visit_duration_minutes >= 0),
    CONSTRAINT chk_site_visits_rating CHECK (feedback_rating IS NULL OR (feedback_rating >= 1 AND feedback_rating <= 5)),
    CONSTRAINT chk_site_visits_latitude CHECK (meeting_latitude IS NULL OR (meeting_latitude >= -90 AND meeting_latitude <= 90)),
    CONSTRAINT chk_site_visits_longitude CHECK (meeting_longitude IS NULL OR (meeting_longitude >= -180 AND meeting_longitude <= 180))
);

-- Documentation Comments
COMMENT ON TABLE site_visits IS 'Manages physical and virtual property visits. Bridges the gap between digital leads and physical real estate sales.';
COMMENT ON COLUMN site_visits.lead_id IS 'Foreign key to leads. ON DELETE CASCADE ensures visit history is purged if a lead requests privacy deletion.';
COMMENT ON COLUMN site_visits.project_id IS 'Foreign key to projects. ON DELETE SET NULL ensures visit reports survive project deletion.';
COMMENT ON COLUMN site_visits.visit_status IS 'Leverages Phase 3.2 site_visit_status ENUM (SCHEDULED, COMPLETED, CANCELLED, RESCHEDULED).';
COMMENT ON COLUMN site_visits.booking_interest IS 'Crucial KPI flag indicating high probability of a sale closing.';

-- B-Tree Indexes
CREATE INDEX idx_site_visits_lead_id ON site_visits(lead_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_site_visits_project_id ON site_visits(project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_site_visits_tower_id ON site_visits(tower_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_site_visits_property_id ON site_visits(property_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_site_visits_status ON site_visits(visit_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_site_visits_scheduled_date ON site_visits(scheduled_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_site_visits_assigned_exec ON site_visits(assigned_sales_executive) WHERE deleted_at IS NULL;
CREATE INDEX idx_site_visits_follow_up_date ON site_visits(follow_up_date) WHERE deleted_at IS NULL AND follow_up_required = true;
