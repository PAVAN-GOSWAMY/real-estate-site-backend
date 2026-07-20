-- Phase 5.4: Notifications Module Architecture
-- Established according to Square AR Spaces Database Engineering Standards

-- =========================================================================
-- Table 1: Notification Templates
-- =========================================================================

CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Definition
    template_name VARCHAR(255) NOT NULL,
    template_code VARCHAR(150) NOT NULL UNIQUE,
    notification_type notification_type NOT NULL,
    
    -- Content
    subject VARCHAR(255),
    title VARCHAR(255),
    body TEXT NOT NULL,
    variables JSONB DEFAULT '{}'::jsonb,
    language VARCHAR(50) DEFAULT 'en',
    
    -- Configuration
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Audit & Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    created_by UUID, -- Reserved for auth.users(id)
    updated_by UUID  -- Reserved for auth.users(id)
);

-- Documentation Comments
COMMENT ON TABLE notification_templates IS 'Centralized repository of notification templates (Email, SMS, WhatsApp) enabling marketing and ops to edit copy without code changes.';
COMMENT ON COLUMN notification_templates.variables IS 'JSONB array of expected Handlebars variables (e.g., {"customer_name": "string", "project_name": "string"}).';
COMMENT ON COLUMN notification_templates.notification_type IS 'Uses Phase 3.2 notification_type ENUM (EMAIL, SMS, WHATSAPP, PUSH, SYSTEM).';

-- B-Tree Indexes
CREATE INDEX idx_notification_templates_code ON notification_templates(template_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_notification_templates_type ON notification_templates(notification_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_notification_templates_lang ON notification_templates(language) WHERE deleted_at IS NULL;
CREATE INDEX idx_notification_templates_active ON notification_templates(is_active) WHERE deleted_at IS NULL;

-- =========================================================================
-- Table 2: Notifications Queue & Log
-- =========================================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationships
    template_id UUID REFERENCES notification_templates(id) ON UPDATE CASCADE ON DELETE SET NULL,
    recipient_user_id UUID, -- References auth.users or profiles. Nullable for leads.
    
    -- Recipient Details
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(50),
    
    -- Classification
    notification_type notification_type NOT NULL,
    notification_status notification_status NOT NULL DEFAULT 'PENDING'::notification_status,
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    
    -- Content
    subject VARCHAR(255),
    title VARCHAR(255),
    message TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    
    -- Timing & State
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    
    -- Error Handling
    failure_reason TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    
    -- Context
    reference_entity_type VARCHAR(100),
    reference_entity_id UUID,
    
    -- UI Flags
    is_read BOOLEAN NOT NULL DEFAULT false,
    is_system_generated BOOLEAN NOT NULL DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Constraints
    CONSTRAINT chk_notifications_priority CHECK (
        priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')
    ),
    CONSTRAINT chk_notifications_retry CHECK (retry_count >= 0)
);

-- Documentation Comments
COMMENT ON TABLE notifications IS 'Unified queue and log for all outgoing communications (In-App, Email, SMS, Push, WhatsApp).';
COMMENT ON COLUMN notifications.payload IS 'JSONB payload for deep-linking in mobile apps (e.g., {"lead_id": "uuid", "screen": "LeadDetails"}).';
COMMENT ON COLUMN notifications.recipient_user_id IS 'UUID of the recipient. Can be NULL if the notification is going to a Lead (who does not have an internal auth account).';
COMMENT ON COLUMN notifications.notification_status IS 'Uses Phase 3.2 notification_status ENUM (PENDING, SENT, FAILED, READ).';

-- B-Tree Indexes
CREATE INDEX idx_notifications_recipient_user ON notifications(recipient_user_id);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_status ON notifications(notification_status);
CREATE INDEX idx_notifications_priority ON notifications(priority);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_at);
CREATE INDEX idx_notifications_sent ON notifications(sent_at);
CREATE INDEX idx_notifications_ref_entity ON notifications(reference_entity_type, reference_entity_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read) WHERE is_read = false;
