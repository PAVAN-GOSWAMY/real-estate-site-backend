export type MatchMode = "all" | "any";

export interface PropertyFilterOptions {
  // Search
  q?: string;
  
  // Location
  city?: string;
  cityId?: string;
  sector?: string;
  locationId?: string;
  location?: string; // legacy fallback
  
  // Builder
  builder?: string;
  
  // Configuration
  bedrooms?: number | string;
  propertyType?: string;
  
  // Amenities
  amenities?: string[];
  amenityMatchMode?: MatchMode;
  
  // Budget
  minPrice?: number;
  maxPrice?: number;
  budget?: string; // legacy predefined range
  
  // Status
  status?: string;
  possessionStatus?: string;
  
  // Flags
  isFeatured?: boolean;
  isPremium?: boolean;
  
  // Sorting & Pagination
  sort?: string;
  page?: number;
  limit?: number;
}
