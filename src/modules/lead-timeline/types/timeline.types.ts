export interface LeadTimelineEntity {
  id: string;
  lead_id: string;
  category: string;
  event_type: string;
  title: string;
  description: string | null;
  actor_id: string | null;
  actor_role: string | null;
  source_module: string;
  reference_entity: string | null;
  reference_id: string | null;
  metadata: Record<string, any> | null;
  occurred_at: string;
  created_at: string;
}
