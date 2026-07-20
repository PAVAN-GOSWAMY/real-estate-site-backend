-- Phase 3.4.9: Property Videos Master Table
-- Established according to Square AR Spaces Database Engineering Standards

CREATE TABLE property_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationships
    property_id UUID NOT NULL REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE,
    
    -- Core Classification
    video_name VARCHAR(255) NOT NULL,
    video_code VARCHAR(100) NOT NULL,
    video_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Provider Mapping (Native Storage vs External CDN like YouTube/Vimeo)
    video_provider VARCHAR(50) NOT NULL DEFAULT 'SUPABASE',
    provider_video_id VARCHAR(255),
    
    -- Storage Engine Mapping (Used if video_provider = SUPABASE)
    storage_bucket VARCHAR(100),
    storage_path VARCHAR(1024),
    public_url VARCHAR(1024),
    thumbnail_url VARCHAR(1024),
    preview_image_url VARCHAR(1024),
    
    -- Technical Metadata
    duration_seconds INTEGER,
    resolution VARCHAR(50), -- e.g., '1920x1080', '3840x2160'
    frame_rate INTEGER,
    bitrate INTEGER,
    mime_type VARCHAR(100) DEFAULT 'video/mp4',
    file_size BIGINT,
    
    -- Localization & Accessibility
    language VARCHAR(50) DEFAULT 'en',
    subtitle_language VARCHAR(50),
    has_subtitles BOOLEAN NOT NULL DEFAULT false,
    
    -- UI & Config
    display_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_downloadable BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Analytics
    view_count INTEGER NOT NULL DEFAULT 0,
    
    -- Audit & Timestamps
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    created_by UUID, -- Reserved for auth.users(id) in future Phase
    updated_by UUID, -- Reserved for auth.users(id) in future Phase
    
    -- Constraints
    CONSTRAINT uq_property_videos_code UNIQUE (property_id, video_code),
    CONSTRAINT chk_property_videos_type CHECK (
        video_type IN (
            'WALKTHROUGH', '360_TOUR', 'DRONE_TOUR', 'INTERIOR_TOUR', 
            'EXTERIOR_TOUR', 'CONSTRUCTION_UPDATE', 'MARKETING_VIDEO', 
            'LIFESTYLE_VIDEO', 'CUSTOMER_TESTIMONIAL'
        )
    ),
    CONSTRAINT chk_property_videos_duration CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
    CONSTRAINT chk_property_videos_file_size CHECK (file_size IS NULL OR file_size >= 0),
    CONSTRAINT chk_property_videos_frame_rate CHECK (frame_rate IS NULL OR frame_rate >= 0),
    CONSTRAINT chk_property_videos_bitrate CHECK (bitrate IS NULL OR bitrate >= 0),
    CONSTRAINT chk_property_videos_views CHECK (view_count >= 0),
    CONSTRAINT chk_property_videos_display_order CHECK (display_order >= 0)
);

-- Documentation Comments
COMMENT ON TABLE property_videos IS 'Stores all video assets specifically related to an individual property unit. Supports native storage or external providers (YouTube/Vimeo).';
COMMENT ON COLUMN property_videos.property_id IS 'Foreign key linking the video to its parent property unit.';
COMMENT ON COLUMN property_videos.video_code IS 'Unique CRM identifier for tracking specific videos (e.g., WALK-A1203).';
COMMENT ON COLUMN property_videos.video_provider IS 'Indicates the CDN host (e.g., SUPABASE, YOUTUBE, VIMEO).';
COMMENT ON COLUMN property_videos.is_primary IS 'Indicates the default video shown to the user. Enforced via application logic.';
COMMENT ON COLUMN property_videos.view_count IS 'Analytics metric used to gauge video engagement and property interest.';
COMMENT ON COLUMN property_videos.deleted_at IS 'Soft delete timestamp. Media records are preserved for historic audits.';

-- B-Tree Indexes
CREATE INDEX idx_property_videos_property_id ON property_videos(property_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_property_videos_type ON property_videos(video_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_property_videos_is_primary ON property_videos(is_primary) WHERE deleted_at IS NULL AND is_primary = true;
CREATE INDEX idx_property_videos_is_featured ON property_videos(is_featured) WHERE deleted_at IS NULL AND is_featured = true;
CREATE INDEX idx_property_videos_is_downloadable ON property_videos(is_downloadable) WHERE deleted_at IS NULL AND is_downloadable = true;
CREATE INDEX idx_property_videos_is_active ON property_videos(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_property_videos_dates ON property_videos(uploaded_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_property_videos_views ON property_videos(view_count) WHERE deleted_at IS NULL;
