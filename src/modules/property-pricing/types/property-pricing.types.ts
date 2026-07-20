export type PricingRevisionStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export interface PropertyPricingRevisionEntity {
  id: string;
  property_id: string;
  status: PricingRevisionStatus;
  effective_date: string | null;
  base_price: number;
  offer_price: number | null;
  discount_percentage: number;
  discount_amount: number;
  booking_amount: number;
  plc_charges: number;
  floor_rise_charges: number;
  maintenance_charges: number;
  parking_charges: number;
  club_membership_charges: number;
  gst: number;
  registration_charges: number;
  other_charges: number;
  final_payable_amount: number;
  notes: string | null;
  created_by: string | null;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
