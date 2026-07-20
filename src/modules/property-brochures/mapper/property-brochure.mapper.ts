import { PropertyBrochureResponseDto, PropertyBrochureCardDto } from "../dto/property-brochure.dto";

export class PropertyBrochureMapper {
  static toResponse(entity: any): PropertyBrochureResponseDto {
    const { deleted_at, created_by, updated_by, properties, ...rest } = entity;
    
    const response: PropertyBrochureResponseDto = {
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

  static toResponseList(entities: any[]): PropertyBrochureResponseDto[] {
    return entities.map(entity => this.toResponse(entity));
  }

  static toCard(entity: any): PropertyBrochureCardDto {
    const response = this.toResponse(entity);
    return {
      id: response.id,
      property_id: response.property_id,
      brochure_name: response.brochure_name,
      brochure_code: response.brochure_code,
      brochure_type: response.brochure_type,
      version: response.version,
      language: response.language,
      public_url: response.public_url,
      thumbnail_url: response.thumbnail_url,
      file_size: response.file_size,
      page_count: response.page_count,
      download_count: response.download_count,
      is_latest_version: response.is_latest_version,
      is_downloadable: response.is_downloadable,
      display_order: response.display_order,
    };
  }

  static toCardList(entities: any[]): PropertyBrochureCardDto[] {
    return entities.map(entity => this.toCard(entity));
  }
}
