import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

export const createPropertyBrochureSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  brochure_name: z.string().min(1).max(255),
  brochure_code: z.string().min(1).max(100),
  brochure_type: z.string().min(1).max(100), // SALES_BROCHURE, PRICE_LIST, PAYMENT_PLAN, etc.
  version: z.string().max(50).optional().nullable(),
  language: z.string().length(2).default('en'),
  storage_bucket: z.string().max(100),
  storage_path: z.string().max(500),
  public_url: z.string().url().max(1000),
  thumbnail_url: z.string().url().max(1000).optional().nullable(),
  mime_type: z.string().max(100).optional().nullable(),
  file_size: z.number().int().min(0).optional().nullable(),
  page_count: z.number().int().min(0).optional().nullable(),
  download_count: z.number().int().min(0).default(0),
  display_order: z.number().int().min(0).default(0),
  is_latest_version: z.boolean().default(true),
  is_downloadable: z.boolean().default(false),
}).strict();

export const updatePropertyBrochureSchema = createPropertyBrochureSchema.partial().strict();

// Bulk Schemas
export const bulkUploadPropertyBrochuresSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  brochures: z.array(z.object({
    brochure_name: z.string().min(1).max(255),
    brochure_code: z.string().min(1).max(100),
    brochure_type: z.string().min(1).max(100),
    version: z.string().max(50).optional().nullable(),
    language: z.string().length(2).default('en'),
    storage_bucket: z.string().max(100),
    storage_path: z.string().max(500),
    public_url: z.string().url().max(1000),
    thumbnail_url: z.string().url().max(1000).optional().nullable(),
    mime_type: z.string().max(100).optional().nullable(),
    file_size: z.number().int().min(0).optional().nullable(),
    page_count: z.number().int().min(0).optional().nullable(),
    display_order: z.number().int().min(0).default(0),
    is_latest_version: z.boolean().default(true),
    is_downloadable: z.boolean().default(false),
  })).min(1).max(50),
}).strict();

export const bulkUpdatePropertyBrochuresSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  updates: z.array(z.object({
    id: z.string().uuid("Invalid brochure ID"),
    brochure_name: z.string().max(255).optional().nullable(),
    brochure_code: z.string().max(100).optional().nullable(),
    version: z.string().max(50).optional().nullable(),
    display_order: z.number().int().min(0).optional(),
    is_latest_version: z.boolean().optional(),
    is_downloadable: z.boolean().optional(),
  })).min(1).max(50),
}).strict();

export const bulkDeletePropertyBrochuresSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  ids: z.array(z.string().uuid("Invalid brochure ID")).min(1).max(50),
}).strict();

export const reorderPropertyBrochuresSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  items: z.array(z.object({
    id: z.string().uuid("Invalid brochure ID"),
    display_order: z.number().int().min(0)
  })).min(1).max(100)
}).strict();

export const updatePrimaryBrochureSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  id: z.string().uuid("Invalid brochure ID"),
}).strict();

export const propertyBrochureFilterSchema = paginationSchema.extend({
  property_id: z.string().uuid().optional(),
  brochure_type: z.string().optional(),
  language: z.string().length(2).optional(),
  is_latest_version: z.coerce.boolean().optional(),
  is_downloadable: z.coerce.boolean().optional(),
}).strict();
