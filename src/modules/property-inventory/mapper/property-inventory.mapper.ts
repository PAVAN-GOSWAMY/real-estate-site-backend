import { PropertyInventoryStateResponseDto, PropertyInventoryTransactionResponseDto } from "../dto/property-inventory.dto";

export class PropertyInventoryMapper {
  static toStateResponse(entity: any): PropertyInventoryStateResponseDto {
    const { lead_id, ...rest } = entity;
    // We intentionally strip lead_id from standard responses unless explicitly needed, for data privacy.
    return { ...rest };
  }

  static toTransactionResponse(entity: any): PropertyInventoryTransactionResponseDto {
    const { deleted_at, created_by, ...rest } = entity;
    return { ...rest };
  }

  static toStateResponseList(entities: any[]): PropertyInventoryStateResponseDto[] {
    return entities.map(entity => this.toStateResponse(entity));
  }

  static toTransactionResponseList(entities: any[]): PropertyInventoryTransactionResponseDto[] {
    return entities.map(entity => this.toTransactionResponse(entity));
  }
}
