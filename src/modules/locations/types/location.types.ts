export interface LocationEntity {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  detailed_description: string | null;
  parent_location_id: string | null;
  display_order: number;
  is_featured: boolean;
  is_active: boolean;
  latitude: number | null;
  longitude: number | null;
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
