import { z } from "zod";
import {
  featurePropertySchema,
  recommendPropertySchema,
  unrecommendPropertySchema,
  updateScoreSchema,
  bulkFeatureSchema,
  bulkRecommendSchema,
  recommendationQuerySchema,
  dashboardQuerySchema
} from "../validators/property-recommendations.validator";
import { PropertyRecommendationEntity } from "@/types/property-recommendations.types";

export type FeaturePropertyDto = z.infer<typeof featurePropertySchema>;
export type RecommendPropertyDto = z.infer<typeof recommendPropertySchema>;
export type UnrecommendPropertyDto = z.infer<typeof unrecommendPropertySchema>;
export type UpdateScoreDto = z.infer<typeof updateScoreSchema>;

export type BulkFeatureDto = z.infer<typeof bulkFeatureSchema>;
export type BulkRecommendDto = z.infer<typeof bulkRecommendSchema>;

export type RecommendationQueryDto = z.infer<typeof recommendationQuerySchema>;
export type DashboardQueryDto = z.infer<typeof dashboardQuerySchema>;

export interface PropertyRecommendationResponseDto extends Omit<PropertyRecommendationEntity, 'created_at' | 'updated_at'> {}

export interface BulkRecommendationResponseDto {
  success: PropertyRecommendationResponseDto[];
  failed: { property_id: string; error: string }[];
}
