import { 
  PropertyStatus, 
  PropertyAvailability, 
  PropertyType, 
  ConstructionStatus 
} from './enums';

/**
 * Represents a complete Property record from the database.
 */
export interface Property {
  id: string;
  title: string;
  slug: string;
  propertyCode: string;
  
  builderId: string;
  
  propertyType: PropertyType;
  status: PropertyStatus;
  availability: PropertyAvailability;
  
  address: string | null;
  landmark: string | null;
  city_id: string | null;
  location_id: string | null;
  locality: string | null;
  sector: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pincode: string | null;
  googleMapsUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  
  price: number | null;
  currency: string | null;
  pricePerSqft: number | null;
  
  bedrooms: number | null;
  bathrooms: number | null;
  balconies: number | null;
  parking: number | null;
  superBuiltupArea: number | null;
  carpetArea: number | null;
  floorNumber: number | null;
  totalFloors: number | null;
  facing: string | null;
  possessionDate: string | null; // ISO Date String
  constructionStatus: ConstructionStatus | null;
  
  shortDescription: string | null;
  description: string | null;
  
  isFeatured: boolean;
  isVerified: boolean;
  isPremium: boolean;
  reraNumber: string | null;
  
  metaTitle: string | null;
  metaDescription: string | null;
  
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

/**
 * Represents the payload required to create a property.
 */
export interface CreatePropertyInput {
  title: string;
  slug?: string;
  propertyCode: string;
  
  builderId: string;
  
  propertyType: PropertyType;
  status?: PropertyStatus;
  availability?: PropertyAvailability;
  
  address?: string | null;
  landmark?: string | null;
  city_id?: string | null;
  location_id?: string | null;
  locality?: string | null;
  sector?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;
  googleMapsUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  
  price?: number | null;
  currency?: string | null;
  pricePerSqft?: number | null;
  
  bedrooms?: number | null;
  bathrooms?: number | null;
  balconies?: number | null;
  parking?: number | null;
  superBuiltupArea?: number | null;
  carpetArea?: number | null;
  floorNumber?: number | null;
  totalFloors?: number | null;
  facing?: string | null;
  possessionDate?: string | null;
  constructionStatus?: ConstructionStatus | null;
  
  shortDescription?: string | null;
  description?: string | null;
  
  isFeatured?: boolean;
  isVerified?: boolean;
  isPremium?: boolean;
  reraNumber?: string | null;
  
  metaTitle?: string | null;
  metaDescription?: string | null;
}

/**
 * Represents the payload for updating a property.
 */
export type UpdatePropertyInput = Partial<CreatePropertyInput>;

/**
 * Represents lightweight data used in tables/lists.
 */
export interface PropertyListItem {
  id: string;
  title: string;
  slug: string;
  propertyCode: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  availability: PropertyAvailability;
  price: number | null;
  locality: string | null;
  city: string | null;
  isFeatured: boolean;
  isVerified: boolean;
}

/**
 * Represents filters for searching and querying properties.
 */
export interface PropertyFilters {
  search?: string;
  builderId?: string;
  propertyType?: PropertyType;
  status?: PropertyStatus;
  availability?: PropertyAvailability;
  featured?: boolean;
  verified?: boolean;
  premium?: boolean;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  page?: number;
  limit?: number;
}
