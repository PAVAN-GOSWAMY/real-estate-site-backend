import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

export const createBuilderSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens").max(100),
  short_description: z.string().max(500).optional().nullable(),
  detailed_description: z.string().optional().nullable(),
  logo_url: z.string().url().max(255).optional().nullable(),
  website: z.string().url().max(255).optional().nullable(),
  email: z.string().email().max(100).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  rera_number: z.string().max(50).optional().nullable(),
  founded_year: z.number().int().min(1800).max(new Date().getFullYear()).optional().nullable(),
  experience_years: z.number().int().min(0).optional().nullable(),
  projects_delivered: z.number().int().min(0).optional().nullable(),
  projects_ongoing: z.number().int().min(0).optional().nullable(),
  awards_count: z.number().int().min(0).optional().nullable(),
  google_map_link: z.string().url().max(500).optional().nullable(),
  display_order: z.number().int().min(0).default(0),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  seo_title: z.string().max(100).optional().nullable(),
  seo_description: z.string().max(255).optional().nullable(),
  seo_keywords: z.string().max(255).optional().nullable(),
  canonical_url: z.string().url().max(255).optional().nullable(),
}).strict();

export const updateBuilderSchema = createBuilderSchema.partial().strict();

export const builderFilterSchema = paginationSchema.extend({
  is_featured: z.coerce.boolean().optional(),
  is_active: z.coerce.boolean().optional(),
  founded_year: z.coerce.number().int().optional(),
}).strict();
