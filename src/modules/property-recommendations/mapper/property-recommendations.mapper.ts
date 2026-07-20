import { PropertyRecommendationResponseDto } from "../dto/property-recommendations.dto";

export class PropertyRecommendationMapper {
  static toResponse(entity: any): PropertyRecommendationResponseDto {
    const { created_at, updated_at, ...rest } = entity;
    return { ...rest };
  }

  static toResponseList(entities: any[]): PropertyRecommendationResponseDto[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
