/**
 * Property Status Enum
 */
export enum PropertyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SOLD = 'SOLD',
  UPCOMING = 'UPCOMING',
}

/**
 * Property Availability Enum
 */
export enum PropertyAvailability {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD_OUT = 'SOLD_OUT',
}

/**
 * Property Category Enum
 */
export enum PropertyCategory {
  RESIDENTIAL = 'Residential',
  COMMERCIAL = 'Commercial',
  STUDIO_APARTMENT = 'Studio Apartment',
  OFFICE_SPACE = 'Office Space',
  RETAIL_SHOP = 'Retail Shop',
  VILLA = 'Villa',
  PLOT = 'Plot',
  PENTHOUSE = 'Penthouse',
  INDEPENDENT_FLOOR = 'Independent Floor',
  WAREHOUSE = 'Warehouse',
  AGRICULTURAL_LAND = 'Agricultural / Farm Land',
}

export const PROPERTY_CATEGORIES = Object.values(PropertyCategory);

/**
 * Property Type Enum
 */
export enum PropertyType {
  APARTMENT = 'Apartment',
  VILLA = 'Villa',
  PLOT = 'Plot',
  COMMERCIAL = 'Commercial',
  OFFICE = 'Office',
  RETAIL = 'Retail',
  WAREHOUSE = 'Warehouse',
  PENTHOUSE = 'Penthouse',
  STUDIO_APARTMENT = 'Studio Apartment',
}

export const PROPERTY_CONFIGURATIONS = [
  '1 RK / Studio',
  '1 BHK',
  '1.5 BHK',
  '2 BHK',
  '2.5 BHK',
  '3 BHK',
  '3.5 BHK',
  '4 BHK',
  '4.5 BHK',
  '5 BHK',
  '5+ BHK',
  'Duplex',
  'Penthouse',
] as const;

export type PropertyConfiguration = typeof PROPERTY_CONFIGURATIONS[number];

/**
 * Checks if a property type typically has BHK configurations
 */
export function isBhkApplicable(propertyType?: string | null): boolean {
  if (!propertyType) return false;
  const lower = propertyType.toLowerCase();
  return (
    lower.includes('apartment') ||
    lower.includes('villa') ||
    lower.includes('penthouse') ||
    lower.includes('residential')
  );
}

/**
 * Construction Status Enum
 */
export enum ConstructionStatus {
  READY_TO_MOVE = 'READY_TO_MOVE',
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
  NEW_LAUNCH = 'NEW_LAUNCH',
}
