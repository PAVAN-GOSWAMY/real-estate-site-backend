import { z } from "zod";
import { dashboardFilterSchema } from "../validators/dashboard.validator";
import { 
  LeadKPIEntity, 
  PipelineKPIEntity, 
  FollowUpSummaryEntity, 
  SiteVisitSummaryEntity, 
  RevenueSummaryEntity 
} from "@/types/dashboard.types";

export type DashboardFilterDto = z.infer<typeof dashboardFilterSchema>;

export interface DashboardSummaryDto {
  lead_kpis: LeadKPIEntity;
  pipeline: PipelineKPIEntity[];
  follow_ups: FollowUpSummaryEntity;
  site_visits: SiteVisitSummaryEntity;
  revenue?: RevenueSummaryEntity;
}
