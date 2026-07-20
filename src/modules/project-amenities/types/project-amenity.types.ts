export interface ProjectAmenityEntity {
  id: string;
  project_id: string;
  amenity_id: string;
  display_order: number;
  is_highlighted: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string | null;
  updated_by: string | null;
}
