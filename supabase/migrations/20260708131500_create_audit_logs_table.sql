-- Phase 5.5: Audit Logs Module Architecture
-- Established according to Square AR Spaces Database Engineering Standards

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Actor
    user_id UUID REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE SET NULL,
    
    -- Action Definition
    action VARCHAR(100) NOT NULL,
    module VARCHAR(100) NOT NULL,
    
    -- Target Entity
    entity_type VARCHAR(100),
    entity_id UUID,
    entity_name VARCHAR(255),
    
    -- Request Context
    http_method VARCHAR(20),
    request_path VARCHAR(1024),
    
    -- Client & Network Context
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    operating_system VARCHAR(100),
    
    -- Geo Context
    country VARCHAR(100),
    state VARCHAR(100),
    city VARCHAR(100),
    
    -- Data State Changes
    old_values JSONB DEFAULT '{}'::jsonb,
    new_values JSONB DEFAULT '{}'::jsonb,
    change_summary TEXT,
    
    -- Execution State
    status VARCHAR(50) NOT NULL DEFAULT 'SUCCESS',
    error_message TEXT,
    
    -- Tracing
    session_id VARCHAR(255),
    request_id VARCHAR(255),
    
    -- Timestamps (Immutable)
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Constraints
    CONSTRAINT chk_audit_logs_status CHECK (status IN ('SUCCESS', 'FAILED', 'PARTIAL'))
);

-- Documentation Comments
COMMENT ON TABLE audit_logs IS 'Immutable, highly granular ledger tracking every critical administrative and user action for compliance, security, and forensic analysis.';
COMMENT ON COLUMN audit_logs.user_id IS 'Foreign key to the acting user. ON DELETE SET NULL ensures that if an employee profile is deleted, the historical audit log of their actions securely survives.';
COMMENT ON COLUMN audit_logs.old_values IS 'JSONB snapshot of data before the UPDATE/DELETE action. Crucial for rollback and forensic investigation.';
COMMENT ON COLUMN audit_logs.new_values IS 'JSONB snapshot of data after the CREATE/UPDATE action.';

-- B-Tree Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_module ON audit_logs(module);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_occurred_at ON audit_logs(occurred_at);
CREATE INDEX idx_audit_logs_session_id ON audit_logs(session_id);
CREATE INDEX idx_audit_logs_request_id ON audit_logs(request_id);
CREATE INDEX idx_audit_logs_status ON audit_logs(status);

-- GIN Indexes for deep JSON search
CREATE INDEX idx_audit_logs_old_values ON audit_logs USING GIN (old_values);
CREATE INDEX idx_audit_logs_new_values ON audit_logs USING GIN (new_values);
