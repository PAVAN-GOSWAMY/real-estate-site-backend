import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

const basePropertySchema = {
  tower_id: z.string().uuid("Invalid tower ID"),
  configuration_id: z.string().uuid("Invalid configuration ID"),
  unit_number: z.string().min(1).max(50),
  unit_code: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  floor_number: z.number().int().optional().nullable(),
  property_status: z.enum(['UNDER_CONSTRUCTION', 'READY_TO_MOVE', 'UPCOMING']),
  availability_status: z.enum(['AVAILABLE', 'SOLD', 'ON_HOLD', 'RESERVED']),
  listing_title: z.string().min(1).max(255),
  short_description: z.string().optional().nullable(),
  detailed_description: z.string().optional().nullable(),
  carpet_area: z.number().positive().optional().nullable(),
  built_up_area: z.number().positive().optional().nullable(),
  super_built_up_area: z.number().positive().optional().nullable(),
  area_unit: z.string().default('SQ_FT'),
  price: z.number().positive().optional().nullable(),
  maintenance_charge: z.number().nonnegative().optional().nullable(),
  booking_amount: z.number().nonnegative().optional().nullable(),
  bedrooms: z.number().nonnegative().optional().nullable(),
  bathrooms: z.number().nonnegative().optional().nullable(),
  balconies: z.number().nonnegative().optional().nullable(),
  facing: z.string().max(50).optional().nullable(),
  furnishing_status: z.string().max(50).optional().nullable(),
  ownership_type: z.string().max(50).optional().nullable(),
  parking_slots: z.number().int().nonnegative().default(0),
  is_corner_unit: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  is_verified: z.boolean().default(false),
  is_active: z.boolean().default(true),
  seo_title: z.string().max(255).optional().nullable(),
  seo_description: z.string().optional().nullable(),
  seo_keywords: z.string().optional().nullable(),
  canonical_url: z.string().url().optional().nullable(),
  display_order: z.number().int().nonnegative().default(0),
};

export const createPropertySchema = z.object(basePropertySchema).strict();
export const updatePropertySchema = createPropertySchema.partial().strict();

export const updatePropertyStatusSchema = z.object({
  property_status: z.enum(['UNDER_CONSTRUCTION', 'READY_TO_MOVE', 'UPCOMING']).optional(),
  is_featured: z.boolean().optional(),
  is_verified: z.boolean().optional(),
  is_active: z.boolean().optional(),
}).strict();

export const updatePropertyAvailabilitySchema = z.object({
  availability_status: z.enum(['AVAILABLE', 'SOLD', 'ON_HOLD', 'RESERVED']),
}).strict();

export const updatePropertyPricingSchema = z.object({
  price: z.number().positive().optional().nullable(),
  maintenance_charge: z.number().nonnegative().optional().nullable(),
  booking_amount: z.number().nonnegative().optional().nullable(),
}).strict();

export const bulkCreatePropertySchema = z.object({
  properties: z.array(createPropertySchema).min(1).max(500),
}).strict();

export const bulkUpdatePropertySchema = z.object({
  updates: z.array(updatePropertySchema.extend({
    id: z.string().uuid("Invalid property ID")
  })).min(1).max(500),
}).strict();

export const bulkDeletePropertySchema = z.object({
  ids: z.array(z.string().uuid("Invalid property ID")).min(1).max(500),
}).strict();

export const propertyFilterSchema = paginationSchema.extend({
  tower_id: z.string().uuid().optional(),
  configuration_id: z.string().uuid().optional(),
  property_status: z.string().optional(),
  availability_status: z.string().optional(),
  is_featured: z.coerce.boolean().optional(),
  is_verified: z.coerce.boolean().optional(),
  is_active: z.coerce.boolean().optional(),
  min_price: z.coerce.number().positive().optional(),
  max_price: z.coerce.number().positive().optional(),
  min_area: z.coerce.number().positive().optional(),
  max_area: z.coerce.number().positive().optional(),
  bedrooms: z.coerce.number().nonnegative().optional(),
}).strict();
