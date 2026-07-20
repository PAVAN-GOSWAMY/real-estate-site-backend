-- Phase 7.4.1: Property Publications Table
-- Tracks lifecycle states for property units

CREATE TYPE publication_status AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED', 'ARCHIVED', 'UNPUBLISHED', 'SCHEDULED', 'EXPIRED');

CREATE TABLE property_publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE,
    
    status publication_status NOT NULL DEFAULT 'DRAFT'::publication_status,
    notes TEXT,
    
    scheduled_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID, -- Reserved for future Auth phase
    
    -- We soft delete rows if needed, but normally this is an append-only ledger
    deleted_at TIMESTAMPTZ
);

-- Documentation Comments
COMMENT ON TABLE property_publications IS 'Ledger for tracking property publication state changes.';

-- Indexes
CREATE INDEX idx_property_publications_property_id ON property_publications(property_id);
CREATE INDEX idx_property_publications_status ON property_publications(status);
CREATE INDEX idx_property_publications_created_at ON property_publications(created_at);
