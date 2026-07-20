-- Phase 5.1: Profiles Master Table (Extending auth.users)
-- Established according to Square AR Spaces Database Engineering Standards

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Identity Data
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    avatar_url VARCHAR(1024),
    
    -- Organizational Data (Leverages Phase 3.2 ENUMs)
    user_role user_role NOT NULL DEFAULT 'VIEWER'::user_role,
    department VARCHAR(100),
    job_title VARCHAR(100),
    employee_code VARCHAR(50),
    
    -- State & Timestamps
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMPTZ,
    
    -- Audit Fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    created_by UUID, -- Can self-reference in future, or reference other profiles
    updated_by UUID,
    
    -- Constraints
    CONSTRAINT uq_profiles_email UNIQUE (email),
    CONSTRAINT uq_profiles_employee_code UNIQUE (employee_code),
    CONSTRAINT chk_profiles_phone CHECK (phone_number IS NULL OR phone_number ~ '^\+?[0-9\s\-]{7,20}$')
);

-- Documentation Comments
COMMENT ON TABLE profiles IS 'Extends Supabase auth.users to store business-specific organizational information (roles, department) without duplicating authentication logic.';
COMMENT ON COLUMN profiles.id IS 'Primary Key mapping 1:1 to auth.users.id. ON DELETE CASCADE ensures the profile is instantly wiped if the user is deleted from the core auth system.';
COMMENT ON COLUMN profiles.user_role IS 'Leverages Phase 3.2 user_role ENUM (e.g., SUPER_ADMIN, SALES_EXECUTIVE) to drive future RBAC logic.';
COMMENT ON COLUMN profiles.employee_code IS 'Internal HR identifier. Unique constraint prevents duplicate assignments.';
COMMENT ON COLUMN profiles.deleted_at IS 'Soft delete timestamp. Historic user references (like who created a lead in 2024) must remain valid for audit tracking.';

-- B-Tree Indexes
CREATE INDEX idx_profiles_email ON profiles(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_role ON profiles(user_role) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_department ON profiles(department) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_active ON profiles(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_employee_code ON profiles(employee_code) WHERE deleted_at IS NULL;
