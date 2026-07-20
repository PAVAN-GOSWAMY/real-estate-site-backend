import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

export const createPropertyConfigurationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens").max(100),
  short_description: z.string().max(500).optional().nullable(),
  detailed_description: z.string().optional().nullable(),
  bedrooms: z.number().min(0).max(20).optional().nullable(), // Allow decimals (e.g. 2.5)
  bathrooms: z.number().int().min(0).max(20).optional().nullable(),
  balconies: z.number().int().min(0).max(20).optional().nullable(),
  configuration_group: z.string().max(100).optional().nullable(),
  icon_name: z.string().max(50).optional().nullable(),
  theme_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Theme color must be a valid 6-character hex code").optional().nullable(),
  display_order: z.number().int().min(0).default(0),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  seo_title: z.string().max(100).optional().nullable(),
  seo_description: z.string().max(255).optional().nullable(),
  seo_keywords: z.string().max(255).optional().nullable(),
  canonical_url: z.string().url().max(255).optional().nullable(),
}).strict();

export const updatePropertyConfigurationSchema = createPropertyConfigurationSchema.partial().strict();

export const propertyConfigurationFilterSchema = paginationSchema.extend({
  is_featured: z.coerce.boolean().optional(),
  is_active: z.coerce.boolean().optional(),
  configuration_group: z.string().optional(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().int().optional(),
  balconies: z.coerce.number().int().optional(),
}).strict();
