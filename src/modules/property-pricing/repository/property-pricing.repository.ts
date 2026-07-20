import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { PropertyPricingRevisionEntity, PricingRevisionStatus } from "@/types/property-pricing.types";
import { PricingHistoryQueryDto, PendingRevisionsQueryDto } from "../dto/property-pricing.dto";
import { Modules } from "@/lib/constants/modules";

export class PropertyPricingRepository extends BaseRepository<PropertyPricingRevisionEntity, any, any> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.PROPERTY_PRICING);
  }

  async getHistory(propertyId: string, query: PricingHistoryQueryDto): Promise<{ data: any[]; count: number }> {
    const { page, limit, status } = query;
    const offset = (page! - 1) * limit!;

    let q = this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact' })
      .eq('property_id', propertyId)
      .is('deleted_at', null)
      .range(offset, offset + limit! - 1)
      .order('created_at', { ascending: false });

    if (status) {
      q = q.eq('status', status);
    }

    const { data, count, error } = await q;

    if (error) {
      this.handleError(error, 'getHistory');
    }

    return { data: data || [], count: count || 0 };
  }

  async getPendingRevisions(query: PendingRevisionsQueryDto): Promise<{ data: any[]; count: number }> {
    const { page, limit } = query;
    const offset = (page! - 1) * limit!;

    const { data, count, error } = await this.supabase
      .from(this.tableName)
      .select('*, properties(id, unit_code)', { count: 'exact' })
      .eq('status', 'PENDING_APPROVAL')
      .is('deleted_at', null)
      .range(offset, offset + limit! - 1)
      .order('created_at', { ascending: false });

    if (error) {
      this.handleError(error, 'getPendingRevisions');
    }

    return { data: data || [], count: count || 0 };
  }

  async getLatestApproved(propertyId: string): Promise<PropertyPricingRevisionEntity | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('property_id', propertyId)
      .eq('status', 'APPROVED')
      .is('deleted_at', null)
      .order('effective_date', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'getLatestApproved');
    }

    return data || null;
  }
}
