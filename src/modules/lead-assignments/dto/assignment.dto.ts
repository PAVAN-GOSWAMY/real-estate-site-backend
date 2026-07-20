import { z } from "zod";
import {
  createAssignmentSchema,
  updateAssignmentSchema,
  bulkAssignmentSchema,
  roundRobinAssignmentSchema,
  autoAssignmentSchema,
  reassignSchema,
  assignmentFilterSchema
} from "../validators/assignment.validator";
import { LeadAssignmentEntity } from "@/types/assignment.types";

export type CreateLeadAssignmentDto = z.infer<typeof createAssignmentSchema>;
export type UpdateLeadAssignmentDto = z.infer<typeof updateAssignmentSchema>;
export type BulkLeadAssignmentDto = z.infer<typeof bulkAssignmentSchema>;
export type RoundRobinAssignmentDto = z.infer<typeof roundRobinAssignmentSchema>;
export type AutoAssignmentDto = z.infer<typeof autoAssignmentSchema>;
export type ReassignLeadDto = z.infer<typeof reassignSchema>;
export type LeadAssignmentFilterDto = z.infer<typeof assignmentFilterSchema>;

export interface LeadAssignmentResponseDto extends Omit<LeadAssignmentEntity, 'deleted_at'> {
  lead?: any;
}

export interface WorkloadStatisticsDto {
  user_id: string;
  active_leads: number;
}
