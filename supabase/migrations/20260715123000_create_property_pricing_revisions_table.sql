-- Phase 7.4.2: Property Pricing Revisions Table
-- Ledger for managing pricing workflows and deep financial breakdowns.

CREATE TYPE pricing_revision_status AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED');

CREATE TABLE property_pricing_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE,
    
    status pricing_revision_status NOT NULL DEFAULT 'DRAFT'::pricing_revision_status,
    effective_date TIMESTAMPTZ,
    
    -- Financial Components
    base_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
    offer_price NUMERIC(15, 2),
    
    discount_percentage NUMERIC(5, 2) DEFAULT 0,
    discount_amount NUMERIC(15, 2) DEFAULT 0,
    
    booking_amount NUMERIC(15, 2) DEFAULT 0,
    plc_charges NUMERIC(15, 2) DEFAULT 0,
    floor_rise_charges NUMERIC(15, 2) DEFAULT 0,
    maintenance_charges NUMERIC(15, 2) DEFAULT 0,
    parking_charges NUMERIC(15, 2) DEFAULT 0,
    club_membership_charges NUMERIC(15, 2) DEFAULT 0,
    gst NUMERIC(15, 2) DEFAULT 0,
    registration_charges NUMERIC(15, 2) DEFAULT 0,
    other_charges NUMERIC(15, 2) DEFAULT 0,
    
    final_payable_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    
    -- Workflow Metadata
    notes TEXT,
    created_by UUID, -- Future auth
    approved_by UUID, -- Future auth
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT chk_pricing_positive CHECK (
        base_price >= 0 AND 
        (offer_price IS NULL OR offer_price >= 0) AND 
        discount_percentage >= 0 AND 
        discount_amount >= 0 AND 
        booking_amount >= 0 AND 
        plc_charges >= 0 AND 
        floor_rise_charges >= 0 AND 
        maintenance_charges >= 0 AND 
        parking_charges >= 0 AND 
        club_membership_charges >= 0 AND 
        gst >= 0 AND 
        registration_charges >= 0 AND 
        other_charges >= 0 AND 
        final_payable_amount >= 0
    )
);

COMMENT ON TABLE property_pricing_revisions IS 'Ledger for tracking property pricing history, breakdowns, and approval workflows.';

-- Indexes
CREATE INDEX idx_property_pricing_property_id ON property_pricing_revisions(property_id);
CREATE INDEX idx_property_pricing_status ON property_pricing_revisions(status);
CREATE INDEX idx_property_pricing_effective_date ON property_pricing_revisions(effective_date);
