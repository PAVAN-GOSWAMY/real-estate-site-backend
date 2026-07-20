import { z } from "zod";
import { propertyStatusSchema, propertyAvailabilitySchema } from "@/lib/validators/enums.validator";
import { paginationSchema } from "@/lib/validators/common.validator";

export const basePreferenceSchema = z.object({
  location_id: z.string().uuid().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  configuration_id: z.string().uuid().optional().nullable(),
  
  preferred_builder: z.string().uuid().optional().nullable(),
  preferred_project: z.string().uuid().optional().nullable(),
  preferred_tower: z.string().uuid().optional().nullable(),
  
  budget_min: z.number().min(0).optional().nullable(),
  budget_max: z.number().min(0).optional().nullable(),
  
  minimum_area: z.number().min(0).optional().nullable(),
  maximum_area: z.number().min(0).optional().nullable(),
  area_unit: z.string().optional().default('SQ_FT'),
  
  preferred_floor_min: z.number().int().optional().nullable(),
  preferred_floor_max: z.number().int().optional().nullable(),
  preferred_facing: z.string().optional().nullable(),
  preferred_bedrooms: z.number().min(0).optional().nullable(),
  preferred_bathrooms: z.number().int().min(0).optional().nullable(),
  
  preferred_possession_status: propertyStatusSchema.optional().nullable(),
  preferred_availability: propertyAvailabilitySchema.optional().nullable(),
  
  parking_required: z.boolean().optional().default(false),
  furnished_required: z.boolean().optional().default(false),
  loan_required: z.boolean().optional().default(false),
  investment_purpose: z.boolean().optional().default(false),
  self_use: z.boolean().optional().default(false),
  
  remarks: z.string().max(2000).optional().nullable(),
  is_current: z.boolean().optional().default(false),
})
.refine(data => !data.budget_min || !data.budget_max || data.budget_min <= data.budget_max, {
  message: "Budget minimum cannot be greater than budget maximum", path: ["budget_min"]
})
.refine(data => !data.minimum_area || !data.maximum_area || data.minimum_area <= data.maximum_area, {
  message: "Minimum area cannot be greater than maximum area", path: ["minimum_area"]
})
.refine(data => !data.preferred_floor_min || !data.preferred_floor_max || data.preferred_floor_min <= data.preferred_floor_max, {
  message: "Minimum floor cannot be greater than maximum floor", path: ["preferred_floor_min"]
});

export const createPreferenceSchema = basePreferenceSchema;
export const updatePreferenceSchema = basePreferenceSchema.partial();

export const duplicateCheckPreferenceSchema = basePreferenceSchema.partial();

export const preferenceFilterSchema = paginationSchema.extend({
  is_current: z.boolean().optional(),
});
