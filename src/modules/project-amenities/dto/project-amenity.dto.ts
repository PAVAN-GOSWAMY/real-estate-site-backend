import { z } from "zod";
import { 
  assignProjectAmenitySchema, 
  updateProjectAmenitySchema, 
  bulkAssignProjectAmenitiesSchema,
  bulkUpdateProjectAmenitiesSchema,
  bulkDeleteProjectAmenitiesSchema,
  projectAmenityFilterSchema 
} from "../validators/project-amenity.validator";
import { ProjectAmenityEntity } from "@/types/project-amenity.types";

export type AssignProjectAmenityDto = z.infer<typeof assignProjectAmenitySchema>;
export type UpdateProjectAmenityDto = z.infer<typeof updateProjectAmenitySchema>;
export type BulkAssignProjectAmenitiesDto = z.infer<typeof bulkAssignProjectAmenitiesSchema>;
export type BulkUpdateProjectAmenitiesDto = z.infer<typeof bulkUpdateProjectAmenitiesSchema>;
export type BulkDeleteProjectAmenitiesDto = z.infer<typeof bulkDeleteProjectAmenitiesSchema>;
export type ProjectAmenityFilterDto = z.infer<typeof projectAmenityFilterSchema>;

export interface ProjectAmenityResponseDto extends Omit<ProjectAmenityEntity, 'deleted_at' | 'created_by' | 'updated_by'> {
  project?: {
    id: string;
    project_name: string;
  };
  amenity?: {
    id: string;
    name: string;
    icon_name: string | null;
    is_premium: boolean;
  };
}
