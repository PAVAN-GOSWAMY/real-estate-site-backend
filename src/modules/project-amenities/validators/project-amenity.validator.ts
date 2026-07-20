import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

export const assignProjectAmenitySchema = z.object({
  project_id: z.string().uuid("Invalid project ID"),
  amenity_id: z.string().uuid("Invalid amenity ID"),
  display_order: z.number().int().min(0).default(0),
  is_highlighted: z.boolean().default(false),
  notes: z.string().max(500).optional().nullable(),
}).strict();

export const updateProjectAmenitySchema = z.object({
  display_order: z.number().int().min(0).optional(),
  is_highlighted: z.boolean().optional(),
  notes: z.string().max(500).optional().nullable(),
}).strict();

// Bulk Schemas
export const bulkAssignProjectAmenitiesSchema = z.object({
  project_id: z.string().uuid("Invalid project ID"),
  assignments: z.array(z.object({
    amenity_id: z.string().uuid("Invalid amenity ID"),
    display_order: z.number().int().min(0).default(0),
    is_highlighted: z.boolean().default(false),
    notes: z.string().max(500).optional().nullable(),
  })).min(1, "Must provide at least one amenity assignment").max(100, "Cannot assign more than 100 amenities at once"),
}).strict();

export const bulkUpdateProjectAmenitiesSchema = z.object({
  project_id: z.string().uuid("Invalid project ID"),
  updates: z.array(z.object({
    id: z.string().uuid("Invalid junction ID"),
    display_order: z.number().int().min(0).optional(),
    is_highlighted: z.boolean().optional(),
    notes: z.string().max(500).optional().nullable(),
  })).min(1, "Must provide at least one update").max(100, "Cannot update more than 100 records at once"),
}).strict();

export const bulkDeleteProjectAmenitiesSchema = z.object({
  project_id: z.string().uuid("Invalid project ID"),
  ids: z.array(z.string().uuid("Invalid junction ID")).min(1, "Must provide at least one ID").max(100, "Cannot delete more than 100 records at once"),
}).strict();

export const projectAmenityFilterSchema = paginationSchema.extend({
  project_id: z.string().uuid().optional(),
  amenity_id: z.string().uuid().optional(),
  is_highlighted: z.coerce.boolean().optional(),
}).strict();
