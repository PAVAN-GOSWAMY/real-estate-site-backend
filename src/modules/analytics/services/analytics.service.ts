import { createClient } from "@/lib/supabase/server";
import { 
  KpiMetrics, 
  LeadTrend, 
  LeadSource, 
  PropertyPerformance, 
  BuilderPerformance, 
  LocalityPerformance,
  AnalyticsFilters
} from "../types";

export class AnalyticsService {
  
  static async getCrmKpis(filters?: AnalyticsFilters): Promise<KpiMetrics | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_crm_kpis", {
      p_start_date: filters?.startDate?.toISOString() || null,
      p_end_date: filters?.endDate?.toISOString() || null
    });

    if (error) {
      console.error("Error fetching KPIs:", error);
      return null;
    }
    return data?.[0] || null;
  }

  static async getLeadTrends(interval: 'day' | 'week' | 'month' = 'day', filters?: AnalyticsFilters): Promise<LeadTrend[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_lead_trends", {
      p_start_date: filters?.startDate?.toISOString() || null,
      p_end_date: filters?.endDate?.toISOString() || null,
      p_interval: interval
    });

    if (error) {
      console.error("Error fetching lead trends:", error);
      return [];
    }
    return data || [];
  }

  static async getLeadSources(filters?: AnalyticsFilters): Promise<LeadSource[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_lead_sources", {
      p_start_date: filters?.startDate?.toISOString() || null,
      p_end_date: filters?.endDate?.toISOString() || null
    });

    if (error) {
      console.error("Error fetching lead sources:", error);
      return [];
    }
    return data || [];
  }

  static async getPropertyPerformance(limit: number = 10, filters?: AnalyticsFilters): Promise<PropertyPerformance[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_property_performance", {
      p_start_date: filters?.startDate?.toISOString() || null,
      p_end_date: filters?.endDate?.toISOString() || null,
      p_limit: limit
    });

    if (error) {
      console.error("Error fetching property performance:", error);
      return [];
    }
    return data || [];
  }

  static async getBuilderPerformance(limit: number = 10, filters?: AnalyticsFilters): Promise<BuilderPerformance[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_builder_performance", {
      p_start_date: filters?.startDate?.toISOString() || null,
      p_end_date: filters?.endDate?.toISOString() || null,
      p_limit: limit
    });

    if (error) {
      console.error("Error fetching builder performance:", error);
      return [];
    }
    return data || [];
  }

  static async getLocalityPerformance(limit: number = 10, filters?: AnalyticsFilters): Promise<LocalityPerformance[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_locality_performance", {
      p_start_date: filters?.startDate?.toISOString() || null,
      p_end_date: filters?.endDate?.toISOString() || null,
      p_limit: limit
    });

    if (error) {
      console.error("Error fetching locality performance:", error);
      return [];
    }
    return data || [];
  }

  static async getRecentActivity(limit: number = 10) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('lead_activities')
      .select(`
        *,
        leads (
          full_name,
          properties (title)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recent activity:", error);
      return [];
    }
    return data || [];
  }
}
