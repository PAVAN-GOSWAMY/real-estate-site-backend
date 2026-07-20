import { z } from "zod";
import {
  createPropertyFloorPlanSchema,
  updatePropertyFloorPlanSchema,
  bulkUploadPropertyFloorPlansSchema,
  bulkUpdatePropertyFloorPlansSchema,
  bulkDeletePropertyFloorPlansSchema,
  reorderPropertyFloorPlansSchema,
  updatePrimaryFloorPlanSchema,
  propertyFloorPlanFilterSchema
} from "../validators/property-floor-plan.validator";
import { PropertyFloorPlanEntity } from "@/types/property-floor-plan.types";

export type CreatePropertyFloorPlanDto = z.infer<typeof createPropertyFloorPlanSchema>;
export type UpdatePropertyFloorPlanDto = z.infer<typeof updatePropertyFloorPlanSchema>;
export type BulkUploadPropertyFloorPlansDto = z.infer<typeof bulkUploadPropertyFloorPlansSchema>;
export type BulkUpdatePropertyFloorPlansDto = z.infer<typeof bulkUpdatePropertyFloorPlansSchema>;
export type BulkDeletePropertyFloorPlansDto = z.infer<typeof bulkDeletePropertyFloorPlansSchema>;
export type ReorderPropertyFloorPlansDto = z.infer<typeof reorderPropertyFloorPlansSchema>;
export type UpdatePrimaryFloorPlanDto = z.infer<typeof updatePrimaryFloorPlanSchema>;
export type PropertyFloorPlanFilterDto = z.infer<typeof propertyFloorPlanFilterSchema>;

export interface PropertyFloorPlanResponseDto extends Omit<PropertyFloorPlanEntity, 'deleted_at' | 'created_by' | 'updated_by'> {
  property?: {
    id: string;
    unit_code: string;
    slug: string;
  };
}

export type PropertyFloorPlanCardDto = Pick<PropertyFloorPlanResponseDto, 
  'id' | 'property_id' | 'plan_name' | 'plan_code' | 'public_url' | 'thumbnail_url' | 'file_format' | 'carpet_area' | 'is_primary' | 'is_downloadable' | 'display_order'>;
