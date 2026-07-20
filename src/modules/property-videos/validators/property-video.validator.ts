import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

export const createPropertyVideoSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  video_name: z.string().min(1).max(255),
  title: z.string().min(1).max(255),
  video_code: z.string().min(1).max(100),
  video_type: z.string().min(1).max(100), // WALKTHROUGH, 360_TOUR, DRONE_TOUR, etc.
  video_provider: z.string().min(1).max(100), // SUPABASE, YOUTUBE, VIMEO, MATTERPORT
  provider_video_id: z.string().max(255).optional().nullable(),
  storage_bucket: z.string().max(100).optional().nullable(),
  storage_path: z.string().max(500).optional().nullable(),
  public_url: z.string().url().max(1000).optional().nullable(),
  thumbnail_url: z.string().url().max(1000).optional().nullable(),
  duration_seconds: z.number().int().min(0).optional().nullable(),
  resolution: z.string().max(50).optional().nullable(),
  frame_rate: z.string().max(50).optional().nullable(),
  bitrate: z.string().max(50).optional().nullable(),
  mime_type: z.string().max(100).optional().nullable(),
  file_size: z.number().int().min(0).optional().nullable(),
  language: z.string().max(50).optional().nullable(),
  has_subtitles: z.boolean().default(false),
  view_count: z.number().int().min(0).default(0),
  display_order: z.number().int().min(0).default(0),
  is_primary: z.boolean().default(false),
  is_downloadable: z.boolean().default(false),
}).strict().superRefine((data, ctx) => {
  if (data.video_provider === 'SUPABASE') {
    if (!data.storage_bucket || !data.storage_path) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "storage_bucket and storage_path are required when video_provider is SUPABASE",
      });
    }
  } else {
    if (!data.provider_video_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "provider_video_id is required when video_provider is not SUPABASE",
      });
    }
  }
});

// For updates we can't easily run the superRefine cross-field checks cleanly on partials
// without making assumptions, so we leave it as partial
export const updatePropertyVideoSchema = createPropertyVideoSchema.unwrap().partial().strict();

// Bulk Schemas
export const bulkUploadPropertyVideosSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  videos: z.array(createPropertyVideoSchema.unwrap().omit({ property_id: true })).min(1).max(50),
}).strict();

export const bulkUpdatePropertyVideosSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  updates: z.array(z.object({
    id: z.string().uuid("Invalid video ID"),
    video_name: z.string().max(255).optional().nullable(),
    title: z.string().max(255).optional().nullable(),
    video_code: z.string().max(100).optional().nullable(),
    video_type: z.string().max(100).optional().nullable(),
    display_order: z.number().int().min(0).optional(),
    is_primary: z.boolean().optional(),
    is_downloadable: z.boolean().optional(),
  })).min(1).max(50),
}).strict();

export const bulkDeletePropertyVideosSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  ids: z.array(z.string().uuid("Invalid video ID")).min(1).max(50),
}).strict();

export const reorderPropertyVideosSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  items: z.array(z.object({
    id: z.string().uuid("Invalid video ID"),
    display_order: z.number().int().min(0)
  })).min(1).max(100)
}).strict();

export const updatePrimaryVideoSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  id: z.string().uuid("Invalid video ID"),
}).strict();

export const propertyVideoFilterSchema = paginationSchema.extend({
  property_id: z.string().uuid().optional(),
  video_type: z.string().optional(),
  video_provider: z.string().optional(),
  is_primary: z.coerce.boolean().optional(),
  is_downloadable: z.coerce.boolean().optional(),
}).strict();
