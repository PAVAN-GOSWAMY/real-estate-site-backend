-- Phase 4.1.8: Lead Timeline Table
-- Immutable ledger for all CRM events

CREATE TABLE lead_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    lead_id UUID NOT NULL REFERENCES leads(id) ON UPDATE CASCADE ON DELETE CASCADE,
    
    category VARCHAR(100) NOT NULL, -- 'Lead', 'Assignment', 'Status', 'Preference', 'Follow-up', 'Note', 'Site Visit', 'Communication', 'Property', 'Notification', 'System', 'Security'
    event_type VARCHAR(100) NOT NULL,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    actor_id UUID, -- References auth.users(id) or null if system generated
    actor_role VARCHAR(100),
    
    source_module VARCHAR(100) NOT NULL,
    reference_entity VARCHAR(100),
    reference_id UUID,
    
    metadata JSONB,
    
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT chk_lead_timeline_category CHECK (
        category IN (
            'Lead', 'Assignment', 'Status', 'Preference', 'Follow-up', 
            'Note', 'Site Visit', 'Communication', 'Property', 
            'Notification', 'System', 'Security'
        )
    )
);

COMMENT ON TABLE lead_timeline IS 'Immutable chronological ledger that records every business event and customer interaction across the CRM.';

CREATE INDEX idx_lead_timeline_lead_id ON lead_timeline(lead_id);
CREATE INDEX idx_lead_timeline_category ON lead_timeline(category);
CREATE INDEX idx_lead_timeline_event_type ON lead_timeline(event_type);
CREATE INDEX idx_lead_timeline_actor_id ON lead_timeline(actor_id);
CREATE INDEX idx_lead_timeline_reference ON lead_timeline(reference_entity, reference_id);
CREATE INDEX idx_lead_timeline_occurred_at ON lead_timeline(occurred_at);
-- GIN index for robust JSONB metadata queries
CREATE INDEX idx_lead_timeline_metadata ON lead_timeline USING GIN(metadata);
