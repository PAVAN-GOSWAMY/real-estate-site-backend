-- Phase 4.1.5: Lead Assignments Master Table
-- Tracks the ownership lifecycle of a lead

CREATE TABLE lead_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    lead_id UUID NOT NULL REFERENCES leads(id) ON UPDATE CASCADE ON DELETE CASCADE,
    assigned_to UUID NOT NULL, -- References auth.users(id) in future
    assigned_by UUID, -- References auth.users(id) in future
    
    assignment_strategy VARCHAR(50) NOT NULL DEFAULT 'MANUAL', -- 'MANUAL', 'ROUND_ROBIN', 'TERRITORY', 'PROJECT', 'PRIORITY', 'MANAGER_OVERRIDE'
    assignment_reason TEXT,
    assignment_notes TEXT,
    
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE lead_assignments IS 'Tracks historical ledger of lead assignments. Only one active assignment per lead.';
COMMENT ON COLUMN lead_assignments.is_active IS 'True for the current assignment. Application logic ensures only one row per lead is active.';

CREATE INDEX idx_lead_assignments_lead_id ON lead_assignments(lead_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_lead_assignments_assigned_to ON lead_assignments(assigned_to) WHERE deleted_at IS NULL;
CREATE INDEX idx_lead_assignments_is_active ON lead_assignments(is_active) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX idx_lead_assignments_created_at ON lead_assignments(created_at) WHERE deleted_at IS NULL;
