import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

export const createProjectTowerSchema = z.object({
  project_id: z.string().uuid("Invalid project ID"),
  tower_name: z.string().min(2, "Tower name must be at least 2 characters").max(150),
  tower_code: z.string().max(20, "Tower code cannot exceed 20 characters").regex(/^[a-zA-Z0-9_-]+$/, "Tower code must be alphanumeric").toUpperCase(),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens").max(150),
  short_description: z.string().max(500).optional().nullable(),
  construction_status: z.enum([
    'PRE_LAUNCH', 
    'UNDER_CONSTRUCTION', 
    'READY_TO_MOVE', 
    'SOLD_OUT', 
    'ARCHIVED'
  ]),
  launch_date: z.string().optional().nullable(),
  expected_completion_date: z.string().optional().nullable(),
  actual_completion_date: z.string().optional().nullable(),
  total_floors: z.number().int().min(0).optional().nullable(),
  total_units: z.number().int().min(0).optional().nullable(),
  tower_height: z.number().min(0).optional().nullable(),
  number_of_lifts: z.number().int().min(0).optional().nullable(),
  service_lifts: z.number().int().min(0).optional().nullable(),
  parking_levels: z.number().int().min(0).optional().nullable(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  display_order: z.number().int().min(0).default(0),
  seo_title: z.string().max(150).optional().nullable(),
  seo_description: z.string().max(255).optional().nullable(),
  seo_keywords: z.string().max(255).optional().nullable(),
  canonical_url: z.string().url().max(255).optional().nullable(),
}).strict();

export const updateProjectTowerSchema = createProjectTowerSchema.partial().strict();

export const projectTowerFilterSchema = paginationSchema.extend({
  project_id: z.string().uuid().optional(),
  construction_status: z.string().optional(),
  is_featured: z.coerce.boolean().optional(),
  is_active: z.coerce.boolean().optional(),
}).strict();
