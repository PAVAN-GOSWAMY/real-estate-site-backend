import { z } from "zod";
import { uuidSchema, paginationSchema } from "@/lib/validators/common.validator";

export const createLocationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens").max(100),
  short_description: z.string().max(500).optional().nullable(),
  detailed_description: z.string().optional().nullable(),
  parent_location_id: uuidSchema.optional().nullable(),
  display_order: z.number().int().min(0).default(0),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  seo_title: z.string().max(100).optional().nullable(),
  seo_description: z.string().max(255).optional().nullable(),
  seo_keywords: z.string().max(255).optional().nullable(),
  canonical_url: z.string().url().max(255).optional().nullable(),
}).strict();

export const updateLocationSchema = createLocationSchema.partial().strict();

export const locationFilterSchema = paginationSchema.extend({
  parent_location_id: z.union([uuidSchema, z.literal('null')]).optional(),
  is_featured: z.coerce.boolean().optional(),
  is_active: z.coerce.boolean().optional(),
}).strict();
