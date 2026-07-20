-- Phase 5.2: Role-Based Access Control (RBAC) Architecture
-- Established according to Square AR Spaces Database Engineering Standards

-- =========================================================================
-- Table 1: Permissions Dictionary
-- =========================================================================

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identification
    module VARCHAR(100) NOT NULL,
    permission_name VARCHAR(150) NOT NULL,
    permission_code VARCHAR(150) NOT NULL,
    description TEXT,
    
    -- UI & Config
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Audit & Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    created_by UUID, -- Reserved for auth.users(id)
    updated_by UUID, -- Reserved for auth.users(id)
    
    -- Constraints
    CONSTRAINT uq_permissions_code UNIQUE (permission_code),
    CONSTRAINT chk_permissions_display_order CHECK (display_order >= 0)
);

-- Documentation Comments
COMMENT ON TABLE permissions IS 'Dictionary of all granular actions available in the system. Drives UI component visibility and API authorization.';
COMMENT ON COLUMN permissions.module IS 'Logical grouping for Admin Settings UI (e.g., CRM, Analytics, Projects).';
COMMENT ON COLUMN permissions.permission_code IS 'Machine-readable string explicitly used in NestJS Guards and RLS (e.g., projects.create).';

-- B-Tree Indexes
CREATE INDEX idx_permissions_module ON permissions(module) WHERE deleted_at IS NULL;
CREATE INDEX idx_permissions_code ON permissions(permission_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_permissions_active ON permissions(is_active) WHERE deleted_at IS NULL;


-- =========================================================================
-- Table 2: Role Permissions Mapping
-- =========================================================================

CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationships
    user_role user_role NOT NULL,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON UPDATE CASCADE ON DELETE CASCADE,
    
    -- Access Flag
    is_allowed BOOLEAN NOT NULL DEFAULT true,
    
    -- Audit & Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID,
    updated_by UUID,
    
    -- Constraints
    CONSTRAINT uq_role_permissions_mapping UNIQUE (user_role, permission_id)
);

-- Documentation Comments
COMMENT ON TABLE role_permissions IS 'Maps Phase 3.2 user_role ENUM to specific granular permissions from the permissions table.';
COMMENT ON COLUMN role_permissions.is_allowed IS 'Enables explicit allow/deny configuration per role without requiring destructive row deletion.';
COMMENT ON COLUMN role_permissions.permission_id IS 'Foreign key to permissions. ON DELETE CASCADE ensures mapping is destroyed if a permission is completely retired from the system.';

-- B-Tree Indexes
CREATE INDEX idx_role_permissions_role ON role_permissions(user_role);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);
CREATE INDEX idx_role_permissions_allowed ON role_permissions(is_allowed) WHERE is_allowed = true;
