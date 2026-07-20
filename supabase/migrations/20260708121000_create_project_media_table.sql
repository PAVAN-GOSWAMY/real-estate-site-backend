-- Phase 3.4.5: Project Media Master Table
-- Established according to Square AR Spaces Database Engineering Standards

CREATE TABLE project_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationships
    project_id UUID NOT NULL REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE,
    
    -- Core Classification
    media_type media_type NOT NULL DEFAULT 'IMAGE'::media_type,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Storage Engine Mapping
    storage_bucket VARCHAR(100) NOT NULL,
    storage_path VARCHAR(1024) NOT NULL,
    public_url VARCHAR(1024) NOT NULL,
    thumbnail_url VARCHAR(1024),
    
    -- SEO & Accessibility
    alt_text VARCHAR(255),
    caption TEXT,
    
    -- File Metadata
    mime_type VARCHAR(100),
    file_size BIGINT, -- BIGINT used as high-res videos can exceed INTEGER byte limits
    width INTEGER,
    height INTEGER,
    duration_seconds INTEGER,
    
    -- UI & Config
    display_order INTEGER NOT NULL DEFAULT 0,
    is_cover BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Audit & Timestamps
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    created_by UUID, -- Reserved for auth.users(id) in future Phase
    updated_by UUID, -- Reserved for auth.users(id) in future Phase
    
    -- Constraints
    CONSTRAINT chk_project_media_display_order CHECK (display_order >= 0),
    CONSTRAINT chk_project_media_dimensions CHECK (
        (width IS NULL OR width > 0) AND 
        (height IS NULL OR height > 0)
    ),
    CONSTRAINT chk_project_media_duration CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
    CONSTRAINT chk_project_media_file_size CHECK (file_size IS NULL OR file_size > 0)
);

-- Documentation Comments
COMMENT ON TABLE project_media IS 'Digital Asset Management table for projects. Normalizes images, videos, and PDFs away from the main projects table.';
COMMENT ON COLUMN project_media.project_id IS 'Foreign key linking the media asset to its parent project.';
COMMENT ON COLUMN project_media.storage_path IS 'Exact internal path within the Supabase Storage bucket (e.g., project_id/gallery/hero.webp).';
COMMENT ON COLUMN project_media.public_url IS 'Resolvable CDN link for frontend rendering.';
COMMENT ON COLUMN project_media.is_cover IS 'Indicates if this media should be used as the primary hero image. Application logic ensures only one cover exists per project.';
COMMENT ON COLUMN project_media.deleted_at IS 'Soft delete timestamp. Media records are preserved for historic audits.';

-- B-Tree Indexes
CREATE INDEX idx_project_media_project_id ON project_media(project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_project_media_type ON project_media(media_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_project_media_is_cover ON project_media(is_cover) WHERE deleted_at IS NULL AND is_cover = true;
CREATE INDEX idx_project_media_is_featured ON project_media(is_featured) WHERE deleted_at IS NULL AND is_featured = true;
CREATE INDEX idx_project_media_is_active ON project_media(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_project_media_display_order ON project_media(display_order);
