import { ProjectMediaResponseDto } from "../dto/project-media.dto";
import { ProjectMediaEntity } from "@/types/project-media.types";

export class ProjectMediaMapper {
  static toResponse(entity: any): ProjectMediaResponseDto {
    const { deleted_at, created_by, updated_by, projects, ...rest } = entity;
    
    const response: ProjectMediaResponseDto = {
      ...rest
    };

    if (projects) {
      response.project = {
        id: projects.id,
        project_name: projects.project_name
      };
    }

    return response;
  }

  static toResponseList(entities: any[]): ProjectMediaResponseDto[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
