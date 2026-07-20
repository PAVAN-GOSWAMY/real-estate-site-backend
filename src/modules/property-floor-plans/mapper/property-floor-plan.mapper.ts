import { PropertyFloorPlanResponseDto, PropertyFloorPlanCardDto } from "../dto/property-floor-plan.dto";

export class PropertyFloorPlanMapper {
  static toResponse(entity: any): PropertyFloorPlanResponseDto {
    const { deleted_at, created_by, updated_by, properties, ...rest } = entity;
    
    const response: PropertyFloorPlanResponseDto = {
      ...rest
    };

    if (properties) {
      response.property = {
        id: properties.id,
        unit_code: properties.unit_code,
        slug: properties.slug,
      };
    }

    return response;
  }

  static toResponseList(entities: any[]): PropertyFloorPlanResponseDto[] {
    return entities.map(entity => this.toResponse(entity));
  }

  static toCard(entity: any): PropertyFloorPlanCardDto {
    const response = this.toResponse(entity);
    return {
      id: response.id,
      property_id: response.property_id,
      plan_name: response.plan_name,
      plan_code: response.plan_code,
      public_url: response.public_url,
      thumbnail_url: response.thumbnail_url,
      file_format: response.file_format,
      carpet_area: response.carpet_area,
      is_primary: response.is_primary,
      is_downloadable: response.is_downloadable,
      display_order: response.display_order,
    };
  }

  static toCardList(entities: any[]): PropertyFloorPlanCardDto[] {
    return entities.map(entity => this.toCard(entity));
  }
}
