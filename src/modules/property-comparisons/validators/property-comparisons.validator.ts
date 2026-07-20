import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

export const createComparisonSessionSchema = z.object({
  user_id: z.string().uuid().optional().nullable(),
  title: z.string().max(255).optional().nullable(),
  initial_property_ids: z.array(z.string().uuid()).max(4, "Cannot compare more than 4 properties initially").optional(),
}).strict();

export const addPropertyToComparisonSchema = z.object({
  property_id: z.string().uuid(),
}).strict();

export const replaceComparisonPropertySchema = z.object({
  new_property_id: z.string().uuid(),
}).strict();

export const shareComparisonSchema = z.object({
  title: z.string().max(255).optional(),
}).strict();

export const comparisonHistoryQuerySchema = paginationSchema.extend({
  user_id: z.string().uuid().optional(),
}).strict();
