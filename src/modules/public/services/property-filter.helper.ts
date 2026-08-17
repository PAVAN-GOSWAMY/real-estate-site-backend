import { SupabaseClient } from '@supabase/supabase-js';
import { PropertyFilterOptions } from '../types/search';

// Reusable select fragments
export const BASE_PROPERTY_SELECT = `id, title, slug, price, locality, city, sector, city_id, location_id, property_category, property_type, status, bedrooms, bathrooms, carpet_area, possession_date, rera_number, is_featured, is_verified, is_premium, short_description, created_at, updated_at, cities (id, name, slug), locations (id, name, slug, type)`;
export const BUILDER_SELECT = `builders!inner (name, logo_url)`;
export const MEDIA_SELECT = `property_media (url, is_featured, display_order)`;
export const FLOOR_PLAN_SELECT = `property_floor_plans!inner (bedrooms, bathrooms, area, price)`;
export const AMENITIES_SELECT = `property_amenities!inner (amenity_id)`;

/**
 * Builds the dynamic select string based on required joins
 */
export function buildPropertySelect(filters: PropertyFilterOptions): string {
  const selectParts = [
    BASE_PROPERTY_SELECT,
    BUILDER_SELECT,
    MEDIA_SELECT
  ];

  if (filters.bedrooms !== undefined) {
    selectParts.push(FLOOR_PLAN_SELECT);
  }

  if (filters.amenities && filters.amenities.length > 0) {
    selectParts.push(AMENITIES_SELECT);
  }

  return selectParts.join(', ');
}

/**
 * Centralized filtering logic. Applies all search criteria to the Supabase query.
 */
export function applyPropertyFilters(query: any, filters: PropertyFilterOptions): any {
  // 1. Search Query
  if (filters.q) {
    const sq = filters.q.replace(/-/g, ' ');
    const lowerSq = sq.toLowerCase();

    // Map keywords to specific property categories
    let mappedCategory = '';
    if (lowerSq.includes('residential')) mappedCategory = 'Residential';
    else if (lowerSq.includes('commercial')) mappedCategory = 'Commercial';
    else if (lowerSq.includes('studio')) mappedCategory = 'Studio Apartment';

    if (mappedCategory) {
      query = query.or(`title.ilike.%${sq}%,locality.ilike.%${sq}%,city.ilike.%${sq}%,property_category.eq.${mappedCategory}`);
    } else {
      let mappedType = '';
      if (lowerSq.includes('apartment')) mappedType = 'Apartment';
      else if (lowerSq.includes('villa')) mappedType = 'Villa';
      else if (lowerSq.includes('plot')) mappedType = 'Plot';
      else if (lowerSq.includes('penthouse')) mappedType = 'Penthouse';
      else if (lowerSq.includes('independent')) mappedType = 'Independent House';
      else if (lowerSq.includes('retail')) mappedType = 'Retail Shop';
      else if (lowerSq.includes('office')) mappedType = 'Office Space';

      if (mappedType) {
        query = query.or(`title.ilike.%${sq}%,locality.ilike.%${sq}%,city.ilike.%${sq}%,property_type.eq.${mappedType}`);
      } else {
        query = query.or(`title.ilike.%${sq}%,locality.ilike.%${sq}%,city.ilike.%${sq}%`);
      }
    }
  }

  // 2. Location (City, Sector, or legacy location string)
  if (filters.cityId) {
    query = query.eq('city_id', filters.cityId);
  } else if (filters.city && filters.city !== 'all') {
    query = query.ilike('city', `%${filters.city.replace(/-/g, ' ')}%`);
  }

  if (filters.locationId) {
    query = query.eq('location_id', filters.locationId);
  } else if (filters.sector && filters.sector !== 'all') {
    query = query.ilike('sector', `%${filters.sector.replace(/-/g, ' ')}%`);
  }

  if (filters.location && filters.location !== 'all' && !filters.city && !filters.sector && !filters.cityId && !filters.locationId) {
    const loc = filters.location.replace(/-/g, ' ');
    query = query.or(`locality.ilike.%${loc}%,city.ilike.%${loc}%`);
  }

  // 3. Builder
  if (filters.builder && filters.builder !== 'all') {
    const builderSlug = filters.builder.replace(/-/g, ' ');
    query = query.ilike('builders.name', `%${builderSlug}%`);
  }

  // 4. Property Type and Category
  if (filters.propertyCategory && filters.propertyCategory !== 'all') {
    const pc = filters.propertyCategory.replace(/-/g, ' ');
    query = query.eq('property_category', pc);
  }

  if (filters.propertyType && filters.propertyType !== 'all') {
    const pt = filters.propertyType.replace(/-/g, ' ');
    // Use .eq instead of .ilike since property_type is an Enum
    query = query.eq('property_type', pt);
  }

  // 5. Status & Possession
  if (filters.status && filters.status !== 'all') {
    const s = filters.status.replace(/-/g, ' ');
    query = query.ilike('status', `%${s}%`);
  }
  if (filters.possessionStatus && filters.possessionStatus !== 'all') {
    query = query.eq('construction_status', filters.possessionStatus);
  }

  // 6. Bedrooms / BHK (Uses structured data via floor plans)
  if (filters.bedrooms && filters.bedrooms !== 'all') {
    const beds = parseInt(String(filters.bedrooms));
    if (!isNaN(beds)) {
      query = query.eq('property_floor_plans.bedrooms', beds);
    }
  }

  // 7. Budget / Price Range
  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters.budget && filters.budget !== 'all' && filters.minPrice === undefined) {
    const b = filters.budget;
    if (b === "under-3") query = query.lt('price', 30000000);
    if (b === "3-5") query = query.gte('price', 30000000).lt('price', 50000000);
    if (b === "5-10") query = query.gte('price', 50000000).lte('price', 100000000);
    if (b === "above-10") query = query.gt('price', 100000000);
  }

  // 8. Amenities (OR matching by default via PostgREST .in)
  // To support 'ALL' matching (AND) perfectly in PostgREST without RPC, you'd need multiple joins, 
  // which is unsupported easily. For now, architecture supports ANY, and we lay groundwork for ALL.
  if (filters.amenities && filters.amenities.length > 0) {
    // If matchMode === "all", ideally we'd use an RPC or array contains if we had an array column.
    // For now, we apply standard IN which does an OR match.
    query = query.in('property_amenities.amenity_id', filters.amenities);
  }

  // 9. Flags
  if (filters.isFeatured) {
    query = query.eq('is_featured', true);
  }
  if (filters.isPremium) {
    query = query.eq('is_premium', true);
  }
  if (filters.isVerified) {
    query = query.eq('is_verified', true);
  }

  return query;
}

/**
 * Applies sorting configuration to the query
 */
export function applyPropertySort(query: any, sort?: string): any {
  switch (sort) {
    case "price-asc":
      return query.order('price', { ascending: true, nullsFirst: false });
    case "price-desc":
      return query.order('price', { ascending: false, nullsFirst: false });
    case "newest":
      return query.order('created_at', { ascending: false });
    case "oldest":
      return query.order('created_at', { ascending: true });
    case "recently-updated":
      return query.order('updated_at', { ascending: false });
    case "alphabetical":
      return query.order('title', { ascending: true });
    case "possession":
      return query.order('possession_date', { ascending: true, nullsFirst: false });
    case "featured":
      return query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
    case "premium":
      return query.order('is_premium', { ascending: false }).order('created_at', { ascending: false });
    case "recommended":
    default:
      return query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
  }
}
