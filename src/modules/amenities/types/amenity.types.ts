export interface AmenityEntity {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  detailed_description: string | null;
  amenity_group: string | null;
  icon_name: string | null;
  theme_color: string | null;
  display_order: number;
  is_premium: boolean;
  is_featured: boolean;
  is_active: boolean;
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
