import { z } from "zod";

export const propertyConfigurationSchema = z.enum([
  "1BHK", "2BHK", "3BHK", "4BHK", "5BHK", "PENTHOUSE", "VILLA", "PLOT", "STUDIO", "OTHER"
]);

export const propertyCategorySchema = z.enum([
  "APARTMENT", "INDEPENDENT_HOUSE", "VILLA", "PLOT", "COMMERCIAL_OFFICE", "COMMERCIAL_SHOP", "AGRICULTURAL_LAND", "OTHER"
]);

export const propertyInventoryStatusSchema = z.enum([
  "AVAILABLE", "ON_HOLD", "SOLD", "BLOCKED", "CANCELLED"
]);

export const propertyStatusSchema = z.enum([
  "PRE_LAUNCH", "UNDER_CONSTRUCTION", "READY_TO_MOVE", "NEW_LAUNCH", "RESALE"
]);

export const propertyAvailabilitySchema = z.enum([
  "IMMEDIATE", "WITHIN_1_MONTH", "WITHIN_3_MONTHS", "WITHIN_6_MONTHS", "AFTER_6_MONTHS"
]);
