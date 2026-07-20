import { PropertyComparisonSessionResponseDto } from "../dto/property-comparisons.dto";

export class PropertyComparisonMapper {
  static toSessionResponse(entity: any): PropertyComparisonSessionResponseDto {
    const { created_at, updated_at, ...rest } = entity;
    
    // Clean up items format if eager loaded
    if (rest.property_comparison_items) {
      rest.items = rest.property_comparison_items.map((item: any) => ({
        display_order: item.display_order,
        property: item.properties
      }));
      delete rest.property_comparison_items;
    }

    return { ...rest };
  }

  static toSessionResponseList(entities: any[]): PropertyComparisonSessionResponseDto[] {
    return entities.map(entity => this.toSessionResponse(entity));
  }
}
