export interface PropertyBrochureEntity {
  id: string;
  property_id: string;
  brochure_name: string;
  brochure_code: string;
  brochure_type: string;
  version: string | null;
  language: string;
  storage_bucket: string;
  storage_path: string;
  public_url: string;
  thumbnail_url: string | null;
  mime_type: string | null;
  file_size: number | null;
  page_count: number | null;
  download_count: number;
  display_order: number;
  is_latest_version: boolean;
  is_downloadable: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string | null;
  updated_by: string | null;
}
