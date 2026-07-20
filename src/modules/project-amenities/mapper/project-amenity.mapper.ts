import { ProjectAmenityResponseDto } from "../dto/project-amenity.dto";
import { ProjectAmenityEntity } from "@/types/project-amenity.types";

export class ProjectAmenityMapper {
  static toResponse(entity: any): ProjectAmenityResponseDto {
    const { deleted_at, created_by, updated_by, projects, amenities, ...rest } = entity;
    
    const response: ProjectAmenityResponseDto = {
      ...rest
    };

    if (projects) {
      response.project = {
        id: projects.id,
        project_name: projects.project_name
      };
    }

    if (amenities) {
      response.amenity = {
        id: amenities.id,
        name: amenities.name,
        icon_name: amenities.icon_name,
        is_premium: amenities.is_premium
      };
    }

    return response;
  }

  static toResponseList(entities: any[]): ProjectAmenityResponseDto[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
