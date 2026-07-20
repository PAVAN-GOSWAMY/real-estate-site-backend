import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

export const propertyPublicationStatusSchema = z.enum([
  'DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED', 'ARCHIVED', 'UNPUBLISHED', 'SCHEDULED', 'EXPIRED'
]);

export const changePublicationStatusSchema = z.object({
  notes: z.string().max(1000).optional().nullable(),
}).strict();

export const schedulePublicationSchema = z.object({
  scheduled_at: z.string().datetime().optional().nullable(),
  expires_at: z.string().datetime().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
}).strict().superRefine((data, ctx) => {
  if (!data.scheduled_at && !data.expires_at) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "At least scheduled_at or expires_at must be provided",
    });
  }
});

// Bulk Schemas
export const bulkChangePublicationStatusSchema = z.object({
  property_ids: z.array(z.string().uuid("Invalid property ID")).min(1).max(100),
  notes: z.string().max(1000).optional().nullable(),
}).strict();

// Query Filters
export const publicationHistoryFilterSchema = paginationSchema.extend({
  property_id: z.string().uuid(),
}).strict();

export const publicationStatusQuerySchema = paginationSchema.extend({
  status: propertyPublicationStatusSchema.optional(),
}).strict();
