import { z } from "zod";
import { 
  createLocationSchema, 
  updateLocationSchema, 
  locationFilterSchema 
} from "../validators/location.validator";
import { LocationEntity } from "@/types/location.types";

export type CreateLocationDto = z.infer<typeof createLocationSchema>;
export type UpdateLocationDto = z.infer<typeof updateLocationSchema>;
export type LocationFilterDto = z.infer<typeof locationFilterSchema>;

export interface LocationResponseDto extends Omit<LocationEntity, 'deleted_at' | 'created_by' | 'updated_by'> {
  // If we joined parent data, we could include it here. 
  // For now, mapping directly from Entity is fine.
}
