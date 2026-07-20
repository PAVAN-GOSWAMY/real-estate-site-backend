import { z } from "zod";
import {
  updateInventoryStatusSchema,
  reserveInventorySchema,
  bookInventorySchema,
  releaseInventorySchema,
  cancelInventorySchema,
  soldInventorySchema,
  blockInventorySchema,
  bulkUpdateInventoryStatusSchema,
  bulkReleaseInventorySchema,
  inventoryHistoryQuerySchema,
  inventoryDashboardQuerySchema
} from "../validators/property-inventory.validator";
import { PropertyInventoryStateEntity, PropertyInventoryTransactionEntity } from "@/types/property-inventory.types";

export type UpdateInventoryStatusDto = z.infer<typeof updateInventoryStatusSchema>;
export type ReserveInventoryDto = z.infer<typeof reserveInventorySchema>;
export type BookInventoryDto = z.infer<typeof bookInventorySchema>;
export type ReleaseInventoryDto = z.infer<typeof releaseInventorySchema>;
export type CancelInventoryDto = z.infer<typeof cancelInventorySchema>;
export type SoldInventoryDto = z.infer<typeof soldInventorySchema>;
export type BlockInventoryDto = z.infer<typeof blockInventorySchema>;

export type BulkUpdateInventoryStatusDto = z.infer<typeof bulkUpdateInventoryStatusSchema>;
export type BulkReleaseInventoryDto = z.infer<typeof bulkReleaseInventorySchema>;

export type InventoryHistoryQueryDto = z.infer<typeof inventoryHistoryQuerySchema>;
export type InventoryDashboardQueryDto = z.infer<typeof inventoryDashboardQuerySchema>;

export interface PropertyInventoryStateResponseDto extends Omit<PropertyInventoryStateEntity, 'lead_id'> {}
export interface PropertyInventoryTransactionResponseDto extends Omit<PropertyInventoryTransactionEntity, 'deleted_at' | 'created_by'> {}

export interface BulkInventoryResponseDto {
  success: PropertyInventoryStateResponseDto[];
  failed: { id: string; error: string }[];
}
