import { z } from "zod";
import {
  changeStatusSchema,
  bulkStatusSchema,
  reopenLeadSchema
} from "../validators/status.validator";
import { LeadStatusHistoryEntity } from "@/types/status.types";

export type ChangeLeadStatusDto = z.infer<typeof changeStatusSchema>;
export type BulkLeadStatusDto = z.infer<typeof bulkStatusSchema>;
export type ReopenLeadDto = z.infer<typeof reopenLeadSchema>;

export interface LeadStatusHistoryDto extends Omit<LeadStatusHistoryEntity, 'deleted_at'> {
  changed_by_user?: any; // To populate auth.users when integrated
}

export interface LeadPipelineDto {
  status: string;
  count: number;
  value?: number; // Sum of budgets if applicable
}

export interface LeadPipelineStatisticsDto {
  conversion_rate: number;
  win_rate: number;
  loss_rate: number;
  average_stage_duration_minutes: number;
}
