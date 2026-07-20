import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { 
  PropertyComparisonSessionEntity, 
  PropertyComparisonItemEntity
} from "@/types/property-comparisons.types";
import { Modules } from "@/lib/constants/modules";
import { ComparisonHistoryQueryDto } from "../dto/property-comparisons.dto";

export class PropertyComparisonRepository extends BaseRepository<PropertyComparisonSessionEntity, any, any> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.PROPERTY_COMPARISONS);
  }

  async createSession(userId?: string | null, title?: string | null): Promise<PropertyComparisonSessionEntity> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert({
        user_id: userId || null,
        title: title || null
      })
      .select()
      .single();

    if (error) {
      this.handleError(error, 'createSession');
    }

    return data;
  }

  async getSessionWithProperties(sessionId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        property_comparison_items (
          display_order,
          properties (
            *,
            projects (id, project_name, rera_registration_number),
            builders (id, name),
            locations (id, city, neighborhood),
            property_inventory_states (status)
          )
        )
      `)
      .eq('id', sessionId)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'getSessionWithProperties');
    }

    return data; // Returns null if not found (PGRST116)
  }

  async getSessionByShareToken(token: string): Promise<any> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        property_comparison_items (
          display_order,
          properties (
            *,
            projects (id, project_name, rera_registration_number),
            builders (id, name),
            locations (id, city, neighborhood),
            property_inventory_states (status)
          )
        )
      `)
      .eq('share_token', token)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'getSessionByShareToken');
    }

    return data;
  }

  async addPropertyToSession(sessionId: string, propertyId: string, order: number): Promise<void> {
    const { error } = await this.supabase
      .from('property_comparison_items')
      .insert({
        session_id: sessionId,
        property_id: propertyId,
        display_order: order
      });

    if (error) {
      this.handleError(error, 'addPropertyToSession');
    }
  }

  async removePropertyFromSession(sessionId: string, propertyId: string): Promise<void> {
    const { error } = await this.supabase
      .from('property_comparison_items')
      .delete()
      .eq('session_id', sessionId)
      .eq('property_id', propertyId);

    if (error) {
      this.handleError(error, 'removePropertyFromSession');
    }
  }

  async getPropertyCountForSession(sessionId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('property_comparison_items')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', sessionId);

    if (error) {
      this.handleError(error, 'getPropertyCountForSession');
    }

    return count || 0;
  }

  async updateSessionTitle(sessionId: string, title: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    if (error) {
      this.handleError(error, 'updateSessionTitle');
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    if (error) {
      this.handleError(error, 'deleteSession');
    }
  }

  async getHistory(query: ComparisonHistoryQueryDto): Promise<{ data: any[]; count: number }> {
    const { page, limit, user_id } = query;
    const offset = (page! - 1) * limit!;

    let q = this.supabase
      .from(this.tableName)
      .select('*, property_comparison_items(count)', { count: 'exact' })
      .eq('is_active', true)
      .range(offset, offset + limit! - 1)
      .order('updated_at', { ascending: false });

    if (user_id) q = q.eq('user_id', user_id);

    const { data, count, error } = await q;

    if (error) {
      this.handleError(error, 'getHistory');
    }

    return { data: data || [], count: count || 0 };
  }
}
