export interface KpiMetrics {
  total_leads: number;
  new_leads: number;
  contacted: number;
  site_visits: number;
  negotiation: number;
  closed_won: number;
  closed_lost: number;
  conversion_rate: number;
  active_pipeline: number;
}

export interface LeadTrend {
  date_bucket: string;
  lead_count: number;
}

export interface LeadSource {
  source_name: string;
  lead_count: number;
}

export interface PropertyPerformance {
  property_id: string;
  property_name: string;
  locality: string;
  builder_name: string;
  total_leads: number;
  won_deals: number;
  lost_deals: number;
  conversion_rate: number;
}

export interface BuilderPerformance {
  builder_id: string;
  builder_name: string;
  total_leads: number;
  won_deals: number;
  conversion_rate: number;
}

export interface LocalityPerformance {
  locality_name: string;
  property_count: number;
  total_leads: number;
  won_deals: number;
  conversion_rate: number;
}

export interface AnalyticsFilters {
  startDate?: Date;
  endDate?: Date;
}
