"use server";

import { AnalyticsService } from "../services/analytics.service";
import { AnalyticsFilters } from "../types";

export async function getCrmKpisAction(filters?: AnalyticsFilters) {
  return await AnalyticsService.getCrmKpis(filters);
}

export async function getLeadTrendsAction(interval: 'day' | 'week' | 'month' = 'day', filters?: AnalyticsFilters) {
  return await AnalyticsService.getLeadTrends(interval, filters);
}

export async function getLeadSourcesAction(filters?: AnalyticsFilters) {
  return await AnalyticsService.getLeadSources(filters);
}

export async function getPropertyPerformanceAction(limit: number = 10, filters?: AnalyticsFilters) {
  return await AnalyticsService.getPropertyPerformance(limit, filters);
}

export async function getBuilderPerformanceAction(limit: number = 10, filters?: AnalyticsFilters) {
  return await AnalyticsService.getBuilderPerformance(limit, filters);
}

export async function getLocalityPerformanceAction(limit: number = 10, filters?: AnalyticsFilters) {
  return await AnalyticsService.getLocalityPerformance(limit, filters);
}

export async function getRecentActivityAction(limit: number = 10) {
  return await AnalyticsService.getRecentActivity(limit);
}
