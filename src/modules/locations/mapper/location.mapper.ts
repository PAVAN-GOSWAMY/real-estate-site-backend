import { LocationResponseDto } from "../dto/location.dto";
import { LocationEntity } from "@/types/location.types";

export class LocationMapper {
  static toResponse(entity: LocationEntity): LocationResponseDto {
    // Exclude internal database fields (like soft delete flags and author IDs)
    const { deleted_at, created_by, updated_by, ...rest } = entity;
    return rest;
  }

  static toResponseList(entities: LocationEntity[]): LocationResponseDto[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
