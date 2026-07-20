import { PropertyPricingResponseDto } from "../dto/property-pricing.dto";

export class PropertyPricingMapper {
  static toResponse(entity: any): PropertyPricingResponseDto {
    const { deleted_at, created_by, approved_by, ...rest } = entity;
    return { ...rest };
  }

  static toResponseList(entities: any[]): PropertyPricingResponseDto[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
