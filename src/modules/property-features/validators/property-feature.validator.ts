import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

export const assignPropertyFeatureSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  feature_id: z.string().uuid("Invalid feature ID"),
  display_order: z.number().int().min(0).default(0),
}).strict();

export const updatePropertyFeatureSchema = z.object({
  display_order: z.number().int().min(0).optional(),
}).strict();

// Bulk Schemas
export const bulkAssignPropertyFeaturesSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  assignments: z.array(z.object({
    feature_id: z.string().uuid("Invalid feature ID"),
    display_order: z.number().int().min(0).default(0),
  })).min(1, "Must provide at least one feature assignment").max(100, "Cannot assign more than 100 features at once"),
}).strict();

export const bulkUpdatePropertyFeaturesSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  updates: z.array(z.object({
    id: z.string().uuid("Invalid junction ID"),
    display_order: z.number().int().min(0).optional(),
  })).min(1, "Must provide at least one update").max(100, "Cannot update more than 100 records at once"),
}).strict();

export const bulkDeletePropertyFeaturesSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  ids: z.array(z.string().uuid("Invalid junction ID")).min(1, "Must provide at least one ID").max(100, "Cannot delete more than 100 records at once"),
}).strict();

export const propertyFeatureFilterSchema = paginationSchema.extend({
  property_id: z.string().uuid().optional(),
  feature_id: z.string().uuid().optional(),
}).strict();
