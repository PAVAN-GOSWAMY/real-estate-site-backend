import { z } from "zod";
import {
  createLeadSchema,
  updateLeadSchema,
  mergeLeadSchema,
  leadFilterSchema,
  duplicateCheckSchema
} from "../validators/lead.validator";
import { LeadEntity } from "@/types/lead.types";

export type CreateLeadDto = z.infer<typeof createLeadSchema>;
export type UpdateLeadDto = z.infer<typeof updateLeadSchema>;
export type MergeLeadDto = z.infer<typeof mergeLeadSchema>;
export type LeadFilterDto = z.infer<typeof leadFilterSchema>;
export type DuplicateCheckDto = z.infer<typeof duplicateCheckSchema>;

export interface LeadResponseDto extends Omit<LeadEntity, 'deleted_at'> {
  project?: any;
  property?: any;
}

export interface LeadStatisticsDto {
  total_leads: number;
  new_leads: number;
  qualified_leads: number;
  converted_leads: number;
  sources_breakdown: Record<string, number>;
  status_breakdown: Record<string, number>;
}
