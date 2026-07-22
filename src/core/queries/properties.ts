export interface PropertySearchParams {
  q?: string;
  location?: string;
  builder?: string;
  type?: string;
  budget?: string;
  config?: string;
  status?: string;
  possession?: string;
  sort?: string;
  page?: string;
  isFeatured?: boolean | string;
  isPremium?: boolean | string;
  limit?: number;
}

// Redirect all legacy queries to the new Public Property Service
export { getPublicProperties as getFilteredProperties } from "@/modules/public/services/public-property.service";
