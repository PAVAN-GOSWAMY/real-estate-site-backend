import { z } from "zod";
import { 
  createPropertySchema, 
  updatePropertySchema, 
  updatePropertyStatusSchema,
  updatePropertyAvailabilitySchema,
  updatePropertyPricingSchema,
  bulkCreatePropertySchema,
  bulkUpdatePropertySchema,
  bulkDeletePropertySchema,
  propertyFilterSchema
} from "../validators/property.validator";
import { PropertyEntity } from "@/types/property.types";

export type CreatePropertyDto = z.infer<typeof createPropertySchema>;
export type UpdatePropertyDto = z.infer<typeof updatePropertySchema>;
export type UpdatePropertyStatusDto = z.infer<typeof updatePropertyStatusSchema>;
export type UpdatePropertyAvailabilityDto = z.infer<typeof updatePropertyAvailabilitySchema>;
export type UpdatePropertyPricingDto = z.infer<typeof updatePropertyPricingSchema>;
export type BulkCreatePropertyDto = z.infer<typeof bulkCreatePropertySchema>;
export type BulkUpdatePropertyDto = z.infer<typeof bulkUpdatePropertySchema>;
export type BulkDeletePropertyDto = z.infer<typeof bulkDeletePropertySchema>;
export type PropertyFilterDto = z.infer<typeof propertyFilterSchema>;

export interface PropertyResponseDto extends Omit<PropertyEntity, 'deleted_at' | 'created_by' | 'updated_by'> {
  tower?: {
    id: string;
    tower_name: string;
    project?: {
      id: string;
      project_name: string;
    };
  };
  configuration?: {
    id: string;
    name: string;
    category?: {
      id: string;
      name: string;
    };
  };
}

export type PropertyCardDto = Pick<PropertyResponseDto, 
  'id' | 'unit_code' | 'slug' | 'listing_title' | 'price' | 
  'property_status' | 'availability_status' | 'bedrooms' | 
  'bathrooms' | 'carpet_area' | 'area_unit' | 'tower' | 'configuration'>;
