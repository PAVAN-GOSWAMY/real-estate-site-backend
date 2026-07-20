-- Phase 3.4.8: Property Brochures Master Table
-- Established according to Square AR Spaces Database Engineering Standards

CREATE TABLE property_brochures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationships
    property_id UUID NOT NULL REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE,
    
    -- Core Classification
    brochure_name VARCHAR(255) NOT NULL,
    brochure_code VARCHAR(100) NOT NULL,
    brochure_type VARCHAR(100) NOT NULL,
    description TEXT,
    version VARCHAR(50) DEFAULT 'v1.0',
    language VARCHAR(50) DEFAULT 'en', -- ISO 639-1 language code (e.g., 'en', 'hi', 'ar')
    
    -- Storage Engine Mapping
    storage_bucket VARCHAR(100) NOT NULL,
    storage_path VARCHAR(1024) NOT NULL,
    public_url VARCHAR(1024) NOT NULL,
    thumbnail_url VARCHAR(1024),
    file_name VARCHAR(255) NOT NULL,
    
    -- File Metadata
    mime_type VARCHAR(100) NOT NULL DEFAULT 'application/pdf',
    file_size BIGINT,
    page_count INTEGER,
    
    -- UI & Config
    is_downloadable BOOLEAN NOT NULL DEFAULT true,
    is_latest_version BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Analytics
    download_count INTEGER NOT NULL DEFAULT 0,
    
    -- Audit & Timestamps
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    created_by UUID, -- Reserved for auth.users(id) in future Phase
    updated_by UUID, -- Reserved for auth.users(id) in future Phase
    
    -- Constraints
    CONSTRAINT uq_property_brochures_code UNIQUE (property_id, brochure_code),
    CONSTRAINT chk_property_brochures_type CHECK (
        brochure_type IN (
            'SALES_BROCHURE', 'PRICE_LIST', 'PAYMENT_PLAN', 
            'SPECIFICATION_SHEET', 'CONSTRUCTION_UPDATE', 
            'INVENTORY_SHEET', 'LEGAL_DOCUMENT', 'MARKETING_BROCHURE'
        )
    ),
    CONSTRAINT chk_property_brochures_file_size CHECK (file_size IS NULL OR file_size > 0),
    CONSTRAINT chk_property_brochures_page_count CHECK (page_count IS NULL OR page_count > 0),
    CONSTRAINT chk_property_brochures_downloads CHECK (download_count >= 0)
);

-- Documentation Comments
COMMENT ON TABLE property_brochures IS 'Stores downloadable business and marketing documents for individual property units (e.g., Price Lists, Legal PDFs).';
COMMENT ON COLUMN property_brochures.property_id IS 'Foreign key linking the document to its parent property unit.';
COMMENT ON COLUMN property_brochures.brochure_code IS 'Unique CRM identifier for tracking specific document iterations.';
COMMENT ON COLUMN property_brochures.brochure_type IS 'Validated string categorizing the document (e.g., PRICE_LIST, PAYMENT_PLAN).';
COMMENT ON COLUMN property_brochures.version IS 'Tracks document iteration (e.g., v1.0, v2.0). Ensures users get the latest pricing rules.';
COMMENT ON COLUMN property_brochures.is_latest_version IS 'Flags the most current version. Application logic ensures only one latest version exists per type per unit.';
COMMENT ON COLUMN property_brochures.download_count IS 'Analytics metric used to gauge CRM lead intent. A user downloading a Price List has higher intent than a gallery view.';
COMMENT ON COLUMN property_brochures.deleted_at IS 'Soft delete timestamp. Historic brochures must remain valid for CRM audits.';

-- B-Tree Indexes
CREATE INDEX idx_property_brochures_property_id ON property_brochures(property_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_property_brochures_type ON property_brochures(brochure_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_property_brochures_is_latest ON property_brochures(is_latest_version) WHERE deleted_at IS NULL AND is_latest_version = true;
CREATE INDEX idx_property_brochures_is_downloadable ON property_brochures(is_downloadable) WHERE deleted_at IS NULL AND is_downloadable = true;
CREATE INDEX idx_property_brochures_is_featured ON property_brochures(is_featured) WHERE deleted_at IS NULL AND is_featured = true;
CREATE INDEX idx_property_brochures_is_active ON property_brochures(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_property_brochures_dates ON property_brochures(uploaded_at) WHERE deleted_at IS NULL;
