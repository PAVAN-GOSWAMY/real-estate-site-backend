-- Phase 4.1.6: Lead Status State Machine Upgrades

-- 1. Upgrade the lead_status ENUM safely
-- Note: Postgres allows ADD VALUE, but it cannot be inside a transaction block in older versions.
-- Supabase handles this gracefully when run individually.
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'QUALIFIED' AFTER 'NEW';
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'INTERESTED' AFTER 'CONTACTED';
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'WON' AFTER 'BOOKED';
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'CLOSED' AFTER 'LOST';

-- 2. Alter leads table to support terminal reasons
ALTER TABLE leads ADD COLUMN IF NOT EXISTS win_reason TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS close_reason TEXT;

-- 3. Create the Lead Status History table for stage tracking
CREATE TABLE lead_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    lead_id UUID NOT NULL REFERENCES leads(id) ON UPDATE CASCADE ON DELETE CASCADE,
    previous_status lead_status,
    new_status lead_status NOT NULL,
    
    changed_by UUID, -- References auth.users(id)
    reason TEXT,
    
    duration_minutes INTEGER, -- Time spent in the previous_status
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE lead_status_history IS 'Immutable ledger of lead status transitions for pipeline velocity analytics.';

CREATE INDEX idx_lead_status_history_lead_id ON lead_status_history(lead_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_lead_status_history_new_status ON lead_status_history(new_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_lead_status_history_created_at ON lead_status_history(created_at) WHERE deleted_at IS NULL;
