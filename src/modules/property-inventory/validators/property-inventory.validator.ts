import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

export const inventoryStatusSchema = z.enum(['AVAILABLE', 'RESERVED', 'BLOCKED', 'BOOKED', 'AGREEMENT_PENDING', 'SOLD', 'MAINTENANCE_HOLD', 'LEGAL_HOLD']);
export const inventoryTransactionTypeSchema = z.enum(['RESERVE', 'BLOCK', 'BOOK', 'AGREEMENT', 'SELL', 'CANCEL', 'RELEASE', 'HOLD']);

// Used for optimistic locking
const versionField = {
  version: z.number().int().min(1, "Version is required for concurrency control"),
};

export const updateInventoryStatusSchema = z.object({
  ...versionField,
  status: inventoryStatusSchema,
  lead_id: z.string().uuid().optional().nullable(),
  reserved_until: z.string().datetime().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
}).strict();

export const reserveInventorySchema = z.object({
  ...versionField,
  lead_id: z.string().uuid("lead_id is required for reservation"),
  reserved_until: z.string().datetime().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
}).strict();

export const bookInventorySchema = z.object({
  ...versionField,
  lead_id: z.string().uuid("lead_id is required for booking"),
  notes: z.string().max(1000).optional().nullable(),
}).strict();

export const releaseInventorySchema = z.object({
  ...versionField,
  notes: z.string().max(1000).optional().nullable(),
}).strict();

export const cancelInventorySchema = z.object({
  ...versionField,
  notes: z.string().max(1000).optional().nullable(),
}).strict();

export const soldInventorySchema = z.object({
  ...versionField,
  lead_id: z.string().uuid("lead_id is required for sale"),
  notes: z.string().max(1000).optional().nullable(),
}).strict();

export const blockInventorySchema = z.object({
  ...versionField,
  notes: z.string().max(1000).optional().nullable(),
  reserved_until: z.string().datetime().optional().nullable(),
}).strict();

// Bulk Schemas
export const bulkUpdateInventoryStatusSchema = z.object({
  updates: z.array(updateInventoryStatusSchema.extend({
    property_id: z.string().uuid()
  })).min(1).max(50),
}).strict();

export const bulkReleaseInventorySchema = z.object({
  property_ids: z.array(z.string().uuid()).min(1).max(50),
  notes: z.string().max(1000).optional().nullable(),
}).strict();

// Query Filters
export const inventoryHistoryQuerySchema = paginationSchema.extend({
  transaction_type: inventoryTransactionTypeSchema.optional(),
}).strict();

export const inventoryDashboardQuerySchema = paginationSchema.extend({
  status: inventoryStatusSchema.optional(),
}).strict();
