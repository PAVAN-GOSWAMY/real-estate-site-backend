import { z } from "zod";
import { 
  assignPropertyFeatureSchema, 
  updatePropertyFeatureSchema, 
  bulkAssignPropertyFeaturesSchema,
  bulkUpdatePropertyFeaturesSchema,
  bulkDeletePropertyFeaturesSchema,
  propertyFeatureFilterSchema 
} from "../validators/property-feature.validator";
import { PropertyFeatureAssignmentEntity } from "@/types/property-feature.types";

export type AssignPropertyFeatureDto = z.infer<typeof assignPropertyFeatureSchema>;
export type UpdatePropertyFeatureDto = z.infer<typeof updatePropertyFeatureSchema>;
export type BulkAssignPropertyFeaturesDto = z.infer<typeof bulkAssignPropertyFeaturesSchema>;
export type BulkUpdatePropertyFeaturesDto = z.infer<typeof bulkUpdatePropertyFeaturesSchema>;
export type BulkDeletePropertyFeaturesDto = z.infer<typeof bulkDeletePropertyFeaturesSchema>;
export type PropertyFeatureFilterDto = z.infer<typeof propertyFeatureFilterSchema>;

export interface PropertyFeatureResponseDto extends Omit<PropertyFeatureAssignmentEntity, 'deleted_at' | 'created_by' | 'updated_by'> {
  property?: {
    id: string;
    // other property fields could be loaded if necessary, but 'id' is safe
  };
  feature?: {
    id: string;
    name: string;
    icon_name: string | null;
    theme_color: string | null;
    is_premium: boolean;
  };
}
