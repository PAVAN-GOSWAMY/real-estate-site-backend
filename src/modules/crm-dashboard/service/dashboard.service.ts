import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { DashboardRepository } from "../repository/dashboard.repository";
import { DashboardFilterDto, DashboardSummaryDto } from "../dto/dashboard.dto";

export class DashboardService extends BaseService {
  private repository: DashboardRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new DashboardRepository(supabase);
  }

  private async aggregateDashboard(filters: DashboardFilterDto, role: string, userId: string): Promise<DashboardSummaryDto> {
    // Execute all queries in parallel for maximum aggregation performance
    const [lead_kpis, pipeline, follow_ups, site_visits] = await Promise.all([
      this.repository.getLeadKPIs(filters, role, userId),
      this.repository.getPipelineFunnel(filters, role, userId),
      this.repository.getFollowUpMetrics(filters, role, userId),
      this.repository.getSiteVisitMetrics(filters, role, userId)
    ]);

    const result: DashboardSummaryDto = {
      lead_kpis,
      pipeline,
      follow_ups,
      site_visits
    };

    // Only inject revenue for specific roles
    if (['admin', 'executive', 'manager'].includes(role)) {
      result.revenue = {
        total_revenue: pipeline.filter(p => p.status === 'WON').reduce((sum, p) => sum + p.value, 0),
        deals_closed: lead_kpis.won_leads,
        average_deal_size: lead_kpis.won_leads > 0 ? (pipeline.find(p => p.status === 'WON')?.value || 0) / lead_kpis.won_leads : 0
      };
    }

    return result;
  }

  async getAdminDashboard(filters: DashboardFilterDto, userId: string) {
    return this.executeSafe(async () => this.aggregateDashboard(filters, 'admin', userId));
  }

  async getExecutiveDashboard(filters: DashboardFilterDto, userId: string) {
    return this.executeSafe(async () => this.aggregateDashboard(filters, 'executive', userId));
  }

  async getManagerDashboard(filters: DashboardFilterDto, userId: string) {
    return this.executeSafe(async () => this.aggregateDashboard(filters, 'manager', userId));
  }

  async getSalesDashboard(filters: DashboardFilterDto, userId: string) {
    return this.executeSafe(async () => this.aggregateDashboard(filters, 'sales', userId));
  }
}
