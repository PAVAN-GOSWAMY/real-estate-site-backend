-- Phase 4.1: Leads Master Table
-- Established according to Square AR Spaces Database Engineering Standards

CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Contact Information
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone_number VARCHAR(50) NOT NULL,
    alternate_phone VARCHAR(50),
    
    -- Relationships (Optional, as leads may be general inquiries)
    project_id UUID REFERENCES projects(id) ON UPDATE CASCADE ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON UPDATE CASCADE ON DELETE SET NULL,
    
    -- Core CRM Classification (Using pre-existing ENUMs from Phase 3.2)
    lead_status lead_status NOT NULL DEFAULT 'NEW'::lead_status,
    lead_source lead_source NOT NULL DEFAULT 'OTHER'::lead_source,
    crm_priority crm_priority NOT NULL DEFAULT 'MEDIUM'::crm_priority,
    
    -- Financial Requirements
    budget_min NUMERIC(15, 2),
    budget_max NUMERIC(15, 2),
    
    -- Contact Preferences
    preferred_contact_method VARCHAR(50) DEFAULT 'Phone',
    preferred_contact_time VARCHAR(50) DEFAULT 'Any Time',
    
    -- Location
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    
    -- CRM Data
    remarks TEXT,
    assigned_to UUID, -- Reserved for future auth.users integration
    
    -- Timestamps
    last_contacted_at TIMESTAMPTZ,
    next_follow_up_at TIMESTAMPTZ,
    converted_at TIMESTAMPTZ,
    lost_reason TEXT,
    
    -- UI & Config
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Audit & Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    created_by UUID, -- Reserved for auth.users(id) in future Phase
    updated_by UUID, -- Reserved for auth.users(id) in future Phase
    
    -- Constraints
    CONSTRAINT chk_leads_email CHECK (email IS NULL OR email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_leads_phone CHECK (phone_number ~ '^\+?[0-9\s\-]{7,20}$'),
    CONSTRAINT chk_leads_budget CHECK (
        (budget_min IS NULL OR budget_min >= 0) AND
        (budget_max IS NULL OR budget_max >= 0) AND
        (budget_min IS NULL OR budget_max IS NULL OR budget_min <= budget_max)
    ),
    CONSTRAINT chk_leads_contact_method CHECK (
        preferred_contact_method IN ('Phone', 'Email', 'WhatsApp', 'SMS')
    ),
    CONSTRAINT chk_leads_contact_time CHECK (
        preferred_contact_time IN ('Morning', 'Afternoon', 'Evening', 'Any Time')
    )
);

-- Documentation Comments
COMMENT ON TABLE leads IS 'Central CRM entity representing customer inquiries and potential buyers.';
COMMENT ON COLUMN leads.project_id IS 'Optional. The specific project the lead inquired about (ON DELETE SET NULL ensures lead survives project deletion).';
COMMENT ON COLUMN leads.property_id IS 'Optional. The specific property unit the lead inquired about (ON DELETE SET NULL ensures lead survives unit deletion).';
COMMENT ON COLUMN leads.deleted_at IS 'Soft delete timestamp. Historic CRM records must never be permanently removed for accurate yearly reporting.';

-- B-Tree Indexes
CREATE INDEX idx_leads_phone ON leads(phone_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_email ON leads(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_status ON leads(lead_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_source ON leads(lead_source) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_priority ON leads(crm_priority) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_project_id ON leads(project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_property_id ON leads(property_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_next_follow_up ON leads(next_follow_up_at) WHERE deleted_at IS NULL AND lead_status NOT IN ('BOOKED', 'LOST');
CREATE INDEX idx_leads_created_at ON leads(created_at) WHERE deleted_at IS NULL;
