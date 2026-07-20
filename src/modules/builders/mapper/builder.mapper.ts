import { BuilderResponseDto } from "../dto/builder.dto";
import { BuilderEntity } from "@/types/builder.types";

export class BuilderMapper {
  static toResponse(entity: BuilderEntity): BuilderResponseDto {
    const { deleted_at, created_by, updated_by, ...rest } = entity;
    return rest;
  }

  static toResponseList(entities: BuilderEntity[]): BuilderResponseDto[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
