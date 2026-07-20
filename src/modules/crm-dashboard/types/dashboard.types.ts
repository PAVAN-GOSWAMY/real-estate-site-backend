export interface LeadKPIEntity {
  total_leads: number;
  new_leads: number;
  qualified_leads: number;
  won_leads: number;
  lost_leads: number;
  conversion_rate: number;
}

export interface PipelineKPIEntity {
  status: string;
  count: number;
  value: number;
}

export interface FollowUpSummaryEntity {
  today: number;
  overdue: number;
  upcoming: number;
  completed_today: number;
}

export interface SiteVisitSummaryEntity {
  today: number;
  upcoming: number;
  completed_this_week: number;
}

export interface RevenueSummaryEntity {
  total_revenue: number;
  average_deal_size: number;
  deals_closed: number;
}
