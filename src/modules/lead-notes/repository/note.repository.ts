import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { LeadNoteEntity } from "@/types/note.types";
import { Modules } from "@/lib/constants/modules";
import { LeadNoteSearchDto } from "../dto/note.dto";

export class NoteRepository extends BaseRepository<LeadNoteEntity, any, any> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.LEAD_NOTES);
  }

  async searchNotes(query: LeadNoteSearchDto, userId: string): Promise<{ data: any[]; count: number }> {
    const { page, limit, query: textQuery, lead_id, author_id, note_type, visibility, is_pinned, is_archived, tags } = query;
    const offset = (page! - 1) * limit!;

    let q = this.supabase
      .from(this.tableName)
      .select('*, author:author_id(id)', { count: 'exact' })
      .is('deleted_at', null)
      .range(offset, offset + limit! - 1)
      // Sort by pinned first, then newest
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    // Enforce visibility logic: Can see if it's SHARED or if they are the author
    q = q.or(`visibility.eq.SHARED,author_id.eq.${userId}`);

    if (lead_id) q = q.eq('lead_id', lead_id);
    if (author_id) q = q.eq('author_id', author_id);
    if (note_type) q = q.eq('note_type', note_type);
    if (visibility) q = q.eq('visibility', visibility);
    if (is_pinned !== undefined) q = q.eq('is_pinned', is_pinned);
    
    // Default to hiding archived notes unless explicitly requested
    if (is_archived !== undefined) {
      q = q.eq('is_archived', is_archived);
    } else {
      q = q.eq('is_archived', false);
    }

    if (tags && tags.length > 0) {
      q = q.contains('tags', tags);
    }

    if (textQuery) {
      // Very basic text search (production should use Postgres full-text search)
      q = q.ilike('content', `%${textQuery}%`);
    }

    const { data, count, error } = await q;
    if (error) this.handleError(error, 'searchNotes');

    return { data: data || [], count: count || 0 };
  }

  async updateState(id: string, updates: Partial<LeadNoteEntity>): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .is('deleted_at', null);

    if (error) this.handleError(error, 'updateState');
  }
}
