export interface LeadFollowUpEntity {
  id: string;
  
  lead_id: string;
  project_id: string | null;
  property_id: string | null;
  
  follow_up_type: string;
  subject: string;
  summary: string | null;
  detailed_notes: string | null;
  
  communication_channel: string | null;
  communication_direction: string | null;
  outcome: string | null;
  
  lead_status_before: string | null;
  lead_status_after: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  
  scheduled_at: string | null;
  completed_at: string | null;
  next_follow_up_at: string | null;
  duration_minutes: number | null;
  
  assigned_to: string | null;
  attachments_count: number;
  customer_response: string | null;
  internal_notes: string | null;
  
  is_completed: boolean;
  is_system_generated: boolean;
  
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string | null;
  updated_by: string | null;
}
