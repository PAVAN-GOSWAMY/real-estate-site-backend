export interface ProjectMediaEntity {
  id: string;
  project_id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'BROCHURE' | 'FLOOR_PLAN' | 'PDF' | 'LOGO';
  title: string | null;
  description: string | null;
  storage_bucket: string;
  storage_path: string;
  public_url: string;
  thumbnail_url: string | null;
  alt_text: string | null;
  caption: string | null;
  mime_type: string | null;
  file_size: number | null;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  display_order: number;
  is_cover: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string | null;
  updated_by: string | null;
}
