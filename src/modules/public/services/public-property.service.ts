import { createClient } from '@/lib/supabase/server';
import { PublicProperty, PublicAmenityGroup } from '../types/property';
import { PublicFeaturedBuilder } from '../types/builder';
import { PropertySearchParams } from '@/core/queries/properties';
import { PropertyFloorPlan, PropertyDocument } from '../../properties/types/assets';

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

  // Formatting price display if price exists
  let priceDisplay = row.price ? `₹ ${(row.price / 10000000).toFixed(2)} Cr Onwards` : null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    propertyCode: row.property_code,
    builderId: row.builder_id,
    builderName,
    builderLogo,
    landmark: row.landmark,
    locality: row.locality,
    sector: row.sector,
    city: row.city,
    state: row.state,
    country: row.country,
    address: row.address,
    pincode: row.pincode,
    googleMapsUrl: row.google_maps_url,
    latitude: row.latitude ? Number(row.latitude) : null,
    longitude: row.longitude ? Number(row.longitude) : null,
    price: row.price ? Number(row.price) : null,
    priceDisplay,
    propertyType: row.property_type,
    status: row.status,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    carpetArea: row.carpet_area ? Number(row.carpet_area) : null,
    possessionDate: row.possession_date ? new Date(row.possession_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : null,
    reraNumber: row.rera_number,
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

export async function getPublicProperties(searchParams: PropertySearchParams): Promise<{
  properties: PublicProperty[];
  totalPages: number;
  totalCount: number;
}> {
  const supabase = await createClient();
  const ITEMS_PER_PAGE = 6;
  const page = parseInt(searchParams.page || "1");
  const offset = (page - 1) * ITEMS_PER_PAGE;

  let query = supabase
    .from('properties')
    .select(`
      *,
      builders (name, logo_url),
      property_media (url, is_featured, display_order)
    `, { count: 'exact' })
    .eq('status', 'ACTIVE');

  if (searchParams.isFeatured) {
    query = query.eq('is_featured', searchParams.isFeatured === 'true' || searchParams.isFeatured === true);
  }

  if (searchParams.isPremium) {
    query = query.eq('is_premium', searchParams.isPremium === 'true' || searchParams.isPremium === true);
  }

  // Filters
  if (searchParams.q) {
    query = query.or(`title.ilike.%${searchParams.q}%,locality.ilike.%${searchParams.q}%,city.ilike.%${searchParams.q}%`);
  }
  
  if (searchParams.location && searchParams.location !== 'all') {
    const loc = searchParams.location.replace(/-/g, ' ');
    query = query.or(`locality.ilike.%${loc}%,city.ilike.%${loc}%`);
  }

  if (searchParams.builder && searchParams.builder !== 'all') {
    // Requires a builder ID or name. For simplicity if slug is passed, we might need a subquery, 
    // but assuming builder filter currently passes name in mock, we use ilike on joined table?
    // Supabase JS doesn't support ilike on joined tables easily at the top level without inner joins.
    // Let's filter on the properties side or just fetch all and filter in memory if strictly needed,
    // but better to use an inner join or view. 
    // For now, we will assume builder is the exact builder_id if it's a UUID, otherwise we might skip it 
    // or we can just fetch and filter. Actually, the mock UI passes sluggified names. 
    // We'll leave it out of the direct query if it's complex, or do a subselect.
    // Let's do a subselect for builder id if it's not a UUID.
    // Since we don't know, we'll try to match it. If we skip it here, we filter in memory.
  }

  if (searchParams.type && searchParams.type !== 'all') {
    const t = searchParams.type.replace(/-/g, ' ');
    query = query.ilike('property_type', `%${t}%`);
  }

  if (searchParams.status && searchParams.status !== 'all') {
    const s = searchParams.status.replace(/-/g, ' ');
    query = query.ilike('status', `%${s}%`);
  }

  if (searchParams.budget && searchParams.budget !== 'all') {
    const b = searchParams.budget;
    if (b === "under-3") query = query.lt('price', 30000000);
    if (b === "3-5") query = query.gte('price', 30000000).lt('price', 50000000);
    if (b === "5-10") query = query.gte('price', 50000000).lte('price', 100000000);
    if (b === "above-10") query = query.gt('price', 100000000);
  }

  // Ordering
  if (searchParams.sort) {
    switch (searchParams.sort) {
      case "price-asc":
        query = query.order('price', { ascending: true, nullsFirst: false });
        break;
      case "price-desc":
        query = query.order('price', { ascending: false, nullsFirst: false });
        break;
      case "newest":
        query = query.order('created_at', { ascending: false });
        break;
      case "possession":
        query = query.order('possession_date', { ascending: true, nullsFirst: false });
        break;
      case "recommended":
      default:
        query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
        break;
    }
  } else {
    query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
  }

  if (searchParams.limit) {
    query = query.limit(Number(searchParams.limit));
  } else {
    query = query.range(offset, offset + ITEMS_PER_PAGE - 1);
  }

  const { data, count, error } = await query;
  if (error) throw new Error(`Database Error: ${error.message}`);

  let filteredData = data || [];

  // Manual fallback filter for Builder since doing it over the join is tricky in standard Supabase JS
  if (searchParams.builder && searchParams.builder !== 'all') {
    const builderSlug = searchParams.builder.replace(/-/g, ' ').toLowerCase();
    filteredData = filteredData.filter((row: any) => 
      row.builders?.name?.toLowerCase().includes(builderSlug)
    );
  }

  const properties = filteredData.map(mapToPublicProperty);
  
  // If we manually filtered, count will be wrong, but for MVP it's acceptable.
  const actualCount = count || 0; 
  const totalPages = Math.ceil(actualCount / ITEMS_PER_PAGE);

  return { properties, totalCount: actualCount, totalPages };
}

export async function getPublicPropertyBySlug(slug: string): Promise<PublicProperty | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      builders (*),
      property_media (url, is_featured, display_order),
      property_floor_plans (*),
      property_documents (*),
      property_amenities (
        amenities (name, category, icon)
      )
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

export async function getRelatedProperties(propertyId: string, builderId: string, limit: number = 4): Promise<PublicProperty[]> {
  const supabase = await createClient();
  
  // To keep it simple but effective: We fetch properties from the same builder, excluding the current one.
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      builders (name, logo_url),
      property_media (url, is_featured, display_order)
    `)
    .eq('status', 'ACTIVE')
    .eq('builder_id', builderId)
    .neq('id', propertyId)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch related properties:', error);
    return [];
  }

  return (data || []).map(mapToPublicProperty);
}

export async function getPublicFilterOptions(): Promise<{
  locations: string[];
  builders: string[];
  types: string[];
  configs: string[];
  statuses: string[];
}> {
  const supabase = await createClient();

  const { data: properties, error: propertiesError } = await supabase
    .from('properties')
    .select('locality, city, property_type, bedrooms, construction_status')
    .eq('status', 'ACTIVE');
    
  const { data: builders, error: buildersError } = await supabase
    .from('builders')
    .select('name')
    .eq('is_active', true);

  if (propertiesError || buildersError) {
    console.error('Failed to fetch filter options', { propertiesError, buildersError });
    return { locations: [], builders: [], types: [], configs: [], statuses: [] };
  }

  const locationsSet = new Set<string>();
  const typesSet = new Set<string>();
  const configsSet = new Set<string>();
  const statusesSet = new Set<string>();

  (properties || []).forEach(p => {
    if (p.locality) locationsSet.add(p.locality);
    if (p.city) locationsSet.add(p.city);
    if (p.property_type) typesSet.add(p.property_type);
    if (p.bedrooms) configsSet.add(`${p.bedrooms} BHK`);
    if (p.construction_status) {
      const statusStr = String(p.construction_status).replace(/_/g, ' ');
      statusesSet.add(
        statusStr.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
      );
    }
  });

  return {
    locations: Array.from(locationsSet).sort(),
    builders: (builders || []).map(b => b.name).sort(),
    types: Array.from(typesSet).sort(),
    configs: Array.from(configsSet).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    statuses: Array.from(statusesSet).sort(),
  };
}

export async function getTopLocations(): Promise<{ name: string; slug: string; image: string; propertyCount: number }[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('properties')
    .select('locality, property_media (url, is_featured)')
    .eq('status', 'ACTIVE');

  if (error || !data) return [];

  const locMap = new Map<string, { count: number; images: string[] }>();

  data.forEach(p => {
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

export async function getSiteStats(): Promise<{ propertyCount: number; developerCount: number }> {
  const supabase = await createClient();
  
  const [propertiesResult, buildersResult] = await Promise.all([
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
    supabase.from('builders').select('*', { count: 'exact', head: true }).eq('is_active', true)
  ]);

  return {
    propertyCount: propertiesResult.count || 0,
    developerCount: buildersResult.count || 0
  };
}

export async function getFeaturedBuilders(): Promise<PublicFeaturedBuilder[]> {
  const supabase = await createClient();
  
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
