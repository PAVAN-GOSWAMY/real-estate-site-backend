-- Phase 3.4.6: Property Images Master Table
-- Established according to Square AR Spaces Database Engineering Standards

CREATE TABLE property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationships
    property_id UUID NOT NULL REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE,
    
    -- Core Classification
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_type VARCHAR(100) NOT NULL,
    room_name VARCHAR(100), -- Free text for highly specific rooms (e.g., 'Servants Quarters')
    
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
    file_size BIGINT,
    width INTEGER,
    height INTEGER,
    
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
    CONSTRAINT chk_property_images_type CHECK (
        image_type IN (
            'INTERIOR', 'EXTERIOR', 'ROOM', 'VIEW', 'BALCONY', 'KITCHEN', 
            'BATHROOM', 'BEDROOM', 'LIVING_ROOM', 'DINING', 'PARKING', 
            'ENTRANCE', 'MASTER_BEDROOM'
        )
    ),
    CONSTRAINT chk_property_images_display_order CHECK (display_order >= 0),
    CONSTRAINT chk_property_images_dimensions CHECK (
        (width IS NULL OR width > 0) AND 
        (height IS NULL OR height > 0)
    ),
    CONSTRAINT chk_property_images_file_size CHECK (file_size IS NULL OR file_size > 0)
);

-- Documentation Comments
COMMENT ON TABLE property_images IS 'Digital Asset Management for individual property units. Normalizes unit-specific photos (e.g., Unit 1402 Living Room) away from the main properties table.';
COMMENT ON COLUMN property_images.property_id IS 'Foreign key linking the image to its specific parent property unit.';
COMMENT ON COLUMN property_images.image_type IS 'Validated string categorizing the photo. Enforced via CHECK constraint rather than ENUM to allow easier future migrations.';
COMMENT ON COLUMN property_images.storage_path IS 'Exact internal path within the Supabase Storage bucket (e.g., property_id/gallery/living_room.webp).';
COMMENT ON COLUMN property_images.is_cover IS 'Indicates if this image should be used as the primary thumbnail in search results. Application logic ensures only one cover exists per property.';
COMMENT ON COLUMN property_images.deleted_at IS 'Soft delete timestamp. Media records are preserved for historic audits.';

-- B-Tree Indexes
CREATE INDEX idx_property_images_property_id ON property_images(property_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_property_images_type ON property_images(image_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_property_images_is_cover ON property_images(is_cover) WHERE deleted_at IS NULL AND is_cover = true;
CREATE INDEX idx_property_images_is_featured ON property_images(is_featured) WHERE deleted_at IS NULL AND is_featured = true;
CREATE INDEX idx_property_images_is_active ON property_images(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_property_images_display_order ON property_images(display_order);
