import { z } from "zod";
import {
  createComparisonSessionSchema,
  addPropertyToComparisonSchema,
  replaceComparisonPropertySchema,
  shareComparisonSchema,
  comparisonHistoryQuerySchema
} from "../validators/property-comparisons.validator";
import { PropertyComparisonSessionEntity, PropertyComparisonItemEntity } from "@/types/property-comparisons.types";

export type CreateComparisonSessionDto = z.infer<typeof createComparisonSessionSchema>;
export type AddPropertyToComparisonDto = z.infer<typeof addPropertyToComparisonSchema>;
export type ReplaceComparisonPropertyDto = z.infer<typeof replaceComparisonPropertySchema>;
export type ShareComparisonDto = z.infer<typeof shareComparisonSchema>;
export type ComparisonHistoryQueryDto = z.infer<typeof comparisonHistoryQuerySchema>;

export interface PropertyComparisonSessionResponseDto extends Omit<PropertyComparisonSessionEntity, 'created_at' | 'updated_at'> {
  items?: any[]; // Full eager loaded properties
}
