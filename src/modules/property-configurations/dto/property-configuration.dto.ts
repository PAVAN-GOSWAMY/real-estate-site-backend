import { z } from "zod";
import { 
  createPropertyConfigurationSchema, 
  updatePropertyConfigurationSchema, 
  propertyConfigurationFilterSchema 
} from "../validators/property-configuration.validator";
import { PropertyConfigurationEntity } from "@/types/property-configuration.types";

export type CreatePropertyConfigurationDto = z.infer<typeof createPropertyConfigurationSchema>;
export type UpdatePropertyConfigurationDto = z.infer<typeof updatePropertyConfigurationSchema>;
export type PropertyConfigurationFilterDto = z.infer<typeof propertyConfigurationFilterSchema>;

export interface PropertyConfigurationResponseDto extends Omit<PropertyConfigurationEntity, 'deleted_at' | 'created_by' | 'updated_by'> {
  // Can be extended if needed
}
