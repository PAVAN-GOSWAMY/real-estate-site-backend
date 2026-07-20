import { z } from "zod";
import {
  createPricingRevisionSchema,
  updatePricingSchema,
  reviewPricingRevisionSchema,
  bulkPricingUpdateSchema,
  bulkCreatePricingRevisionSchema,
  bulkReviewPricingRevisionSchema,
  pricingHistoryQuerySchema,
  pendingRevisionsQuerySchema
} from "../validators/property-pricing.validator";
import { PropertyPricingRevisionEntity } from "@/types/property-pricing.types";

export type CreatePricingRevisionDto = z.infer<typeof createPricingRevisionSchema>;
export type UpdatePricingDto = z.infer<typeof updatePricingSchema>;
export type ReviewPricingRevisionDto = z.infer<typeof reviewPricingRevisionSchema>;
export type BulkPricingUpdateDto = z.infer<typeof bulkPricingUpdateSchema>;
export type BulkCreatePricingRevisionDto = z.infer<typeof bulkCreatePricingRevisionSchema>;
export type BulkReviewPricingRevisionDto = z.infer<typeof bulkReviewPricingRevisionSchema>;
export type PricingHistoryQueryDto = z.infer<typeof pricingHistoryQuerySchema>;
export type PendingRevisionsQueryDto = z.infer<typeof pendingRevisionsQuerySchema>;

export interface PropertyPricingResponseDto extends Omit<PropertyPricingRevisionEntity, 'deleted_at' | 'created_by' | 'approved_by'> {}

export interface BulkPricingResponseDto {
  success: PropertyPricingResponseDto[];
  failed: { id: string; error: string }[];
}
