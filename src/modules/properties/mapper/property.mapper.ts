import { PropertyResponseDto, PropertyCardDto } from "../dto/property.dto";

export class PropertyMapper {
  static toResponse(entity: any): PropertyResponseDto {
    const { deleted_at, created_by, updated_by, project_towers, property_configurations, ...rest } = entity;
    
    const response: PropertyResponseDto = {
      ...rest
    };

    if (project_towers) {
      response.tower = {
        id: project_towers.id,
        tower_name: project_towers.tower_name,
      };
      if (project_towers.projects) {
        response.tower.project = {
          id: project_towers.projects.id,
          project_name: project_towers.projects.project_name
        };
      }
    }

    if (property_configurations) {
      response.configuration = {
        id: property_configurations.id,
        name: property_configurations.name,
      };
      if (property_configurations.property_categories) {
        response.configuration.category = {
          id: property_configurations.property_categories.id,
          name: property_configurations.property_categories.name
        };
      }
    }

    return response;
  }

  static toResponseList(entities: any[]): PropertyResponseDto[] {
    return entities.map(entity => this.toResponse(entity));
  }

  static toCard(entity: any): PropertyCardDto {
    const response = this.toResponse(entity);
    return {
      id: response.id,
      unit_code: response.unit_code,
      slug: response.slug,
      listing_title: response.listing_title,
      price: response.price,
      property_status: response.property_status,
      availability_status: response.availability_status,
      bedrooms: response.bedrooms,
      bathrooms: response.bathrooms,
      carpet_area: response.carpet_area,
      area_unit: response.area_unit,
      tower: response.tower,
      configuration: response.configuration,
    };
  }

  static toCardList(entities: any[]): PropertyCardDto[] {
    return entities.map(entity => this.toCard(entity));
  }
}
