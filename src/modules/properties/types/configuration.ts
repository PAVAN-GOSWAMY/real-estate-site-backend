import { z } from "zod";
import { ConstructionStatus, PropertyAvailability } from "./enums";

export interface PropertyConfiguration {
  id: string;
  propertyId: string;
  configurationType: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  balconies?: number | null;
  parkingSlots?: number | null;
  superBuiltUpArea?: number | null;
  carpetArea?: number | null;
  floorNumber?: number | null;
  totalFloors?: number | null;
  facing?: string | null;
  possessionDate?: string | null;
  constructionStatus?: ConstructionStatus | string | null;
  basePrice?: number | null;
  priceDisplay?: string | null;
  availability?: PropertyAvailability | string | null;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export const PropertyConfigurationSchema = z.object({
  id: z.string().uuid().optional(),
  propertyId: z.string().uuid().optional(),
  configurationType: z.string().min(1, "Configuration type is required"),
  bedrooms: z.number().int().min(0).optional().nullable(),
  bathrooms: z.number().int().min(0).optional().nullable(),
  balconies: z.number().int().min(0).optional().nullable(),
  parkingSlots: z.number().int().min(0).optional().nullable(),
  superBuiltUpArea: z.number().min(0).optional().nullable(),
  carpetArea: z.number().min(0).optional().nullable(),
  floorNumber: z.number().int().optional().nullable(),
  totalFloors: z.number().int().optional().nullable(),
  facing: z.string().optional().nullable(),
  possessionDate: z.string().optional().nullable(),
  constructionStatus: z.string().optional().nullable(),
  basePrice: z.number().min(0).optional().nullable(),
  priceDisplay: z.string().optional().nullable(),
  availability: z.string().default("AVAILABLE").optional().nullable(),
  displayOrder: z.number().int().default(0).optional(),
});

export type PropertyConfigurationInput = z.infer<typeof PropertyConfigurationSchema>;
