import { z } from "zod";
import { 
  createProjectMediaSchema, 
  updateProjectMediaSchema, 
  bulkUploadProjectMediaSchema,
  bulkUpdateProjectMediaSchema,
  bulkDeleteProjectMediaSchema,
  reorderProjectMediaSchema,
  projectMediaStatusSchema,
  projectMediaFilterSchema 
} from "../validators/project-media.validator";
import { ProjectMediaEntity } from "@/types/project-media.types";

export type CreateProjectMediaDto = z.infer<typeof createProjectMediaSchema>;
export type UpdateProjectMediaDto = z.infer<typeof updateProjectMediaSchema>;
export type BulkUploadProjectMediaDto = z.infer<typeof bulkUploadProjectMediaSchema>;
export type BulkUpdateProjectMediaDto = z.infer<typeof bulkUpdateProjectMediaSchema>;
export type BulkDeleteProjectMediaDto = z.infer<typeof bulkDeleteProjectMediaSchema>;
export type ReorderProjectMediaDto = z.infer<typeof reorderProjectMediaSchema>;
export type ProjectMediaStatusDto = z.infer<typeof projectMediaStatusSchema>;
export type ProjectMediaFilterDto = z.infer<typeof projectMediaFilterSchema>;

export interface ProjectMediaResponseDto extends Omit<ProjectMediaEntity, 'deleted_at' | 'created_by' | 'updated_by'> {
  project?: {
    id: string;
    project_name: string;
  };
}
