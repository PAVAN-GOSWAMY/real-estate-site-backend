import { PropertyVideoResponseDto, PropertyVideoCardDto } from "../dto/property-video.dto";

export class PropertyVideoMapper {
  static toResponse(entity: any): PropertyVideoResponseDto {
    const { deleted_at, created_by, updated_by, properties, ...rest } = entity;
    
    const response: PropertyVideoResponseDto = {
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

  static toResponseList(entities: any[]): PropertyVideoResponseDto[] {
    return entities.map(entity => this.toResponse(entity));
  }

  static toCard(entity: any): PropertyVideoCardDto {
    const response = this.toResponse(entity);
    return {
      id: response.id,
      property_id: response.property_id,
      video_name: response.video_name,
      title: response.title,
      video_code: response.video_code,
      video_type: response.video_type,
      video_provider: response.video_provider,
      provider_video_id: response.provider_video_id,
      public_url: response.public_url,
      thumbnail_url: response.thumbnail_url,
      duration_seconds: response.duration_seconds,
      view_count: response.view_count,
      is_primary: response.is_primary,
      is_downloadable: response.is_downloadable,
      display_order: response.display_order,
    };
  }

  static toCardList(entities: any[]): PropertyVideoCardDto[] {
    return entities.map(entity => this.toCard(entity));
  }
}
