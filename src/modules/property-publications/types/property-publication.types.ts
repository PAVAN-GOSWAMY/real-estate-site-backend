export type PublicationStatus = 
  | 'DRAFT' 
  | 'PENDING_REVIEW' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'PUBLISHED' 
  | 'ARCHIVED' 
  | 'UNPUBLISHED' 
  | 'SCHEDULED' 
  | 'EXPIRED';

export interface PropertyPublicationEntity {
  id: string;
  property_id: string;
  status: PublicationStatus;
  notes: string | null;
  scheduled_at: string | null;
  expires_at: string | null;
  created_at: string;
  created_by: string | null;
  deleted_at: string | null;
}
