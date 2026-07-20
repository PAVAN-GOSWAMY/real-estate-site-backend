import { PropertyPublicationResponseDto } from "../dto/property-publication.dto";

export class PropertyPublicationMapper {
  static toResponse(entity: any): PropertyPublicationResponseDto {
    const { deleted_at, created_by, ...rest } = entity;
    
    return {
      ...rest
    };
  }

  static toResponseList(entities: any[]): PropertyPublicationResponseDto[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
