import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { LeadFollowUpEntity } from "@/types/followup.types";
import { Modules } from "@/lib/constants/modules";
import { LeadFollowUpFilterDto } from "../dto/followup.dto";

export class FollowUpRepository extends BaseRepository<LeadFollowUpEntity, any, any> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.FOLLOW_UPS);
  }

  async getFollowUps(query: LeadFollowUpFilterDto): Promise<{ data: any[]; count: number }> {
    const { page, limit, lead_id, assigned_to, is_completed, follow_up_type, date_from, date_to } = query;
    const offset = (page! - 1) * limit!;

    let q = this.supabase
      .from(this.tableName)
      .select(`
        *,
        lead:leads(id, full_name, phone_number, email),
        project:projects(id, project_name),
        property:properties(id, unit_code)
      `, { count: 'exact' })
      .is('deleted_at', null)
      .range(offset, offset + limit! - 1)
      .order('scheduled_at', { ascending: true });

    if (lead_id) q = q.eq('lead_id', lead_id);
    if (assigned_to) q = q.eq('assigned_to', assigned_to);
    if (is_completed !== undefined) q = q.eq('is_completed', is_completed);
    if (follow_up_type) q = q.eq('follow_up_type', follow_up_type);
    if (date_from) q = q.gte('scheduled_at', date_from);
    if (date_to) q = q.lte('scheduled_at', date_to);

    const { data, count, error } = await q;
    if (error) this.handleError(error, 'getFollowUps');

    return { data: data || [], count: count || 0 };
  }

  async getByTemporalState(state: 'overdue' | 'today' | 'upcoming', assignedTo?: string): Promise<LeadFollowUpEntity[]> {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();
    const currentIso = now.toISOString();

    let q = this.supabase
      .from(this.tableName)
      .select('*')
      .is('deleted_at', null)
      .eq('is_completed', false);

    if (assignedTo) q = q.eq('assigned_to', assignedTo);

    switch (state) {
      case 'overdue':
        q = q.lt('scheduled_at', currentIso).order('scheduled_at', { ascending: true });
        break;
      case 'today':
        q = q.gte('scheduled_at', todayStart).lte('scheduled_at', todayEnd).order('scheduled_at', { ascending: true });
        break;
      case 'upcoming':
        q = q.gt('scheduled_at', todayEnd).order('scheduled_at', { ascending: true });
        break;
    }

    const { data, error } = await q;
    if (error) this.handleError(error, `getByTemporalState_${state}`);

    return data || [];
  }

  async getStatistics(): Promise<any> {
    const now = new Date().toISOString();
    const todayStart = new Date(new Date().setHours(0,0,0,0)).toISOString();
    const todayEnd = new Date(new Date().setHours(23,59,59,999)).toISOString();

    const [overdue, today, upcoming, completed] = await Promise.all([
      this.supabase.from(this.tableName).select('id', { count: 'exact' }).is('deleted_at', null).eq('is_completed', false).lt('scheduled_at', now),
      this.supabase.from(this.tableName).select('id', { count: 'exact' }).is('deleted_at', null).eq('is_completed', false).gte('scheduled_at', todayStart).lte('scheduled_at', todayEnd),
      this.supabase.from(this.tableName).select('id', { count: 'exact' }).is('deleted_at', null).eq('is_completed', false).gt('scheduled_at', todayEnd),
      this.supabase.from(this.tableName).select('id', { count: 'exact' }).is('deleted_at', null).eq('is_completed', true)
    ]);

    const totalOverdue = overdue.count || 0;
    const totalToday = today.count || 0;
    const totalUpcoming = upcoming.count || 0;
    const totalCompleted = completed.count || 0;
    const totalActive = totalOverdue + totalToday + totalUpcoming;
    const completionRate = totalActive + totalCompleted > 0 ? (totalCompleted / (totalActive + totalCompleted)) * 100 : 0;

    return {
      total_overdue: totalOverdue,
      total_today: totalToday,
      total_upcoming: totalUpcoming,
      completion_rate: parseFloat(completionRate.toFixed(2))
    };
  }
}
