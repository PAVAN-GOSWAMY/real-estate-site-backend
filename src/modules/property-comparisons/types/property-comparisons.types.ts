export interface PropertyComparisonSessionEntity {
  id: string;
  user_id: string | null;
  title: string | null;
  share_token: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyComparisonItemEntity {
  session_id: string;
  property_id: string;
  display_order: number;
  added_at: string;
}
