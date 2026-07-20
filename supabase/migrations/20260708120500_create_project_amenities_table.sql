-- Phase 3.4.4: Project Amenities Junction Table
-- Established according to Square AR Spaces Database Engineering Standards

CREATE TABLE project_amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationships
    project_id UUID NOT NULL REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES amenities(id) ON UPDATE CASCADE ON DELETE CASCADE,
    
    -- Configuration & UI
    display_order INTEGER NOT NULL DEFAULT 0,
    is_highlighted BOOLEAN NOT NULL DEFAULT false,
    
    -- Admin Content
    notes TEXT,
    
    -- Audit & Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    created_by UUID, -- Reserved for auth.users(id) in future Phase
    updated_by UUID, -- Reserved for auth.users(id) in future Phase
    
    -- Constraints
    CONSTRAINT uq_project_amenities_combo UNIQUE (project_id, amenity_id),
    CONSTRAINT chk_project_amenities_display_order CHECK (display_order >= 0)
);

-- Documentation Comments
COMMENT ON TABLE project_amenities IS 'Junction table establishing a many-to-many relationship between projects and community amenities. Prevents data duplication across individual properties.';
COMMENT ON COLUMN project_amenities.project_id IS 'Foreign key linking to the parent project.';
COMMENT ON COLUMN project_amenities.amenity_id IS 'Foreign key linking to the master amenity dictionary.';
COMMENT ON COLUMN project_amenities.is_highlighted IS 'Flags premium/important amenities to be displayed at the top of the Project UI.';
COMMENT ON COLUMN project_amenities.notes IS 'Optional internal admin notes (e.g., "Operational from Dec 2027").';
COMMENT ON COLUMN project_amenities.deleted_at IS 'Soft delete timestamp. If populated, the amenity relation is considered removed from the project.';

-- B-Tree Indexes
CREATE INDEX idx_project_amenities_project_id ON project_amenities(project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_project_amenities_amenity_id ON project_amenities(amenity_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_project_amenities_is_highlighted ON project_amenities(is_highlighted) WHERE deleted_at IS NULL AND is_highlighted = true;
CREATE INDEX idx_project_amenities_display_order ON project_amenities(display_order);
