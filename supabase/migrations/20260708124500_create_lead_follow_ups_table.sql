-- Phase 4.3: Lead Follow-ups Master Table
-- Established according to Square AR Spaces Database Engineering Standards

CREATE TABLE lead_follow_ups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core Relationships
    lead_id UUID NOT NULL REFERENCES leads(id) ON UPDATE CASCADE ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON UPDATE CASCADE ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON UPDATE CASCADE ON DELETE SET NULL,
    
    -- Classification & Context
    follow_up_type VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    summary TEXT,
    detailed_notes TEXT,
    
    -- Communication Details
    communication_channel VARCHAR(100),
    communication_direction VARCHAR(50),
    outcome VARCHAR(100),
    
    -- Status Tracking (Using Phase 3.2 ENUMs)
    lead_status_before lead_status,
    lead_status_after lead_status,
    priority crm_priority NOT NULL DEFAULT 'MEDIUM'::crm_priority,
    
    -- Scheduling
    scheduled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    next_follow_up_at TIMESTAMPTZ,
    duration_minutes INTEGER,
    
    -- Execution Details
    assigned_to UUID, -- Reserved for future auth.users integration
    attachments_count INTEGER NOT NULL DEFAULT 0,
    customer_response TEXT,
    internal_notes TEXT,
    
    -- Flags
    is_completed BOOLEAN NOT NULL DEFAULT false,
    is_system_generated BOOLEAN NOT NULL DEFAULT false,
    
    -- Audit & Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    created_by UUID, -- Reserved for auth.users(id) in future Phase
    updated_by UUID, -- Reserved for auth.users(id) in future Phase
    
    -- Constraints
    CONSTRAINT chk_lead_follow_ups_type CHECK (
        follow_up_type IN (
            'Phone Call', 'WhatsApp', 'Email', 'SMS', 'Meeting', 
            'Office Visit', 'Reminder', 'Internal Note', 
            'Negotiation', 'Document Sharing'
        )
    ),
    CONSTRAINT chk_lead_follow_ups_channel CHECK (
        communication_channel IS NULL OR communication_channel IN (
            'Phone', 'WhatsApp', 'Email', 'SMS', 'In Person', 
            'Google Meet', 'Zoom', 'Microsoft Teams'
        )
    ),
    CONSTRAINT chk_lead_follow_ups_direction CHECK (
        communication_direction IS NULL OR communication_direction IN ('Incoming', 'Outgoing')
    ),
    CONSTRAINT chk_lead_follow_ups_outcome CHECK (
        outcome IS NULL OR outcome IN (
            'Connected', 'No Answer', 'Busy', 'Interested', 
            'Not Interested', 'Callback Requested', 
            'Meeting Scheduled', 'Site Visit Scheduled', 
            'Booked', 'Lost'
        )
    ),
    CONSTRAINT chk_lead_follow_ups_duration CHECK (duration_minutes IS NULL OR duration_minutes >= 0),
    CONSTRAINT chk_lead_follow_ups_attachments CHECK (attachments_count >= 0)
);

-- Documentation Comments
COMMENT ON TABLE lead_follow_ups IS 'Timeline of all CRM interactions (calls, meetings, notes) with a specific lead.';
COMMENT ON COLUMN lead_follow_ups.lead_id IS 'Foreign key to the parent lead. ON DELETE CASCADE ensures interactions are wiped if the lead is permanently removed.';
COMMENT ON COLUMN lead_follow_ups.project_id IS 'Optional link to a project if the follow-up was specifically about it. ON DELETE SET NULL ensures audit history survives.';
COMMENT ON COLUMN lead_follow_ups.lead_status_before IS 'Audit field tracking the lead status prior to this interaction.';
COMMENT ON COLUMN lead_follow_ups.lead_status_after IS 'Audit field tracking if this interaction successfully progressed the pipeline.';
COMMENT ON COLUMN lead_follow_ups.is_system_generated IS 'Flags automated communications (e.g., automated email drip campaigns).';

-- B-Tree Indexes
CREATE INDEX idx_lead_follow_ups_lead_id ON lead_follow_ups(lead_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_lead_follow_ups_project_id ON lead_follow_ups(project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_lead_follow_ups_property_id ON lead_follow_ups(property_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_lead_follow_ups_scheduled_at ON lead_follow_ups(scheduled_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_lead_follow_ups_next_follow_up ON lead_follow_ups(next_follow_up_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_lead_follow_ups_is_completed ON lead_follow_ups(is_completed) WHERE deleted_at IS NULL AND is_completed = false;
CREATE INDEX idx_lead_follow_ups_priority ON lead_follow_ups(priority) WHERE deleted_at IS NULL;
CREATE INDEX idx_lead_follow_ups_assigned_to ON lead_follow_ups(assigned_to) WHERE deleted_at IS NULL;
