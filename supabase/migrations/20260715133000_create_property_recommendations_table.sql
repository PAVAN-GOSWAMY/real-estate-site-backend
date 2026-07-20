-- Phase 7.4.4: Property Recommendations Table
-- Ledger for managing editorially curated and business-driven recommendations.

CREATE TYPE recommendation_category AS ENUM (
    'FEATURED',
    'TRENDING', 
    'RECOMMENDED', 
    'EDITORS_CHOICE', 
    'LUXURY_COLLECTION', 
    'INVESTMENT_OPPORTUNITY', 
    'NEW_LAUNCH', 
    'READY_TO_MOVE', 
    'HOT_DEAL', 
    'PREMIUM_LISTING', 
    'VERIFIED_PICK', 
    'STAFF_PICK'
);

CREATE TABLE property_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE,
    
    category recommendation_category NOT NULL,
    collection_name VARCHAR(150), -- Useful for dynamic collections like "Top 10 in Bandra"
    
    recommendation_score NUMERIC(5, 2) NOT NULL DEFAULT 50.00,
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Prevent duplicate active categories per property
    CONSTRAINT uq_property_recommendation UNIQUE (property_id, category, collection_name),
    CONSTRAINT chk_recommendation_score CHECK (recommendation_score >= 0 AND recommendation_score <= 100)
);

COMMENT ON TABLE property_recommendations IS 'Maps properties to diverse recommendation categories (Trending, Hot Deals, etc.) with independent editorial scores.';

-- Indexes for ultra-fast homepage queries
CREATE INDEX idx_prop_rec_property ON property_recommendations(property_id);
CREATE INDEX idx_prop_rec_category ON property_recommendations(category) WHERE is_active = true;
CREATE INDEX idx_prop_rec_collection ON property_recommendations(collection_name) WHERE is_active = true;
CREATE INDEX idx_prop_rec_score ON property_recommendations(recommendation_score DESC);
