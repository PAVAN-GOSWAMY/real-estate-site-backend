export type LeadStatus = 'NEW' | 'QUALIFIED' | 'CONTACTED' | 'INTERESTED' | 'SITE_VISIT_SCHEDULED' | 'SITE_VISIT_COMPLETED' | 'NEGOTIATION' | 'BOOKED' | 'WON' | 'LOST' | 'CLOSED';
export type LeadSource = 'WEBSITE' | 'LANDING_PAGE' | 'PROPERTY_FORM' | 'CONTACT_FORM' | 'WHATSAPP' | 'PHONE_CALL' | 'WALK_IN' | 'FACEBOOK_ADS' | 'GOOGLE_ADS' | 'INSTAGRAM' | 'MANUAL_ENTRY' | 'REFERRAL' | 'PARTNER' | 'API' | 'OTHER';
export type CrmPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface LeadEntity {
  id: string;
  full_name: string;
  email: string | null;
  phone_number: string;
  alternate_phone: string | null;
  
  project_id: string | null;
  property_id: string | null;
  
  lead_status: LeadStatus;
  lead_source: LeadSource;
  crm_priority: CrmPriority;
  
  budget_min: number | null;
  budget_max: number | null;
  
  preferred_contact_method: string | null;
  preferred_contact_time: string | null;
  
  city: string | null;
  state: string | null;
  country: string | null;
  
  remarks: string | null;
  assigned_to: string | null;
  
  last_contacted_at: string | null;
  next_follow_up_at: string | null;
  converted_at: string | null;
  lost_reason: string | null;
  
  is_active: boolean;
  
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string | null;
  updated_by: string | null;
}
