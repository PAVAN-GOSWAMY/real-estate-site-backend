-- Phase 7.4.6: Favorites & Shortlisting Tables
-- Dual-tier architecture for simple favorites and complex CRM shortlists

CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Reference to auth.users or profiles
    property_id UUID NOT NULL REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT uq_user_favorite UNIQUE(user_id, property_id)
);

COMMENT ON TABLE user_favorites IS 'Flat, fast bucket for user property likes/bookmarks.';

CREATE TABLE property_shortlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Owner of the shortlist
    lead_id UUID REFERENCES leads(id) ON UPDATE CASCADE ON DELETE SET NULL, -- Optional linking to CRM
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    share_token UUID UNIQUE DEFAULT gen_random_uuid(),
    expires_at TIMESTAMPTZ,
    
    is_archived BOOLEAN NOT NULL DEFAULT false,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE property_shortlists IS 'Curated collections (folders) of properties managed by users or CRM execs.';

CREATE TYPE shortlist_item_priority AS ENUM ('HIGH', 'NORMAL', 'LOW');

CREATE TABLE property_shortlist_items (
    shortlist_id UUID NOT NULL REFERENCES property_shortlists(id) ON UPDATE CASCADE ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE,
    
    notes TEXT,
    priority shortlist_item_priority NOT NULL DEFAULT 'NORMAL',
    
    added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    PRIMARY KEY(shortlist_id, property_id)
);

COMMENT ON TABLE property_shortlist_items IS 'Properties within a shortlist with private notes and priority metadata.';

-- Indexes
CREATE INDEX idx_user_fav_user ON user_favorites(user_id);
CREATE INDEX idx_shortlists_user ON property_shortlists(user_id);
CREATE INDEX idx_shortlists_lead ON property_shortlists(lead_id);
CREATE INDEX idx_shortlists_share ON property_shortlists(share_token);
CREATE INDEX idx_shortlist_items_sid ON property_shortlist_items(shortlist_id);
CREATE INDEX idx_shortlist_items_pid ON property_shortlist_items(property_id);
