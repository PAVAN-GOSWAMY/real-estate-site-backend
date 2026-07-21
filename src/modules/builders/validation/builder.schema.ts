import { z } from "zod";

/**
 * Schema for creating a new Builder.
 * Validates the input payload before inserting into the database.
 */
export const CreateBuilderSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name cannot exceed 120 characters")
    .trim(),
  
  slug: z
    .string()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly, containing only lowercase letters, numbers, and hyphens"),
  
  description: z
    .string()
    .max(5000, "Description cannot exceed 5000 characters")
    .optional(),
  
  logoUrl: z
    .string()
    .optional(), // Can be a full URL or a storage path string
  
  establishedYear: z
    .number()
    .int("Year must be a whole number")
    .min(1800, "Year must be 1800 or later")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .optional(),
  
  headquarters: z
    .string()
    .max(150, "Headquarters cannot exceed 150 characters")
    .optional(),
  
  website: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal('')), // Often forms submit empty strings for optional URLs
  
  email: z
    .string()
    .email("Must be a valid email address")
    .optional()
    .or(z.literal('')),
  
  phone: z
    .string()
    .min(8, "Phone must be at least 8 characters")
    .max(20, "Phone cannot exceed 20 characters")
    .optional(),
  
  isFeatured: z
    .boolean()
    .default(false),
  
  isActive: z
    .boolean()
    .default(true),
});

/**
 * Base schema representing a complete Builder record from the database.
 * Extends the create schema with auto-generated database fields.
 */
export const BuilderSchema = CreateBuilderSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * Schema for updating an existing Builder.
 * Derives from CreateBuilderSchema but makes all fields optional to allow partial updates.
 */
export const UpdateBuilderSchema = CreateBuilderSchema.partial();

/**
 * Schema for filtering, searching, and paginating Builders.
 */
export const BuilderFilterSchema = z.object({
  search: z.string().optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

/**
 * Inferred TypeScript types based on the Zod schemas.
 * These can be used across the application for strict typing of form inputs and API payloads.
 */
export type CreateBuilderInput = z.infer<typeof CreateBuilderSchema>;
export type UpdateBuilderInput = z.infer<typeof UpdateBuilderSchema>;
export type BuilderFilterInput = z.infer<typeof BuilderFilterSchema>;
