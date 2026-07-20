import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

export const createProjectMediaSchema = z.object({
  project_id: z.string().uuid("Invalid project ID"),
  media_type: z.enum(['IMAGE', 'VIDEO', 'BROCHURE', 'FLOOR_PLAN', 'PDF', 'LOGO']),
  title: z.string().max(255).optional().nullable(),
  description: z.string().optional().nullable(),
  storage_bucket: z.string().max(100),
  storage_path: z.string().max(500),
  public_url: z.string().url().max(1000),
  thumbnail_url: z.string().url().max(1000).optional().nullable(),
  alt_text: z.string().max(255).optional().nullable(),
  caption: z.string().max(500).optional().nullable(),
  mime_type: z.string().max(100).optional().nullable(),
  file_size: z.number().int().min(0).optional().nullable(),
  width: z.number().int().min(0).optional().nullable(),
  height: z.number().int().min(0).optional().nullable(),
  duration_seconds: z.number().int().min(0).optional().nullable(),
  display_order: z.number().int().min(0).default(0),
  is_cover: z.boolean().default(false),
  is_featured: z.boolean().default(false),
}).strict();

export const updateProjectMediaSchema = createProjectMediaSchema.partial().strict();

// Bulk Schemas
export const bulkUploadProjectMediaSchema = z.object({
  project_id: z.string().uuid("Invalid project ID"),
  media: z.array(z.object({
    media_type: z.enum(['IMAGE', 'VIDEO', 'BROCHURE', 'FLOOR_PLAN', 'PDF', 'LOGO']),
    title: z.string().max(255).optional().nullable(),
    description: z.string().optional().nullable(),
    storage_bucket: z.string().max(100),
    storage_path: z.string().max(500),
    public_url: z.string().url().max(1000),
    thumbnail_url: z.string().url().max(1000).optional().nullable(),
    alt_text: z.string().max(255).optional().nullable(),
    caption: z.string().max(500).optional().nullable(),
    mime_type: z.string().max(100).optional().nullable(),
    file_size: z.number().int().min(0).optional().nullable(),
    width: z.number().int().min(0).optional().nullable(),
    height: z.number().int().min(0).optional().nullable(),
    duration_seconds: z.number().int().min(0).optional().nullable(),
    display_order: z.number().int().min(0).default(0),
    is_cover: z.boolean().default(false),
    is_featured: z.boolean().default(false),
  })).min(1).max(100),
}).strict();

export const bulkUpdateProjectMediaSchema = z.object({
  project_id: z.string().uuid("Invalid project ID"),
  updates: z.array(z.object({
    id: z.string().uuid("Invalid media ID"),
    title: z.string().max(255).optional().nullable(),
    description: z.string().optional().nullable(),
    alt_text: z.string().max(255).optional().nullable(),
    caption: z.string().max(500).optional().nullable(),
    display_order: z.number().int().min(0).optional(),
    is_cover: z.boolean().optional(),
    is_featured: z.boolean().optional(),
  })).min(1).max(100),
}).strict();

export const bulkDeleteProjectMediaSchema = z.object({
  project_id: z.string().uuid("Invalid project ID"),
  ids: z.array(z.string().uuid("Invalid media ID")).min(1).max(100),
}).strict();

export const reorderProjectMediaSchema = z.object({
  project_id: z.string().uuid("Invalid project ID"),
  items: z.array(z.object({
    id: z.string().uuid("Invalid media ID"),
    display_order: z.number().int().min(0)
  })).min(1).max(500)
}).strict();

export const projectMediaStatusSchema = z.object({
  is_cover: z.boolean().optional(),
  is_featured: z.boolean().optional(),
}).strict();

export const projectMediaFilterSchema = paginationSchema.extend({
  project_id: z.string().uuid().optional(),
  media_type: z.string().optional(),
  is_cover: z.coerce.boolean().optional(),
  is_featured: z.coerce.boolean().optional(),
}).strict();
