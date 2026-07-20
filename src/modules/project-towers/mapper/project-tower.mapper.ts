import { ProjectTowerResponseDto } from "../dto/project-tower.dto";
import { ProjectTowerEntity } from "@/types/project-tower.types";

export class ProjectTowerMapper {
  static toResponse(entity: any): ProjectTowerResponseDto {
    const { deleted_at, created_by, updated_by, projects, ...rest } = entity;
    
    const response: ProjectTowerResponseDto = {
      ...rest
    };

    if (projects) {
      response.project = {
        id: projects.id,
        project_name: projects.project_name,
        project_code: projects.project_code,
        slug: projects.slug
      };
    }

    return response;
  }

  static toResponseList(entities: any[]): ProjectTowerResponseDto[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
