-- Phase 5.3: Analytics Module Architecture
-- Established according to Square AR Spaces Database Engineering Standards

-- =========================================================================
-- Table 1: Analytics Events
-- =========================================================================

CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Event Definition
    event_name VARCHAR(255) NOT NULL,
    event_category VARCHAR(100) NOT NULL,
    event_source VARCHAR(150),
    
    -- Entity Context
    entity_type VARCHAR(100),
    entity_id UUID,
    
    -- User Context
    user_id UUID, -- Open reference to auth.users or profiles
    session_id VARCHAR(255),
    
    -- Client & Network Context
    ip_address VARCHAR(45), -- Supports IPv6 lengths
    user_agent TEXT,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    operating_system VARCHAR(100),
    
    -- Geo Context
    country VARCHAR(100),
    state VARCHAR(100),
    city VARCHAR(100),
    
    -- Flexible Payload
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps (Immutable)
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Constraints
    CONSTRAINT chk_analytics_events_category CHECK (
        event_category IN (
            'Authentication', 'Lead', 'CRM', 'Project', 'Property', 
            'Media', 'Career', 'Website', 'Marketing', 'System'
        )
    )
);

-- Documentation Comments
COMMENT ON TABLE analytics_events IS 'Immutable ledger storing raw business and system events (e.g., Property Viewed, Lead Converted).';
COMMENT ON COLUMN analytics_events.metadata IS 'Flexible JSONB payload allowing custom attributes without altering schema.';

-- B-Tree Indexes
CREATE INDEX idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_category ON analytics_events(event_category);
CREATE INDEX idx_analytics_events_entity_type ON analytics_events(entity_type);
CREATE INDEX idx_analytics_events_entity_id ON analytics_events(entity_id);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_occurred_at ON analytics_events(occurred_at);

-- GIN Index for fast JSONB querying
CREATE INDEX idx_analytics_events_metadata ON analytics_events USING GIN (metadata);


-- =========================================================================
-- Table 2: Analytics Daily Summary
-- =========================================================================

CREATE TABLE analytics_daily_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Date Axis
    summary_date DATE NOT NULL UNIQUE,
    
    -- CRM Metrics
    new_leads INTEGER NOT NULL DEFAULT 0,
    converted_leads INTEGER NOT NULL DEFAULT 0,
    lost_leads INTEGER NOT NULL DEFAULT 0,
    
    -- Operations Metrics
    site_visits INTEGER NOT NULL DEFAULT 0,
    completed_site_visits INTEGER NOT NULL DEFAULT 0,
    
    -- Inventory Metrics
    new_projects INTEGER NOT NULL DEFAULT 0,
    new_properties INTEGER NOT NULL DEFAULT 0,
    
    -- Engagement Metrics
    property_views INTEGER NOT NULL DEFAULT 0,
    brochure_downloads INTEGER NOT NULL DEFAULT 0,
    video_views INTEGER NOT NULL DEFAULT 0,
    
    -- Traffic Metrics
    website_visitors INTEGER NOT NULL DEFAULT 0,
    returning_visitors INTEGER NOT NULL DEFAULT 0,
    active_users INTEGER NOT NULL DEFAULT 0,
    
    -- Financial Metrics
    total_revenue NUMERIC(20, 2) NOT NULL DEFAULT 0.00,
    average_conversion_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Constraints
    CONSTRAINT chk_analytics_daily_leads CHECK (
        new_leads >= 0 AND converted_leads >= 0 AND lost_leads >= 0
    ),
    CONSTRAINT chk_analytics_daily_visits CHECK (
        site_visits >= 0 AND completed_site_visits >= 0
    ),
    CONSTRAINT chk_analytics_daily_inventory CHECK (
        new_projects >= 0 AND new_properties >= 0
    ),
    CONSTRAINT chk_analytics_daily_engagement CHECK (
        property_views >= 0 AND brochure_downloads >= 0 AND video_views >= 0
    ),
    CONSTRAINT chk_analytics_daily_traffic CHECK (
        website_visitors >= 0 AND returning_visitors >= 0 AND active_users >= 0
    ),
    CONSTRAINT chk_analytics_daily_revenue CHECK (total_revenue >= 0),
    CONSTRAINT chk_analytics_daily_conversion CHECK (
        average_conversion_rate >= 0 AND average_conversion_rate <= 100
    )
);

-- Documentation Comments
COMMENT ON TABLE analytics_daily_summary IS 'Pre-calculated daily aggregations to prevent expensive table scans on the raw events table during dashboard rendering.';
COMMENT ON COLUMN analytics_daily_summary.summary_date IS 'Unique date identifier ensuring exactly one row per calendar day.';

-- B-Tree Indexes
CREATE INDEX idx_analytics_daily_date ON analytics_daily_summary(summary_date);
CREATE INDEX idx_analytics_daily_revenue ON analytics_daily_summary(total_revenue);
CREATE INDEX idx_analytics_daily_new_leads ON analytics_daily_summary(new_leads);
