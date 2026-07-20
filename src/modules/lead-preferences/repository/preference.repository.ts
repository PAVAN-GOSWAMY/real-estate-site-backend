import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { LeadPreferenceEntity } from "@/types/preference.types";
import { Modules } from "@/lib/constants/modules";
import { LeadPreferenceFilterDto } from "../dto/preference.dto";

export class PreferenceRepository extends BaseRepository<LeadPreferenceEntity, any, any> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.LEAD_PREFERENCES);
  }

  async findByLead(leadId: string, query: LeadPreferenceFilterDto): Promise<{ data: any[]; count: number }> {
    const { page, limit, is_current } = query;
    const offset = (page! - 1) * limit!;

    let q = this.supabase
      .from(this.tableName)
      .select(`
        *,
        location:locations(id, name),
        category:property_categories(id, name),
        configuration:property_configurations(id, name),
        builder:builders(id, name),
        project:projects(id, project_name),
        tower:project_towers(id, name)
      `, { count: 'exact' })
      .eq('lead_id', leadId)
      .is('deleted_at', null)
      .range(offset, offset + limit! - 1)
      .order('is_current', { ascending: false })
      .order('created_at', { ascending: false });

    if (is_current !== undefined) {
      q = q.eq('is_current', is_current);
    }

    const { data, count, error } = await q;
    if (error) this.handleError(error, 'findByLead');

    return { data: data || [], count: count || 0 };
  }

  async setPrimary(leadId: string, preferenceId: string): Promise<void> {
    // Transactional approach using rpc or two-step update since we can't reliably multi-update differently.
    // 1. Set all to false
    const { error: error1 } = await this.supabase
      .from(this.tableName)
      .update({ is_current: false })
      .eq('lead_id', leadId)
      .is('deleted_at', null);

    if (error1) this.handleError(error1, 'setPrimary-1');

    // 2. Set target to true
    const { error: error2 } = await this.supabase
      .from(this.tableName)
      .update({ is_current: true })
      .eq('id', preferenceId)
      .eq('lead_id', leadId);

    if (error2) this.handleError(error2, 'setPrimary-2');
  }

  async findDuplicates(leadId: string, dto: Record<string, any>): Promise<boolean> {
    // To strictly find exact dupes, we compare the significant fields
    let q = this.supabase
      .from(this.tableName)
      .select('id', { count: 'exact' })
      .eq('lead_id', leadId)
      .is('deleted_at', null);

    const checkFields = ['location_id', 'category_id', 'configuration_id', 'preferred_builder', 'preferred_project', 'budget_min', 'budget_max', 'minimum_area', 'maximum_area'];
    
    for (const field of checkFields) {
      if (dto[field] !== undefined) {
        if (dto[field] === null) q = q.is(field, null);
        else q = q.eq(field, dto[field]);
      }
    }

    const { count, error } = await q;
    if (error) this.handleError(error, 'findDuplicates');

    return (count || 0) > 0;
  }
}
