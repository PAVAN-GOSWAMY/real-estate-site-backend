import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { PropertyShortlistEntity, ShortlistItemPriority } from "@/types/favorites.types";
import { ShortlistQueryDto } from "../dto/favorites.dto";
import { Modules } from "@/lib/constants/modules";

export class ShortlistRepository extends BaseRepository<PropertyShortlistEntity, any, any> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.PROPERTY_SHORTLISTS);
  }

  async getShortlists(query: ShortlistQueryDto): Promise<{ data: any[]; count: number }> {
    const { page, limit, user_id, lead_id, is_archived } = query;
    const offset = (page! - 1) * limit!;

    let q = this.supabase
      .from(this.tableName)
      .select('*, property_shortlist_items(count)', { count: 'exact' })
      .range(offset, offset + limit! - 1)
      .order('updated_at', { ascending: false });

    if (user_id) q = q.eq('user_id', user_id);
    if (lead_id) q = q.eq('lead_id', lead_id);
    if (is_archived !== undefined) q = q.eq('is_archived', is_archived);

    const { data, count, error } = await q;

    if (error) {
      this.handleError(error, 'getShortlists');
    }

    return { data: data || [], count: count || 0 };
  }

  async getShortlistWithProperties(id: string): Promise<any> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        property_shortlist_items (
          notes,
          priority,
          added_at,
          properties (
            *,
            projects (id, project_name, rera_registration_number),
            builders (id, name),
            locations (id, city, neighborhood),
            property_inventory_states (status)
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'getShortlistWithProperties');
    }

    return data;
  }

  async getShortlistByShareToken(token: string): Promise<any> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        property_shortlist_items (
          notes,
          priority,
          added_at,
          properties (
            *,
            projects (id, project_name),
            builders (id, name),
            locations (id, city, neighborhood)
          )
        )
      `)
      .eq('share_token', token)
      .eq('is_archived', false)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'getShortlistByShareToken');
    }

    return data;
  }

  async updateShareToken(id: string, expiresAt: string | null): Promise<any> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update({ expires_at: expiresAt, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'updateShareToken');
    }
    return data;
  }

  // --- Shortlist Items ---

  async addProperty(shortlistId: string, propertyId: string, priority: ShortlistItemPriority, notes: string | null = null): Promise<void> {
    const { error } = await this.supabase
      .from(Modules.PROPERTY_SHORTLIST_ITEMS)
      .insert({
        shortlist_id: shortlistId,
        property_id: propertyId,
        priority,
        notes
      });

    if (error) {
      this.handleError(error, 'addProperty');
    }
    
    // Bump updated_at on parent
    await this.supabase.from(this.tableName).update({ updated_at: new Date().toISOString() }).eq('id', shortlistId);
  }

  async updateProperty(shortlistId: string, propertyId: string, payload: { priority?: ShortlistItemPriority; notes?: string | null }): Promise<void> {
    const { error } = await this.supabase
      .from(Modules.PROPERTY_SHORTLIST_ITEMS)
      .update(payload)
      .eq('shortlist_id', shortlistId)
      .eq('property_id', propertyId);

    if (error) {
      this.handleError(error, 'updateProperty');
    }
    
    await this.supabase.from(this.tableName).update({ updated_at: new Date().toISOString() }).eq('id', shortlistId);
  }

  async removeProperty(shortlistId: string, propertyId: string): Promise<void> {
    const { error } = await this.supabase
      .from(Modules.PROPERTY_SHORTLIST_ITEMS)
      .delete()
      .eq('shortlist_id', shortlistId)
      .eq('property_id', propertyId);

    if (error) {
      this.handleError(error, 'removeProperty');
    }
    
    await this.supabase.from(this.tableName).update({ updated_at: new Date().toISOString() }).eq('id', shortlistId);
  }
}
