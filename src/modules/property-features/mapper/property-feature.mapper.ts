import { PropertyFeatureResponseDto } from "../dto/property-feature.dto";
import { PropertyFeatureAssignmentEntity } from "@/types/property-feature.types";

export class PropertyFeatureMapper {
  static toResponse(entity: any): PropertyFeatureResponseDto {
    const { deleted_at, created_by, updated_by, properties, property_features, ...rest } = entity;
    
    const response: PropertyFeatureResponseDto = {
      ...rest
    };

    if (properties) {
      response.property = {
        id: properties.id
      };
    }

    if (property_features) {
      response.feature = {
        id: property_features.id,
        name: property_features.name,
        icon_name: property_features.icon_name,
        theme_color: property_features.theme_color,
        is_premium: property_features.is_premium
      };
    }

    return response;
  }

  static toResponseList(entities: any[]): PropertyFeatureResponseDto[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
