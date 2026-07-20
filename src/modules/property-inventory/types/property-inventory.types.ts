export type InventoryStatus = 'AVAILABLE' | 'RESERVED' | 'BLOCKED' | 'BOOKED' | 'AGREEMENT_PENDING' | 'SOLD' | 'MAINTENANCE_HOLD' | 'LEGAL_HOLD';
export type InventoryTransactionType = 'RESERVE' | 'BLOCK' | 'BOOK' | 'AGREEMENT' | 'SELL' | 'CANCEL' | 'RELEASE' | 'HOLD';

export interface PropertyInventoryStateEntity {
  property_id: string;
  status: InventoryStatus;
  lead_id: string | null;
  reserved_until: string | null;
  notes: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyInventoryTransactionEntity {
  id: string;
  property_id: string;
  transaction_type: InventoryTransactionType;
  previous_status: InventoryStatus | null;
  new_status: InventoryStatus;
  lead_id: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  deleted_at: string | null;
}
