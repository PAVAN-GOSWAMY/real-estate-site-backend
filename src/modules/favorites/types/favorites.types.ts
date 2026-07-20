export interface UserFavoriteEntity {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

export interface PropertyShortlistEntity {
  id: string;
  user_id: string;
  lead_id: string | null;
  name: string;
  description: string | null;
  share_token: string;
  expires_at: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export type ShortlistItemPriority = 'HIGH' | 'NORMAL' | 'LOW';

export interface PropertyShortlistItemEntity {
  shortlist_id: string;
  property_id: string;
  notes: string | null;
  priority: ShortlistItemPriority;
  added_at: string;
}
