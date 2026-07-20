-- Phase 7.4.5: Property Comparison Tables
-- Session-based ledger for comparing multiple properties without data duplication

CREATE TABLE property_comparison_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- Optional: links comparison to a specific user/CRM lead
    
    title VARCHAR(255),
    share_token UUID UNIQUE DEFAULT gen_random_uuid(),
    
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE property_comparison_sessions IS 'Acts as a shopping cart for property comparisons. Can be anonymous or linked to a user.';

CREATE TABLE property_comparison_items (
    session_id UUID NOT NULL REFERENCES property_comparison_sessions(id) ON UPDATE CASCADE ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE,
    
    display_order INTEGER NOT NULL DEFAULT 0,
    added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    PRIMARY KEY (session_id, property_id) -- Naturally prevents duplicate properties in the same session
);

COMMENT ON TABLE property_comparison_items IS 'Many-to-many link resolving properties included in a specific comparison session.';

-- Indexes
CREATE INDEX idx_prop_comp_session_user ON property_comparison_sessions(user_id);
CREATE INDEX idx_prop_comp_session_share ON property_comparison_sessions(share_token);
CREATE INDEX idx_prop_comp_items_session ON property_comparison_items(session_id);
CREATE INDEX idx_prop_comp_items_property ON property_comparison_items(property_id);
