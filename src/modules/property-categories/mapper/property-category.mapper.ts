import { PropertyCategoryResponseDto } from "../dto/property-category.dto";
import { PropertyCategoryEntity } from "@/types/property-category.types";

export class PropertyCategoryMapper {
  static toResponse(entity: PropertyCategoryEntity): PropertyCategoryResponseDto {
    const { deleted_at, created_by, updated_by, ...rest } = entity;
    return rest;
  }

  static toResponseList(entities: PropertyCategoryEntity[]): PropertyCategoryResponseDto[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
