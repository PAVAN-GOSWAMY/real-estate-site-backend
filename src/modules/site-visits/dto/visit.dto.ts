import { z } from "zod";
import {
  createVisitSchema,
  updateVisitSchema,
  checkInSchema,
  checkOutSchema,
  rescheduleSchema,
  cancelSchema,
  feedbackSchema,
  searchVisitSchema
} from "../validators/visit.validator";
import { SiteVisitEntity } from "@/types/visit.types";

export type CreateSiteVisitDto = z.infer<typeof createVisitSchema>;
export type UpdateSiteVisitDto = z.infer<typeof updateVisitSchema>;
export type CheckInSiteVisitDto = z.infer<typeof checkInSchema>;
export type CheckOutSiteVisitDto = z.infer<typeof checkOutSchema>;
export type RescheduleSiteVisitDto = z.infer<typeof rescheduleSchema>;
export type CancelSiteVisitDto = z.infer<typeof cancelSchema>;
export type SiteVisitFeedbackDto = z.infer<typeof feedbackSchema>;
export type SiteVisitSearchDto = z.infer<typeof searchVisitSchema>;

export interface SiteVisitResponseDto extends Omit<SiteVisitEntity, 'deleted_at'> {
  lead?: any;
  project?: any;
  property?: any;
  assigned_to?: any;
}

export interface SiteVisitStatisticsDto {
  total_visits: number;
  completed_visits: number;
  upcoming_visits: number;
  cancelled_visits: number;
}
