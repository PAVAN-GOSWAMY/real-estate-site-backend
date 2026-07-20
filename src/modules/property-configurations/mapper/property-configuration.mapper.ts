import { PropertyConfigurationResponseDto } from "../dto/property-configuration.dto";
import { PropertyConfigurationEntity } from "@/types/property-configuration.types";

export class PropertyConfigurationMapper {
  static toResponse(entity: PropertyConfigurationEntity): PropertyConfigurationResponseDto {
    const { deleted_at, created_by, updated_by, ...rest } = entity;
    return rest;
  }

  static toResponseList(entities: PropertyConfigurationEntity[]): PropertyConfigurationResponseDto[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
