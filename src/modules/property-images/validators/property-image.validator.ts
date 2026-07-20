import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

export const createPropertyImageSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  image_type: z.string().min(1).max(50),
  room_name: z.string().max(100).optional().nullable(),
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
  display_order: z.number().int().min(0).default(0),
  is_cover: z.boolean().default(false),
  is_featured: z.boolean().default(false),
}).strict();

export const updatePropertyImageSchema = createPropertyImageSchema.partial().strict();

// Bulk Schemas
export const bulkUploadPropertyImagesSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  images: z.array(z.object({
    image_type: z.string().min(1).max(50),
    room_name: z.string().max(100).optional().nullable(),
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
    display_order: z.number().int().min(0).default(0),
    is_cover: z.boolean().default(false),
    is_featured: z.boolean().default(false),
  })).min(1).max(100),
}).strict();

export const bulkUpdatePropertyImagesSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  updates: z.array(z.object({
    id: z.string().uuid("Invalid image ID"),
    title: z.string().max(255).optional().nullable(),
    description: z.string().optional().nullable(),
    alt_text: z.string().max(255).optional().nullable(),
    caption: z.string().max(500).optional().nullable(),
    room_name: z.string().max(100).optional().nullable(),
    display_order: z.number().int().min(0).optional(),
    is_cover: z.boolean().optional(),
    is_featured: z.boolean().optional(),
  })).min(1).max(100),
}).strict();

export const bulkDeletePropertyImagesSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  ids: z.array(z.string().uuid("Invalid image ID")).min(1).max(100),
}).strict();

export const reorderPropertyImagesSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  items: z.array(z.object({
    id: z.string().uuid("Invalid image ID"),
    display_order: z.number().int().min(0)
  })).min(1).max(500)
}).strict();

export const updateCoverImageSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  id: z.string().uuid("Invalid image ID"),
}).strict();

export const propertyImageFilterSchema = paginationSchema.extend({
  property_id: z.string().uuid().optional(),
  image_type: z.string().optional(),
  is_cover: z.coerce.boolean().optional(),
  is_featured: z.coerce.boolean().optional(),
}).strict();
