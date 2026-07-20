import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { SiteVisitEntity } from "@/types/visit.types";
import { Modules } from "@/lib/constants/modules";
import { SiteVisitSearchDto } from "../dto/visit.dto";

export class VisitRepository extends BaseRepository<SiteVisitEntity, any, any> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.SITE_VISITS);
  }

  async searchVisits(query: SiteVisitSearchDto): Promise<{ data: any[]; count: number }> {
    const { page, limit, lead_id, project_id, visit_status, assigned_sales_executive, date_from, date_to } = query;
    const offset = (page! - 1) * limit!;

    let q = this.supabase
      .from(this.tableName)
      .select('*, lead:lead_id(full_name, phone_number), project:project_id(name), assigned:assigned_sales_executive(id)', { count: 'exact' })
      .is('deleted_at', null)
      .range(offset, offset + limit! - 1)
      .order('scheduled_date', { ascending: true })
      .order('scheduled_start_time', { ascending: true });

    if (lead_id) q = q.eq('lead_id', lead_id);
    if (project_id) q = q.eq('project_id', project_id);
    if (visit_status) q = q.eq('visit_status', visit_status);
    if (assigned_sales_executive) q = q.eq('assigned_sales_executive', assigned_sales_executive);
    if (date_from) q = q.gte('scheduled_date', date_from);
    if (date_to) q = q.lte('scheduled_date', date_to);

    const { data, count, error } = await q;
    if (error) this.handleError(error, 'searchVisits');

    return { data: data || [], count: count || 0 };
  }

  async updateState(id: string, updates: Partial<SiteVisitEntity>): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .is('deleted_at', null);

    if (error) this.handleError(error, 'updateState');
  }

  async findToday(): Promise<any[]> {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*, lead:lead_id(full_name)')
      .is('deleted_at', null)
      .eq('scheduled_date', today)
      .in('visit_status', ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'])
      .order('scheduled_start_time', { ascending: true });
      
    if (error) this.handleError(error, 'findToday');
    return data || [];
  }

  async findUpcoming(): Promise<any[]> {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*, lead:lead_id(full_name)')
      .is('deleted_at', null)
      .gt('scheduled_date', today)
      .in('visit_status', ['SCHEDULED', 'CONFIRMED'])
      .order('scheduled_date', { ascending: true })
      .order('scheduled_start_time', { ascending: true })
      .limit(20);
      
    if (error) this.handleError(error, 'findUpcoming');
    return data || [];
  }
}
