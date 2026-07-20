import { z } from "zod";
import { 
  createProjectTowerSchema, 
  updateProjectTowerSchema, 
  projectTowerFilterSchema 
} from "../validators/project-tower.validator";
import { ProjectTowerEntity } from "@/types/project-tower.types";

export type CreateProjectTowerDto = z.infer<typeof createProjectTowerSchema>;
export type UpdateProjectTowerDto = z.infer<typeof updateProjectTowerSchema>;
export type ProjectTowerFilterDto = z.infer<typeof projectTowerFilterSchema>;

export interface ProjectTowerResponseDto extends Omit<ProjectTowerEntity, 'deleted_at' | 'created_by' | 'updated_by'> {
  project?: {
    id: string;
    project_name: string;
    project_code: string;
    slug: string;
  };
}
