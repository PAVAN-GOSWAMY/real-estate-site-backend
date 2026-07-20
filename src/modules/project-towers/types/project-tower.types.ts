export interface ProjectTowerEntity {
  id: string;
  project_id: string;
  tower_name: string;
  tower_code: string;
  slug: string;
  short_description: string | null;
  construction_status: string; // Uses property_status ENUM (e.g. UNDER_CONSTRUCTION)
  launch_date: string | null;
  expected_completion_date: string | null;
  actual_completion_date: string | null;
  total_floors: number | null;
  total_units: number | null;
  tower_height: number | null;
  number_of_lifts: number | null;
  service_lifts: number | null;
  parking_levels: number | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  canonical_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string | null;
  updated_by: string | null;
}
