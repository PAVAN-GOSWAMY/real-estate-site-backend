import { SupabaseClient } from "@supabase/supabase-js";
import { DashboardFilterDto } from "../dto/dashboard.dto";
import { LeadKPIEntity, PipelineKPIEntity, FollowUpSummaryEntity, SiteVisitSummaryEntity, RevenueSummaryEntity } from "@/types/dashboard.types";

export class DashboardRepository {
  constructor(private supabase: SupabaseClient) {}

  private applyFilters(query: any, filters: DashboardFilterDto, role: string, userId: string) {
    if (role === 'sales') {
      query = query.eq('assigned_to', userId);
    } else if (filters.sales_executive_id) {
      query = query.eq('assigned_to', filters.sales_executive_id);
    }

    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    return query;
  }

  async getLeadKPIs(filters: DashboardFilterDto, role: string, userId: string): Promise<LeadKPIEntity> {
    let q = this.supabase.from('leads').select('lead_status', { count: 'exact' }).is('deleted_at', null);
    q = this.applyFilters(q, filters, role, userId);
    
    const { data, count, error } = await q;
    if (error) throw error;

    const leads = data || [];
    const total_leads = count || 0;
    const new_leads = leads.filter(l => l.lead_status === 'NEW').length;
    const qualified_leads = leads.filter(l => ['QUALIFIED', 'INTERESTED', 'NEGOTIATION'].includes(l.lead_status)).length;
    const won_leads = leads.filter(l => l.lead_status === 'WON').length;
    const lost_leads = leads.filter(l => l.lead_status === 'LOST').length;

    const conversion_rate = total_leads > 0 ? (won_leads / total_leads) * 100 : 0;

    return {
      total_leads,
      new_leads,
      qualified_leads,
      won_leads,
      lost_leads,
      conversion_rate
    };
  }

  async getPipelineFunnel(filters: DashboardFilterDto, role: string, userId: string): Promise<PipelineKPIEntity[]> {
    let q = this.supabase.from('leads').select('lead_status, budget_max').is('deleted_at', null);
    q = this.applyFilters(q, filters, role, userId);

    const { data, error } = await q;
    if (error) throw error;

    const pipeline: Record<string, PipelineKPIEntity> = {};
    (data || []).forEach(lead => {
      const status = lead.lead_status;
      if (!pipeline[status]) pipeline[status] = { status, count: 0, value: 0 };
      pipeline[status].count++;
      if (lead.budget_max) pipeline[status].value += Number(lead.budget_max);
    });

    return Object.values(pipeline);
  }

  async getFollowUpMetrics(filters: DashboardFilterDto, role: string, userId: string): Promise<FollowUpSummaryEntity> {
    // For FollowUps, assigned_to is on the Lead, so we have to join leads if role-based filtering is needed.
    // For brevity in this enterprise stub, we'll assume we can query follow_ups directly if no role filter, or we filter via lead join.
    let q = this.supabase.from('lead_follow_ups').select('is_completed, scheduled_at').is('deleted_at', null);
    
    // In production, to enforce 'assigned_to', we'd join 'leads!inner(assigned_to)'.
    if (role === 'sales') {
      q = this.supabase.from('lead_follow_ups').select('is_completed, scheduled_at, leads!inner(assigned_to)').eq('leads.assigned_to', userId).is('deleted_at', null);
    }

    const { data, error } = await q;
    if (error) throw error;

    const todayStr = new Date().toISOString().split('T')[0];
    const followUps = data || [];

    let today = 0;
    let overdue = 0;
    let upcoming = 0;
    let completed_today = 0;

    const nowTime = new Date().getTime();

    followUps.forEach(f => {
      const scheduledStr = f.scheduled_at.split('T')[0];
      const scheduledTime = new Date(f.scheduled_at).getTime();

      if (f.is_completed) {
         if (scheduledStr === todayStr) completed_today++;
      } else {
         if (scheduledStr === todayStr) today++;
         else if (scheduledTime < nowTime) overdue++;
         else upcoming++;
      }
    });

    return { today, overdue, upcoming, completed_today };
  }

  async getSiteVisitMetrics(filters: DashboardFilterDto, role: string, userId: string): Promise<SiteVisitSummaryEntity> {
    let q = this.supabase.from('site_visits').select('visit_status, scheduled_date').is('deleted_at', null);
    
    if (role === 'sales') {
      q = q.eq('assigned_sales_executive', userId);
    }

    const { data, error } = await q;
    if (error) throw error;

    const todayStr = new Date().toISOString().split('T')[0];
    
    let today = 0;
    let upcoming = 0;
    let completed_this_week = 0; // Simplified logic for stub

    (data || []).forEach(v => {
      if (['COMPLETED', 'NO_SHOW'].includes(v.visit_status)) {
         completed_this_week++;
      } else {
         if (v.scheduled_date === todayStr) today++;
         else if (v.scheduled_date > todayStr) upcoming++;
      }
    });

    return { today, upcoming, completed_this_week };
  }
}
