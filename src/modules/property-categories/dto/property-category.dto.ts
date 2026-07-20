import { z } from "zod";
import { 
  createPropertyCategorySchema, 
  updatePropertyCategorySchema, 
  propertyCategoryFilterSchema 
} from "../validators/property-category.validator";
import { PropertyCategoryEntity } from "@/types/property-category.types";

export type CreatePropertyCategoryDto = z.infer<typeof createPropertyCategorySchema>;
export type UpdatePropertyCategoryDto = z.infer<typeof updatePropertyCategorySchema>;
export type PropertyCategoryFilterDto = z.infer<typeof propertyCategoryFilterSchema>;

export interface PropertyCategoryResponseDto extends Omit<PropertyCategoryEntity, 'deleted_at' | 'created_by' | 'updated_by'> {
  // Can be extended if needed
}
