import { z } from "zod";
import {
  createPreferenceSchema,
  updatePreferenceSchema,
  preferenceFilterSchema,
  duplicateCheckPreferenceSchema
} from "../validators/preference.validator";
import { LeadPreferenceEntity } from "@/types/preference.types";

export type CreateLeadPreferenceDto = z.infer<typeof createPreferenceSchema>;
export type UpdateLeadPreferenceDto = z.infer<typeof updatePreferenceSchema>;
export type LeadPreferenceFilterDto = z.infer<typeof preferenceFilterSchema>;
export type DuplicateCheckPreferenceDto = z.infer<typeof duplicateCheckPreferenceSchema>;

export interface LeadPreferenceResponseDto extends Omit<LeadPreferenceEntity, 'deleted_at'> {
  location?: any;
  category?: any;
  configuration?: any;
  builder?: any;
  project?: any;
  tower?: any;
}

export interface LeadPreferenceRecommendationDto {
  preference_id: string;
  lead_id: string;
  must_haves: Record<string, any>;
  nice_to_haves: Record<string, any>;
  exclusions: Record<string, any>;
}
