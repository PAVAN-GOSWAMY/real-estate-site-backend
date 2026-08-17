import { PropertyFilterOptions } from "@/modules/public/types/search";
import { getPublicProperties } from "@/modules/public/services/public-property.service";

export interface PropertySearchParams {
  q?: string;
  location?: string;
  city?: string;
  sector?: string;
  builder?: string;
  category?: string;
  type?: string;
  budget?: string;
  minPrice?: string;
  maxPrice?: string;
  config?: string;
  bedrooms?: string;
  status?: string;
  possession?: string;
  amenities?: string; // comma separated
  matchMode?: "all" | "any";
  sort?: string;
  page?: string;
  isFeatured?: boolean | string;
  isPremium?: boolean | string;
  isVerified?: boolean | string;
  limit?: number;
}

// Transform URL string params to strict PropertyFilterOptions
function transformParams(params: PropertySearchParams): PropertyFilterOptions {
  return {
    q: params.q,
    location: params.location,
    city: params.city,
    sector: params.sector,
    builder: params.builder,
    propertyCategory: params.category,
    propertyType: params.type,
    budget: params.budget,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    bedrooms: params.bedrooms || params.config,
    status: params.status,
    possessionStatus: params.possession,
    amenities: params.amenities ? params.amenities.split(',') : undefined,
    amenityMatchMode: params.matchMode,
    isFeatured: params.isFeatured === 'true' || params.isFeatured === true,
    isPremium: params.isPremium === 'true' || params.isPremium === true,
    isVerified: params.isVerified === 'true' || params.isVerified === true,
    sort: params.sort,
    page: params.page ? parseInt(params.page, 10) : 1,
    limit: params.limit,
  };
}

export async function getFilteredProperties(params: PropertySearchParams) {
  const filterOptions = transformParams(params);
  return getPublicProperties(filterOptions);
}

