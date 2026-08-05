-- =============================================================================
-- Migration: Create Leads CRM Tables
-- Description: Sets up the core CRM entities including leads, activities, 
--              notes, follow-ups, and attachments.
-- =============================================================================

-- 1. Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    source TEXT NOT NULL, -- Property Inquiry, General Contact, Site Visit Request, etc.
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    builder_id UUID REFERENCES builders(id) ON DELETE SET NULL,
    message TEXT,
    assigned_to_email TEXT, -- Storing email for MVP since auth is simulated
    priority TEXT NOT NULL DEFAULT 'Medium', -- Low, Medium, High
    status TEXT NOT NULL DEFAULT 'New', -- New, Contacted, Qualified, Site Visit Scheduled, Negotiation, Booked, Won, Lost, Archived
    next_follow_up TIMESTAMPTZ,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for searching and filtering
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON leads(priority);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_property_id ON leads(property_id);

-- 2. Create lead_activities table (Audit Trail)
CREATE TABLE IF NOT EXISTS lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- Status Changed, Note Added, Follow-up Scheduled, etc.
    description TEXT NOT NULL,
    created_by_email TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_created_at ON lead_activities(created_at DESC);

-- 3. Create lead_notes table
CREATE TABLE IF NOT EXISTS lead_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_by_email TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON lead_notes(lead_id);

-- 4. Create lead_follow_ups table
CREATE TABLE IF NOT EXISTS lead_follow_ups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    follow_up_date TIMESTAMPTZ NOT NULL,
    reminder_type TEXT NOT NULL, -- Call, Email, Meeting, Site Visit
    comment TEXT,
    status TEXT NOT NULL DEFAULT 'Pending', -- Pending, Completed, Cancelled
    created_by_email TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_follow_ups_lead_id ON lead_follow_ups(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_follow_ups_date ON lead_follow_ups(follow_up_date);

-- 5. Create lead_attachments table
CREATE TABLE IF NOT EXISTS lead_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_by_email TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_attachments_lead_id ON lead_attachments(lead_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_lead_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_modtime
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_lead_timestamp();

CREATE TRIGGER update_lead_notes_modtime
    BEFORE UPDATE ON lead_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_lead_timestamp();

CREATE TRIGGER update_lead_follow_ups_modtime
    BEFORE UPDATE ON lead_follow_ups
    FOR EACH ROW
    EXECUTE FUNCTION update_lead_timestamp();

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_attachments ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated operations since we use server-side admin logic
CREATE POLICY "Allow authenticated full access on leads" ON leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert on leads" ON leads FOR INSERT TO anon WITH CHECK (true); -- Public forms can create leads
CREATE POLICY "Allow authenticated full access on lead_activities" ON lead_activities FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access on lead_notes" ON lead_notes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access on lead_follow_ups" ON lead_follow_ups FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access on lead_attachments" ON lead_attachments FOR ALL TO authenticated USING (true) WITH CHECK (true);
