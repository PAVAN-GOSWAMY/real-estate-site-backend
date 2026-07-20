export interface LeadStatusHistoryEntity {
  id: string;
  lead_id: string;
  previous_status: string | null;
  new_status: string;
  changed_by: string | null;
  reason: string | null;
  duration_minutes: number | null;
  created_at: string;
  deleted_at: string | null;
}
