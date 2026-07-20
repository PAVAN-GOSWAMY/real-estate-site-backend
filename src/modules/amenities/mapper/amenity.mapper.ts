import { AmenityResponseDto } from "../dto/amenity.dto";
import { AmenityEntity } from "@/types/amenity.types";

export class AmenityMapper {
  static toResponse(entity: AmenityEntity): AmenityResponseDto {
    const { deleted_at, created_by, updated_by, ...rest } = entity;
    return rest;
  }

  static toResponseList(entities: AmenityEntity[]): AmenityResponseDto[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
