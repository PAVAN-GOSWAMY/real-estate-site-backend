-- Phase 4.1.7: Lead Notes
-- Centralized knowledge repository for CRM interactions

CREATE TABLE lead_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    lead_id UUID NOT NULL REFERENCES leads(id) ON UPDATE CASCADE ON DELETE CASCADE,
    author_id UUID, -- References auth.users(id)
    
    note_type VARCHAR(50) NOT NULL DEFAULT 'GENERAL', -- 'GENERAL', 'CALL_SUMMARY', 'MEETING_SUMMARY', 'SITE_VISIT', 'NEGOTIATION', 'CUSTOMER_FEEDBACK', 'INTERNAL_DISCUSSION', 'REMINDER', 'SYSTEM_GENERATED', 'OTHER'
    content TEXT NOT NULL,
    
    visibility VARCHAR(20) NOT NULL DEFAULT 'SHARED', -- 'PRIVATE', 'SHARED'
    
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    
    tags TEXT[],
    mentions UUID[], -- Array of user IDs mentioned in the note
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT chk_lead_notes_type CHECK (
        note_type IN (
            'GENERAL', 'CALL_SUMMARY', 'MEETING_SUMMARY', 'SITE_VISIT', 
            'NEGOTIATION', 'CUSTOMER_FEEDBACK', 'INTERNAL_DISCUSSION', 
            'REMINDER', 'SYSTEM_GENERATED', 'OTHER'
        )
    ),
    CONSTRAINT chk_lead_notes_visibility CHECK (
        visibility IN ('PRIVATE', 'SHARED')
    )
);

COMMENT ON TABLE lead_notes IS 'Rich text notes and summaries attached to a lead. Supports pinning, mentions, and private visibility.';

CREATE INDEX idx_lead_notes_lead_id ON lead_notes(lead_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_lead_notes_author_id ON lead_notes(author_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_lead_notes_is_pinned ON lead_notes(is_pinned) WHERE deleted_at IS NULL AND is_pinned = true;
CREATE INDEX idx_lead_notes_created_at ON lead_notes(created_at) WHERE deleted_at IS NULL;
-- GIN index for tags array
CREATE INDEX idx_lead_notes_tags ON lead_notes USING GIN(tags);
