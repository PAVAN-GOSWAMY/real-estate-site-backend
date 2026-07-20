export interface PropertyFeatureAssignmentEntity {
  id: string;
  property_id: string;
  feature_id: string;
  display_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string | null;
  updated_by: string | null;
}
