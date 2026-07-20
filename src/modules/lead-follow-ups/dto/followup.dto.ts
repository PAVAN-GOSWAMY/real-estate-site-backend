import { z } from "zod";
import {
  createFollowUpSchema,
  updateFollowUpSchema,
  completeFollowUpSchema,
  rescheduleFollowUpSchema,
  escalateFollowUpSchema,
  cancelFollowUpSchema,
  followUpFilterSchema
} from "../validators/followup.validator";
import { LeadFollowUpEntity } from "@/types/followup.types";

export type CreateLeadFollowUpDto = z.infer<typeof createFollowUpSchema>;
export type UpdateLeadFollowUpDto = z.infer<typeof updateFollowUpSchema>;
export type CompleteFollowUpDto = z.infer<typeof completeFollowUpSchema>;
export type RescheduleFollowUpDto = z.infer<typeof rescheduleFollowUpSchema>;
export type EscalateFollowUpDto = z.infer<typeof escalateFollowUpSchema>;
export type CancelFollowUpDto = z.infer<typeof cancelFollowUpSchema>;
export type LeadFollowUpFilterDto = z.infer<typeof followUpFilterSchema>;

export interface LeadFollowUpResponseDto extends Omit<LeadFollowUpEntity, 'deleted_at'> {
  lead?: any;
  project?: any;
  property?: any;
}

export interface FollowUpStatisticsDto {
  total_upcoming: number;
  total_today: number;
  total_overdue: number;
  completion_rate: number;
}
