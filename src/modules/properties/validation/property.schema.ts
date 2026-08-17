import { z } from "zod";
import { PropertyStatus, PropertyAvailability, PropertyType, ConstructionStatus, PropertyCategory } from "../types/enums";

/**
 * Schema for creating a new Property.
 */
export const CreatePropertySchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title cannot exceed 150 characters")
    .trim(),
  
  slug: z
    .string()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly, containing only lowercase letters, numbers, and hyphens")
    .optional(),
  
  propertyCode: z
    .string()
    .min(3, "Property code must be at least 3 characters")
    .max(50, "Property code cannot exceed 50 characters")
    .trim(),
  
  builderId: z.string().uuid("Invalid builder ID"),
  
  propertyCategory: z.nativeEnum(PropertyCategory),
  propertyType: z.nativeEnum(PropertyType),
  
  status: z.nativeEnum(PropertyStatus).default(PropertyStatus.ACTIVE),
  availability: z.nativeEnum(PropertyAvailability).default(PropertyAvailability.AVAILABLE),
  
  address: z.string().max(255).optional().or(z.literal('')),
  landmark: z.string().max(100).optional().or(z.literal('')),
  city_id: z.string().uuid("Invalid city ID"),
  location_id: z.string().uuid("Invalid location ID"),
  country: z.string().max(100).default('India'),
  pincode: z.string().max(20).optional().or(z.literal('')),
  googleMapsUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  
  price: z.number().min(0, "Price cannot be negative").optional(),
  currency: z.string().max(10).default('INR'),
  pricePerSqft: z.number().min(0).optional(),
  
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  balconies: z.number().int().min(0).optional(),
  parking: z.number().int().min(0).optional(),
  
  superBuiltupArea: z.number().min(0).optional(),
  carpetArea: z.number().min(0).optional(),
  
  floorNumber: z.number().int().optional(),
  totalFloors: z.number().int().optional(),
  facing: z.string().max(50).optional().or(z.literal('')),
  
  possessionDate: z.string().datetime({ message: "Invalid possession date" }).optional().or(z.literal('')),
  constructionStatus: z.nativeEnum(ConstructionStatus).optional(),
  
  shortDescription: z.string().max(300).optional().or(z.literal('')),
  description: z.string().max(10000).optional().or(z.literal('')),
  
  isFeatured: z.boolean().default(false).optional(),
  isVerified: z.boolean().default(false).optional(),
  isPremium: z.boolean().default(false).optional(),
  
  metaTitle: z.string().max(100).optional().or(z.literal('')),
  metaDescription: z.string().max(255).optional().or(z.literal('')),
});

/**
 * Base schema representing a complete Property record from the database.
 */
export const PropertySchema = CreatePropertySchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().uuid().nullable(),
  updatedBy: z.string().uuid().nullable(),
});

/**
 * Schema for updating an existing Property.
 */
export const UpdatePropertySchema = CreatePropertySchema.partial();

/**
 * Schema for filtering, searching, and paginating Properties.
 */
export const PropertyFilterSchema = z.object({
  search: z.string().optional(),
  builderId: z.string().uuid().optional(),
  propertyCategory: z.nativeEnum(PropertyCategory).optional(),
  propertyType: z.nativeEnum(PropertyType).optional(),
  status: z.nativeEnum(PropertyStatus).optional(),
  availability: z.nativeEnum(PropertyAvailability).optional(),
  featured: z.boolean().optional(),
  verified: z.boolean().optional(),
  city: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  bedrooms: z.number().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type CreatePropertyInputSchema = z.infer<typeof CreatePropertySchema>;
export type UpdatePropertyInputSchema = z.infer<typeof UpdatePropertySchema>;
export type PropertyFilterInputSchema = z.infer<typeof PropertyFilterSchema>;
