export interface LeadNoteEntity {
  id: string;
  lead_id: string;
  author_id: string | null;
  note_type: string;
  content: string;
  visibility: 'PRIVATE' | 'SHARED';
  is_pinned: boolean;
  is_archived: boolean;
  tags: string[] | null;
  mentions: string[] | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
