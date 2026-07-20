export interface LeadAssignmentEntity {
  id: string;
  lead_id: string;
  assigned_to: string;
  assigned_by: string | null;
  
  assignment_strategy: 'MANUAL' | 'ROUND_ROBIN' | 'TERRITORY' | 'PROJECT' | 'PRIORITY' | 'MANAGER_OVERRIDE';
  assignment_reason: string | null;
  assignment_notes: string | null;
  
  is_active: boolean;
  expires_at: string | null;
  
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
