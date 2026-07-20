import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

export const createPropertyFloorPlanSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  plan_name: z.string().min(1).max(255),
  plan_code: z.string().min(1).max(100),
  description: z.string().optional().nullable(),
  storage_bucket: z.string().max(100),
  storage_path: z.string().max(500),
  public_url: z.string().url().max(1000),
  thumbnail_url: z.string().url().max(1000).optional().nullable(),
  file_format: z.enum(['PDF', 'PNG', 'JPEG', 'SVG', 'DWG', 'JPG', 'WEBP']), // Matches typical formats, allowing standard DB CHECK
  drawing_scale: z.string().max(50).optional().nullable(),
  orientation: z.string().max(50).optional().nullable(),
  carpet_area: z.number().positive().optional().nullable(),
  built_up_area: z.number().positive().optional().nullable(),
  super_built_up_area: z.number().positive().optional().nullable(),
  bedrooms: z.number().nonnegative().optional().nullable(),
  bathrooms: z.number().nonnegative().optional().nullable(),
  balconies: z.number().nonnegative().optional().nullable(),
  width: z.number().int().min(0).optional().nullable(),
  height: z.number().int().min(0).optional().nullable(),
  file_size: z.number().int().min(0).optional().nullable(),
  display_order: z.number().int().min(0).default(0),
  is_primary: z.boolean().default(false),
  is_downloadable: z.boolean().default(false),
}).strict();

export const updatePropertyFloorPlanSchema = createPropertyFloorPlanSchema.partial().strict();

// Bulk Schemas
export const bulkUploadPropertyFloorPlansSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  floor_plans: z.array(z.object({
    plan_name: z.string().min(1).max(255),
    plan_code: z.string().min(1).max(100),
    description: z.string().optional().nullable(),
    storage_bucket: z.string().max(100),
    storage_path: z.string().max(500),
    public_url: z.string().url().max(1000),
    thumbnail_url: z.string().url().max(1000).optional().nullable(),
    file_format: z.enum(['PDF', 'PNG', 'JPEG', 'SVG', 'DWG', 'JPG', 'WEBP']),
    drawing_scale: z.string().max(50).optional().nullable(),
    orientation: z.string().max(50).optional().nullable(),
    carpet_area: z.number().positive().optional().nullable(),
    built_up_area: z.number().positive().optional().nullable(),
    super_built_up_area: z.number().positive().optional().nullable(),
    bedrooms: z.number().nonnegative().optional().nullable(),
    bathrooms: z.number().nonnegative().optional().nullable(),
    balconies: z.number().nonnegative().optional().nullable(),
    width: z.number().int().min(0).optional().nullable(),
    height: z.number().int().min(0).optional().nullable(),
    file_size: z.number().int().min(0).optional().nullable(),
    display_order: z.number().int().min(0).default(0),
    is_primary: z.boolean().default(false),
    is_downloadable: z.boolean().default(false),
  })).min(1).max(50),
}).strict();

export const bulkUpdatePropertyFloorPlansSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  updates: z.array(z.object({
    id: z.string().uuid("Invalid floor plan ID"),
    plan_name: z.string().max(255).optional().nullable(),
    plan_code: z.string().max(100).optional().nullable(),
    description: z.string().optional().nullable(),
    drawing_scale: z.string().max(50).optional().nullable(),
    orientation: z.string().max(50).optional().nullable(),
    display_order: z.number().int().min(0).optional(),
    is_primary: z.boolean().optional(),
    is_downloadable: z.boolean().optional(),
  })).min(1).max(50),
}).strict();

export const bulkDeletePropertyFloorPlansSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  ids: z.array(z.string().uuid("Invalid floor plan ID")).min(1).max(50),
}).strict();

export const reorderPropertyFloorPlansSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  items: z.array(z.object({
    id: z.string().uuid("Invalid floor plan ID"),
    display_order: z.number().int().min(0)
  })).min(1).max(100)
}).strict();

export const updatePrimaryFloorPlanSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  id: z.string().uuid("Invalid floor plan ID"),
}).strict();

export const propertyFloorPlanFilterSchema = paginationSchema.extend({
  property_id: z.string().uuid().optional(),
  file_format: z.string().optional(),
  is_primary: z.coerce.boolean().optional(),
  is_downloadable: z.coerce.boolean().optional(),
}).strict();
