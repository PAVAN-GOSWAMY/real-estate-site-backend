import { z } from "zod";
import { propertyConfigurationSchema, propertyCategorySchema, propertyInventoryStatusSchema } from "@/lib/validators/enums.validator";
import { propertyStatusSchema } from "@/lib/validators/enums.validator";

// In a real application, this matches the exact required fields for creating a property.
// We use a simplified version here representing what we expect from the CSV/JSON row.
export const importRowSchema = z.object({
  unit_code: z.string().min(1),
  listing_title: z.string().min(1),
  slug: z.string().min(1).optional(),
  
  // Relational mappings (usually resolved by names in CSV, but assuming IDs here for simplicity
  // or a sophisticated service would map "Builder Name" to `builder_id`)
  builder_id: z.string().uuid().optional(),
  project_id: z.string().uuid().optional(),
  location_id: z.string().uuid().optional(),
  
  configuration: propertyConfigurationSchema.optional(),
  category: propertyCategorySchema.optional(),
  status: propertyStatusSchema.optional(),
  
  carpet_area_sqft: z.number().positive(),
  
  // Pricing
  base_price: z.number().positive().optional(),
  
  // Inventory
  inventory_status: propertyInventoryStatusSchema.optional()
}).passthrough();

export const createImportJobSchema = z.object({
  file_name: z.string().min(1),
  rows: z.array(z.record(z.any())).min(1).max(10000, "Maximum 10,000 rows per import job")
}).strict();

export const exportFilterSchema = z.object({
  builder_id: z.string().uuid().optional(),
  project_id: z.string().uuid().optional(),
  location_id: z.string().uuid().optional(),
  is_active: z.boolean().optional(),
  status: propertyStatusSchema.optional(),
}).strict();

export const createExportJobSchema = z.object({
  filters: exportFilterSchema.optional()
}).strict();
