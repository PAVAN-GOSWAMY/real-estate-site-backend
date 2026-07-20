import { z } from "zod";
import { 
  createAmenitySchema, 
  updateAmenitySchema, 
  amenityFilterSchema 
} from "../validators/amenity.validator";
import { AmenityEntity } from "@/types/amenity.types";

export type CreateAmenityDto = z.infer<typeof createAmenitySchema>;
export type UpdateAmenityDto = z.infer<typeof updateAmenitySchema>;
export type AmenityFilterDto = z.infer<typeof amenityFilterSchema>;

export interface AmenityResponseDto extends Omit<AmenityEntity, 'deleted_at' | 'created_by' | 'updated_by'> {
  // Can be extended if needed
}
