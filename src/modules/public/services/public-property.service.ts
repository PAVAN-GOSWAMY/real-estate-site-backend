import { createPublicClient } from '@/lib/supabase/public';
import { PublicProperty, PublicAmenityGroup } from '../types/property';
import { PublicFeaturedBuilder } from '../types/builder';
import { PropertyFilterOptions } from '../types/search';
import {
  buildPropertySelect,
  applyPropertyFilters,
  applyPropertySort
} from './property-filter.helper';
import { PropertyFloorPlan, PropertyDocument } from '../../properties/types/assets';
import { PropertyConfiguration } from '../../properties/types/configuration';

function mapToPublicProperty(row: any): PublicProperty {
  const builderName = row.builders?.name || 'Unknown Builder';
  const rawLogo = row.builders?.logo_url;
  const builderLogo = rawLogo && rawLogo.trim() !== "" ? rawLogo.trim() : null;
  const builderProfile = row.builders ? {
    name: row.builders.name,
    slug: row.builders.slug,
    logoUrl: builderLogo,
    description: row.builders.description,
    establishedYear: row.builders.established_year,
  } : undefined;

  const mediaList = row.property_media || [];
  mediaList.sort((a: any, b: any) => a.display_order - b.display_order);

  const featuredMedia = mediaList.find((m: any) => m.is_featured);
  const thumbnail = featuredMedia ? featuredMedia.url : (mediaList[0]?.url || null);
  const images = mediaList.map((m: any) => m.url);

  // Group Amenities
  const groupedAmenitiesMap = new Map<string, { name: string; iconKey: string }[]>();
  const rawAmenities = row.property_amenities?.map((pa: any) => pa.amenities) || [];

  rawAmenities.forEach((amenity: any) => {
    if (!amenity) return;
    const category = amenity.category || 'General';
    if (!groupedAmenitiesMap.has(category)) {
      groupedAmenitiesMap.set(category, []);
    }
    groupedAmenitiesMap.get(category)!.push({
      name: amenity.name,
      iconKey: amenity.icon,
    });
  });

  const amenityGroups: PublicAmenityGroup[] = Array.from(groupedAmenitiesMap.entries()).map(([category, items]) => ({
    category,
    items,
  }));

  // Floor Plans
  const floorPlans: PropertyFloorPlan[] = (row.property_floor_plans || []).map((fp: any) => ({
    id: fp.id,
    propertyId: fp.property_id,
    name: fp.name,
    floorNumber: fp.floor_number,
    configuration: fp.configuration,
    area: fp.area,
    unit: fp.unit,
    imageUrl: fp.image_url,
    description: fp.description,
    displayOrder: fp.display_order,
    createdAt: fp.created_at,
    updatedAt: fp.updated_at,
  })).sort((a: any, b: any) => a.displayOrder - b.displayOrder);

  // Documents
  const documents: PropertyDocument[] = (row.property_documents || []).map((doc: any) => ({
    id: doc.id,
    propertyId: doc.property_id,
    name: doc.name,
    documentType: doc.document_type,
    fileUrl: doc.file_url,
    fileSize: Number(doc.file_size),
    version: doc.version,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
  })).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Configurations
  let propertyConfigurations: PropertyConfiguration[] = (row.property_configurations || []).map((pc: any) => ({
    id: pc.id,
    propertyId: pc.property_id,
    configurationType: pc.configuration_type,
    bedrooms: pc.bedrooms !== null && pc.bedrooms !== undefined ? Number(pc.bedrooms) : null,
    bathrooms: pc.bathrooms !== null && pc.bathrooms !== undefined ? Number(pc.bathrooms) : null,
    balconies: pc.balconies !== null && pc.balconies !== undefined ? Number(pc.balconies) : null,
    parkingSlots: pc.parking_slots !== null && pc.parking_slots !== undefined ? Number(pc.parking_slots) : null,
    superBuiltUpArea: pc.super_built_up_area !== null && pc.super_built_up_area !== undefined ? Number(pc.super_built_up_area) : null,
    carpetArea: pc.carpet_area !== null && pc.carpet_area !== undefined ? Number(pc.carpet_area) : null,
    floorNumber: pc.floor_number !== null && pc.floor_number !== undefined ? Number(pc.floor_number) : null,
    totalFloors: pc.total_floors !== null && pc.total_floors !== undefined ? Number(pc.total_floors) : null,
    facing: pc.facing || null,
    possessionDate: pc.possession_date || null,
    constructionStatus: pc.construction_status || null,
    basePrice: pc.base_price !== null && pc.base_price !== undefined ? Number(pc.base_price) : null,
    priceDisplay: pc.price_display || null,
    availability: pc.availability || 'AVAILABLE',
    displayOrder: pc.display_order ?? 0,
    createdAt: pc.created_at,
    updatedAt: pc.updated_at,
  })).sort((a: any, b: any) => a.displayOrder - b.displayOrder);

  // Formatting price display from minimum basePrice across configurations if present
  const configPrices = propertyConfigurations
    .map(pc => Number(pc.basePrice))
    .filter(p => !isNaN(p) && p > 0);
  const minPrice = configPrices.length > 0 ? Math.min(...configPrices) : (row.price ? Number(row.price) : null);
  const maxPrice = configPrices.length > 0 ? Math.max(...configPrices) : minPrice;

  let priceDisplay = null;
  if (minPrice) {
    if (minPrice >= 10000000) {
      const cr = minPrice / 10000000;
      priceDisplay = `\u20B9 ${cr.toFixed(2).replace(/\.00$/, '')} Cr Onwards`;
    } else if (minPrice >= 100000) {
      const lakhs = minPrice / 100000;
      priceDisplay = `\u20B9 ${lakhs.toFixed(2).replace(/\.00$/, '')} Lakhs Onwards`;
    } else {
      priceDisplay = `\u20B9 ${minPrice.toLocaleString('en-IN')} Onwards`;
    }
  }

  // Fallback: If no child configurations found, synthesize from parent configurations array or bedrooms
  if (propertyConfigurations.length === 0) {
    const fallbackTypes = Array.isArray(row.configurations) && row.configurations.length > 0
      ? row.configurations
      : (row.bedrooms ? [`${row.bedrooms} BHK`] : []);

    if (fallbackTypes.length > 0) {
      propertyConfigurations = fallbackTypes.map((type: string, idx: number) => ({
        id: `synth-${idx}`,
        propertyId: row.id,
        configurationType: type,
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
        balconies: row.balconies,
        parkingSlots: row.parking,
        superBuiltUpArea: row.super_builtup_area ? Number(row.super_builtup_area) : null,
        carpetArea: row.carpet_area ? Number(row.carpet_area) : null,
        floorNumber: row.floor_number,
        totalFloors: row.total_floors,
        facing: row.facing,
        possessionDate: row.possession_date,
        constructionStatus: row.construction_status,
        basePrice: row.price ? Number(row.price) : null,
        priceDisplay: priceDisplay,
        availability: row.availability || 'AVAILABLE',
        displayOrder: idx,
      }));
    }
  }

  const rawCategories: string[] = Array.isArray(row.property_categories) && row.property_categories.length > 0
    ? row.property_categories
    : (row.property_category ? [row.property_category] : ['Residential']);
  const primaryCategory = rawCategories[0] || row.property_category || 'Residential';

  const configurations: string[] = Array.isArray(row.configurations) && row.configurations.length > 0
    ? row.configurations
    : (propertyConfigurations.length > 0
        ? propertyConfigurations.map(c => c.configurationType)
        : (row.bedrooms ? [`${row.bedrooms} BHK`] : []));

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    propertyCode: row.property_code,
    builderId: row.builder_id,
    builderName,
    builderLogo,
    managedBy: row.managed_by || null,
    landmark: row.landmark,
    locality: row.locations ? row.locations.name : row.locality,
    locationSlug: row.locations ? row.locations.slug : null,
    sector: row.locations && row.locations.type === 'SECTOR' ? row.locations.name : row.sector,
    city: row.cities ? row.cities.name : row.city,
    citySlug: row.cities ? row.cities.slug : null,
    cityId: row.city_id,
    locationId: row.location_id,
    state: row.cities ? row.cities.state : row.state,
    country: row.country,
    address: row.address,
    pincode: row.pincode,
    googleMapsUrl: row.google_maps_url,
    latitude: row.latitude ? Number(row.latitude) : null,
    longitude: row.longitude ? Number(row.longitude) : null,
    price: minPrice,
    minPrice,
    maxPrice,
    priceDisplay,
    propertyCategory: primaryCategory,
    propertyCategories: rawCategories,
    propertyType: row.property_type,
    configurations,
    propertyConfigurations,
    status: row.status,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    carpetArea: row.carpet_area ? Number(row.carpet_area) : null,
    possessionDate: row.possession_date ? new Date(row.possession_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : null,
    reraNumber: row.rera_number || null,
    isFeatured: row.is_featured,
    isVerified: row.is_verified,
    isPremium: row.is_premium,
    description: row.description,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    thumbnail,
    images,
    amenityGroups,
    floorPlans,
    documents,
    builderProfile,
    shortDescription: row.short_description,
  };
}

export async function getPublicProperties(filters: PropertyFilterOptions): Promise<{
  properties: PublicProperty[];
  totalPages: number;
  totalCount: number;
}> {
  const supabase = createPublicClient();
  const ITEMS_PER_PAGE = filters.limit || 6;
  const page = filters.page || 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  let cityId = filters.cityId;
  let locationId = filters.locationId;

  // Resolve City Slug to ID
  if (!cityId && filters.city && filters.city !== 'all') {
    const { data: cityData } = await supabase
      .from('cities')
      .select('id')
      .eq('slug', filters.city)
      .single();
    if (cityData) cityId = cityData.id;
  }

  // Resolve Location Slug to ID
  if (!locationId && filters.location && filters.location !== 'all') {
    const { data: locData } = await supabase
      .from('locations')
      .select('id')
      .eq('slug', filters.location)
      .single();
    if (locData) locationId = locData.id;
  }

  const resolvedFilters = {
    ...filters,
    cityId,
    locationId,
  };

  const selectString = buildPropertySelect(resolvedFilters);

  let query = supabase
    .from('properties')
    .select(selectString, { count: 'exact' })
    .eq('status', 'ACTIVE');

  query = applyPropertyFilters(query, resolvedFilters);
  query = applyPropertySort(query, resolvedFilters.sort);

  if (filters.limit) {
    query = query.limit(Number(filters.limit));
  } else {
    query = query.range(offset, offset + ITEMS_PER_PAGE - 1);
  }

  const { data, count, error } = await query;
  if (error) {
    if (error.message.includes('invalid input value for enum') || error.message.includes('operator does not exist')) {
      return { properties: [], totalCount: 0, totalPages: 0 };
    }
    throw new Error(`Database Error: ${error.message}`);
  }

  const properties = (data || []).map(mapToPublicProperty);

  const actualCount = count || 0;
  const totalPages = Math.ceil(actualCount / ITEMS_PER_PAGE);

  return { properties, totalCount: actualCount, totalPages };
}

export async function getPublicPropertyBySlug(slug: string): Promise<PublicProperty | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      builders (*),
      property_media (url, is_featured, display_order),
      property_floor_plans (*),
      property_documents (*),
      property_configurations (*),
      property_amenities (
        amenities (name, category, icon)
      ),
      cities (id, name, slug, state),
      locations (id, name, slug, type)
    `)
    .eq('slug', slug)
    .eq('status', 'ACTIVE')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Database Error: ${error.message}`);
  }

  return mapToPublicProperty(data);
}

export async function getRelatedProperties(baseProperty: PublicProperty, limit: number = 4): Promise<PublicProperty[]> {
  const supabase = createPublicClient();
  const results: any[] = [];
  const fetchedIds = new Set<string>([baseProperty.id]);

  const fetchProperties = async (queryBuilder: any, limitNeeded: number) => {
    const { data, error } = await queryBuilder
      .eq('status', 'ACTIVE')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limitNeeded);

    if (error) {
      console.error('Failed to fetch related properties:', error);
      return [];
    }

    const newItems = (data || []).filter((item: any) => !fetchedIds.has(item.id));
    newItems.forEach((item: any) => fetchedIds.add(item.id));
    return newItems;
  };

  // 1. Same Location
  if (baseProperty.locationId && results.length < limit) {
    let query = supabase.from('properties').select(`
        *,
        builders (name, logo_url),
        property_media (url, is_featured, display_order),
        cities (id, name, slug, state),
        locations (id, name, slug, type)
      `)
      .eq('location_id', baseProperty.locationId)
      .neq('id', baseProperty.id);

    const items = await fetchProperties(query, limit - results.length);
    results.push(...items);
  }

  // 2. Same City
  if (baseProperty.cityId && results.length < limit) {
    let query = supabase.from('properties').select(`
        *,
        builders (name, logo_url),
        property_media (url, is_featured, display_order),
        cities (id, name, slug, state),
        locations (id, name, slug, type)
      `)
      .eq('city_id', baseProperty.cityId)
      .neq('id', baseProperty.id);

    if (baseProperty.locationId) {
       query = query.neq('location_id', baseProperty.locationId);
    }

    const items = await fetchProperties(query, limit - results.length);
    results.push(...items);
  }

  // 3. Same Builder
  if (baseProperty.builderId && results.length < limit) {
    let query = supabase.from('properties').select(`
        *,
        builders (name, logo_url),
        property_media (url, is_featured, display_order),
        cities (id, name, slug, state),
        locations (id, name, slug, type)
      `)
      .eq('builder_id', baseProperty.builderId)
      .neq('id', baseProperty.id);

    if (baseProperty.cityId) {
      query = query.neq('city_id', baseProperty.cityId);
    }

    const items = await fetchProperties(query, limit - results.length);
    results.push(...items);
  }

  // 4. Same Property Type
  if (baseProperty.propertyType && results.length < limit) {
    let query = supabase.from('properties').select(`
        *,
        builders (name, logo_url),
        property_media (url, is_featured, display_order),
        cities (id, name, slug, state),
        locations (id, name, slug, type)
      `)
      .eq('property_type', baseProperty.propertyType)
      .neq('id', baseProperty.id);

    if (baseProperty.cityId) {
       query = query.neq('city_id', baseProperty.cityId);
    }
    if (baseProperty.builderId) {
       query = query.neq('builder_id', baseProperty.builderId);
    }

    const items = await fetchProperties(query, limit - results.length);
    results.push(...items);
  }

  return results.map(mapToPublicProperty);
}

export async function getPublicFilterOptions(): Promise<{
  cities: { id: string; name: string; slug: string }[];
  builders: string[];
  categories: string[];
  types: string[];
  configs: string[];
  statuses: string[];
}> {
  const supabase = createPublicClient();

  const { data: properties, error: propertiesError } = await supabase
    .from('properties')
    .select('property_category, property_categories, property_type, configurations, bedrooms, construction_status')
    .eq('status', 'ACTIVE');

  const { data: builders, error: buildersError } = await supabase
    .from('builders')
    .select('name')
    .eq('is_active', true);

  const { data: cities, error: citiesError } = await supabase
    .from('cities')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('name');

  if (propertiesError || buildersError || citiesError) {
    console.error('Failed to fetch filter options', { propertiesError, buildersError, citiesError });
    return { cities: [], builders: [], categories: [], types: [], configs: [], statuses: [] };
  }

  const categoriesSet = new Set<string>();
  const typesSet = new Set<string>();
  const configsSet = new Set<string>();
  const statusesSet = new Set<string>();

  (properties || []).forEach((p: any) => {
    if (Array.isArray(p.property_categories)) {
      p.property_categories.forEach((cat: string) => {
        if (cat) categoriesSet.add(cat);
      });
    } else if (p.property_category) {
      categoriesSet.add(p.property_category);
    }

    if (p.property_type) typesSet.add(p.property_type);

    if (Array.isArray(p.configurations) && p.configurations.length > 0) {
      p.configurations.forEach((c: string) => {
        if (c) configsSet.add(c);
      });
    } else if (p.bedrooms) {
      configsSet.add(`${p.bedrooms} BHK`);
    }

    if (p.construction_status) {
      const statusStr = String(p.construction_status).replace(/_/g, ' ');
      statusesSet.add(
        statusStr.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
      );
    }
  });

  return {
    cities: (cities || []).map((c: any) => ({ id: c.id, name: c.name, slug: c.slug })),
    builders: (builders || []).map((b: any) => b.name).sort(),
    categories: Array.from(categoriesSet).sort(),
    types: Array.from(typesSet).sort(),
    configs: Array.from(configsSet).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    statuses: Array.from(statusesSet).sort(),
  };
}

export async function getTopLocations(): Promise<{ name: string; slug: string; image: string; propertyCount: number }[]> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from('properties')
    .select('locality, property_media (url, is_featured)')
    .eq('status', 'ACTIVE');

  if (error || !data) return [];

  const locMap = new Map<string, { count: number; images: string[] }>();

  data.forEach((p: any) => {
    if (!p.locality) return;
    const loc = p.locality;
    if (!locMap.has(loc)) locMap.set(loc, { count: 0, images: [] });

    const stats = locMap.get(loc)!;
    stats.count++;

    const featured = p.property_media?.find((m: any) => m.is_featured);
    if (featured) stats.images.push(featured.url);
    else if (p.property_media?.[0]) stats.images.push(p.property_media[0].url);
  });

  return Array.from(locMap.entries())
    .map(([name, stats]) => ({
      name,
      slug: name.toLowerCase().replace(/ /g, '-'),
      image: stats.images[0] || '/images/hero/hero-bg.jpg',
      propertyCount: stats.count
    }))
    .sort((a, b) => b.propertyCount - a.propertyCount)
    .slice(0, 4);
}

export async function getSiteStats(): Promise<{ propertyCount: number; developerCount: number; happyClients: string; yearsExperience: string }> {
  const supabase = createPublicClient();

  const [propertiesResult, buildersResult, settingsResult] = await Promise.all([
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
    supabase.from('builders').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('site_settings').select('value').eq('key', 'stats').single()
  ]);

  const statsSetting = settingsResult.data?.value as { happyClients?: string, yearsExperience?: string } | undefined;

  return {
    propertyCount: propertiesResult.count || 0,
    developerCount: buildersResult.count || 0,
    happyClients: statsSetting?.happyClients || "2,000+",
    yearsExperience: statsSetting?.yearsExperience || "10+"
  };
}

export async function getFeaturedBuilders(): Promise<PublicFeaturedBuilder[]> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from('builders')
    .select(`
      id, slug, name, logo_url, description, established_year,
      properties (id, status)
    `)
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Failed to fetch featured builders:', error);
    return [];
  }

  return data.map((b: any) => {
    const activeProperties = (b.properties || []).filter((p: any) => p.status === 'ACTIVE');
    return {
      id: b.id,
      slug: b.slug,
      name: b.name,
      logoUrl: b.logo_url,
      description: b.description,
      establishedYear: b.established_year,
      activePropertyCount: activeProperties.length
    };
  });
}
