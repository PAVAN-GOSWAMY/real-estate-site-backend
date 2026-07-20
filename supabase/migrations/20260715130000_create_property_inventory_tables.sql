-- Phase 7.4.3: Property Inventory Tables
-- Ledger for managing state machine transitions and optimistic locking

CREATE TYPE inventory_status AS ENUM ('AVAILABLE', 'RESERVED', 'BLOCKED', 'BOOKED', 'AGREEMENT_PENDING', 'SOLD', 'MAINTENANCE_HOLD', 'LEGAL_HOLD');
CREATE TYPE inventory_transaction_type AS ENUM ('RESERVE', 'BLOCK', 'BOOK', 'AGREEMENT', 'SELL', 'CANCEL', 'RELEASE', 'HOLD');

-- 1. Active State Tracker with Optimistic Concurrency
CREATE TABLE property_inventory_states (
    property_id UUID PRIMARY KEY REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE,
    
    status inventory_status NOT NULL DEFAULT 'AVAILABLE'::inventory_status,
    lead_id UUID, -- References leads(id) in CRM phase
    
    reserved_until TIMESTAMPTZ,
    notes TEXT,
    
    version INTEGER NOT NULL DEFAULT 1, -- Optimistic concurrency lock
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE property_inventory_states IS '1-to-1 active inventory state tracker utilizing optimistic locking (version) to prevent race conditions during booking.';

-- 2. Audit Ledger
CREATE TABLE property_inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE,
    
    transaction_type inventory_transaction_type NOT NULL,
    previous_status inventory_status,
    new_status inventory_status NOT NULL,
    
    lead_id UUID,
    
    notes TEXT,
    created_by UUID, -- Future auth
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE property_inventory_transactions IS 'Immutable ledger tracking every detailed inventory state transition for forensic analytics.';

-- Indexes
CREATE INDEX idx_property_inventory_states_status ON property_inventory_states(status);
CREATE INDEX idx_property_inventory_states_lead ON property_inventory_states(lead_id);
CREATE INDEX idx_property_inventory_tx_property ON property_inventory_transactions(property_id);
CREATE INDEX idx_property_inventory_tx_type ON property_inventory_transactions(transaction_type);
CREATE INDEX idx_property_inventory_tx_created ON property_inventory_transactions(created_at);
