import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

// Favorites
export const addFavoriteSchema = z.object({
  property_id: z.string().uuid(),
}).strict();

export const favoriteQuerySchema = paginationSchema.extend({
  user_id: z.string().uuid().optional(),
}).strict();

// Shortlists
export const createShortlistSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(2000).optional().nullable(),
  lead_id: z.string().uuid().optional().nullable(),
}).strict();

export const updateShortlistSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional().nullable(),
  is_archived: z.boolean().optional(),
}).strict();

export const shareShortlistSchema = z.object({
  expires_in_days: z.number().int().min(1).max(365).optional(),
}).strict();

export const shortlistQuerySchema = paginationSchema.extend({
  user_id: z.string().uuid().optional(),
  lead_id: z.string().uuid().optional(),
  is_archived: z.boolean().optional(),
}).strict();

// Shortlist Items
export const prioritySchema = z.enum(['HIGH', 'NORMAL', 'LOW']);

export const addShortlistItemSchema = z.object({
  property_id: z.string().uuid(),
  notes: z.string().max(5000).optional().nullable(),
  priority: prioritySchema.optional().default('NORMAL'),
}).strict();

export const updateShortlistItemSchema = z.object({
  notes: z.string().max(5000).optional().nullable(),
  priority: prioritySchema.optional(),
}).strict();
