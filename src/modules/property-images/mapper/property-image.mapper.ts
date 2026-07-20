import { PropertyImageResponseDto, PropertyImageCardDto } from "../dto/property-image.dto";

export class PropertyImageMapper {
  static toResponse(entity: any): PropertyImageResponseDto {
    const { deleted_at, created_by, updated_by, properties, ...rest } = entity;
    
    const response: PropertyImageResponseDto = {
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

  static toResponseList(entities: any[]): PropertyImageResponseDto[] {
    return entities.map(entity => this.toResponse(entity));
  }

  static toCard(entity: any): PropertyImageCardDto {
    const response = this.toResponse(entity);
    return {
      id: response.id,
      property_id: response.property_id,
      image_type: response.image_type,
      public_url: response.public_url,
      thumbnail_url: response.thumbnail_url,
      alt_text: response.alt_text,
      is_cover: response.is_cover,
      display_order: response.display_order,
      room_name: response.room_name,
    };
  }

  static toCardList(entities: any[]): PropertyImageCardDto[] {
    return entities.map(entity => this.toCard(entity));
  }
}
