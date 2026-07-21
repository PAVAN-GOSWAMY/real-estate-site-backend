/**
 * Represents a complete builder record from the database.
 */
export interface Builder {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  establishedYear: number | null;
  headquarters: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents the payload required to create a builder.
 */
export interface CreateBuilderInput {
  name: string;
  slug: string;
  logoUrl?: string | null;
  description?: string | null;
  establishedYear?: number | null;
  headquarters?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  isFeatured?: boolean;
  isActive?: boolean;
}

/**
 * Represents the payload for updating a builder.
 */
export interface UpdateBuilderInput {
  name?: string;
  slug?: string;
  logoUrl?: string | null;
  description?: string | null;
  establishedYear?: number | null;
  headquarters?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  isFeatured?: boolean;
  isActive?: boolean;
}

/**
 * Represents lightweight data used in tables/lists.
 */
export interface BuilderListItem {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  isFeatured: boolean;
  isActive: boolean;
}

/**
 * Represents filters for searching and querying builders.
 */
export interface BuilderFilters {
  search?: string;
  featured?: boolean;
  active?: boolean;
  page?: number;
  limit?: number;
}
