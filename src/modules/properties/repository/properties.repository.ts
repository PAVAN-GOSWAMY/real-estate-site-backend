import { createClient } from '@/lib/supabase/server';
import { Property, CreatePropertyInput, UpdatePropertyInput, PropertyFilters } from '../types/property';
import { PropertyStatus } from '../types/enums';

/**
 * Helper to map the snake_case database row to the camelCase domain model.
 */
function mapToProperty(row: any): Property {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    propertyCode: row.property_code,
    builderId: row.builder_id,
    propertyCategory: row.property_category,
    propertyType: row.property_type,
    status: row.status,
    availability: row.availability,
    address: row.address,
    landmark: row.landmark,
    city_id: row.city_id,
    location_id: row.location_id,




    country: row.country,
    pincode: row.pincode,
    googleMapsUrl: row.google_maps_url,
    latitude: row.latitude,
    longitude: row.longitude,
    price: row.price,
    currency: row.currency,
    pricePerSqft: row.price_per_sqft,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    balconies: row.balconies,
    parking: row.parking,
    superBuiltupArea: row.super_builtup_area,
    carpetArea: row.carpet_area,
    floorNumber: row.floor_number,
    totalFloors: row.total_floors,
    facing: row.facing,
    possessionDate: row.possession_date,
    constructionStatus: row.construction_status,
    shortDescription: row.short_description,
    description: row.description,
    isFeatured: row.is_featured,
    isVerified: row.is_verified,
    isPremium: row.is_premium,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    reraNumber: row.rera_number,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
  };
}

/**
 * Inserts a new property into the database.
 */
export async function createProperty(data: CreatePropertyInput): Promise<Property> {
  const supabase = await createClient();
  
  const payload = {
    title: data.title,
    slug: data.slug,
    property_code: data.propertyCode,
    builder_id: data.builderId,
    property_category: data.propertyCategory,
    property_type: data.propertyType,
    status: data.status,
    availability: data.availability,
    address: data.address,
    landmark: data.landmark,
    city_id: data.city_id,
    location_id: data.location_id,




    country: data.country,
    pincode: data.pincode,
    google_maps_url: data.googleMapsUrl,
    latitude: data.latitude,
    longitude: data.longitude,
    price: data.price,
    currency: data.currency,
    price_per_sqft: data.pricePerSqft,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    balconies: data.balconies,
    parking: data.parking,
    super_builtup_area: data.superBuiltupArea,
    carpet_area: data.carpetArea,
    floor_number: data.floorNumber,
    total_floors: data.totalFloors,
    facing: data.facing,
    possession_date: data.possessionDate,
    construction_status: data.constructionStatus,
    short_description: data.shortDescription,
    description: data.description,
    is_featured: data.isFeatured,
    is_verified: data.isVerified,
    is_premium: data.isPremium,
    meta_title: data.metaTitle,
    meta_description: data.metaDescription,
    rera_number: data.reraNumber,
  };

  const { data: row, error } = await supabase
    .from('properties')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Repository Error - Failed to create property: ${error.message}`);
  }

  return mapToProperty(row);
}

/**
 * Retrieves a single property by its ID.
 */
export async function getPropertyById(id: string): Promise<Property | null> {
  const supabase = await createClient();
  
  const { data: row, error } = await supabase
    .from('properties')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Repository Error - Failed to fetch property by ID: ${error.message}`);
  }

  return row ? mapToProperty(row) : null;
}

/**
 * Retrieves a single property by its slug.
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const supabase = await createClient();
  
  const { data: row, error } = await supabase
    .from('properties')
    .select()
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Repository Error - Failed to fetch property by slug: ${error.message}`);
  }

  return row ? mapToProperty(row) : null;
}

/**
 * Lists properties based on filters with pagination.
 */
export async function listProperties(
  filters: PropertyFilters
): Promise<{ items: Property[]; total: number; page: number; limit: number }> {
  const supabase = await createClient();
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('properties').select('*', { count: 'exact' });

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,property_code.ilike.%${filters.search}%`);
  }
  if (filters.builderId) {
    query = query.eq('builder_id', filters.builderId);
  }
  if (filters.propertyCategory) {
    query = query.eq('property_category', filters.propertyCategory);
  }
  if (filters.propertyType) {
    query = query.eq('property_type', filters.propertyType);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.availability) {
    query = query.eq('availability', filters.availability);
  }
  if (filters.featured !== undefined) {
    query = query.eq('is_featured', filters.featured);
  }
  if (filters.verified !== undefined) {
    query = query.eq('is_verified', filters.verified);
  }
  if (filters.premium !== undefined) {
    query = query.eq('is_premium', filters.premium);
  }
  if (filters.city) {
    // Legacy support: mapping city to city_id is needed if filters.city is passed
    // For now, we skip or filter by city_id if it's a UUID
    if (filters.city.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
      query = query.eq('city_id', filters.city);
    }
  }
  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters.bedrooms !== undefined) {
    query = query.eq('bedrooms', filters.bedrooms);
  }

  const { data: rows, error, count } = await query
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Repository Error - Failed to list properties: ${error.message}`);
  }

  return {
    items: rows.map(mapToProperty),
    total: count || 0,
    page,
    limit,
  };
}

/**
 * Updates an existing property by ID.
 */
export async function updateProperty(id: string, data: UpdatePropertyInput): Promise<Property> {
  const supabase = await createClient();
  
  const payload: any = {};
  
  if (data.title !== undefined) payload.title = data.title;
  if (data.slug !== undefined) payload.slug = data.slug;
  if (data.propertyCode !== undefined) payload.property_code = data.propertyCode;
  if (data.builderId !== undefined) payload.builder_id = data.builderId;
  if (data.propertyCategory !== undefined) payload.property_category = data.propertyCategory;
  if (data.propertyType !== undefined) payload.property_type = data.propertyType;
  if (data.status !== undefined) payload.status = data.status;
  if (data.availability !== undefined) payload.availability = data.availability;
  if (data.address !== undefined) payload.address = data.address;
  if (data.landmark !== undefined) payload.landmark = data.landmark;

  if (data.location_id !== undefined) payload.location_id = data.location_id;




  if (data.country !== undefined) payload.country = data.country;
  if (data.pincode !== undefined) payload.pincode = data.pincode;
  if (data.googleMapsUrl !== undefined) payload.google_maps_url = data.googleMapsUrl;
  if (data.latitude !== undefined) payload.latitude = data.latitude;
  if (data.longitude !== undefined) payload.longitude = data.longitude;
  if (data.price !== undefined) payload.price = data.price;
  if (data.currency !== undefined) payload.currency = data.currency;
  if (data.pricePerSqft !== undefined) payload.price_per_sqft = data.pricePerSqft;
  if (data.bedrooms !== undefined) payload.bedrooms = data.bedrooms;
  if (data.bathrooms !== undefined) payload.bathrooms = data.bathrooms;
  if (data.balconies !== undefined) payload.balconies = data.balconies;
  if (data.parking !== undefined) payload.parking = data.parking;
  if (data.superBuiltupArea !== undefined) payload.super_builtup_area = data.superBuiltupArea;
  if (data.carpetArea !== undefined) payload.carpet_area = data.carpetArea;
  if (data.floorNumber !== undefined) payload.floor_number = data.floorNumber;
  if (data.totalFloors !== undefined) payload.total_floors = data.totalFloors;
  if (data.facing !== undefined) payload.facing = data.facing;
  if (data.possessionDate !== undefined) payload.possession_date = data.possessionDate;
  if (data.constructionStatus !== undefined) payload.construction_status = data.constructionStatus;
  if (data.shortDescription !== undefined) payload.short_description = data.shortDescription;
  if (data.description !== undefined) payload.description = data.description;
  if (data.isFeatured !== undefined) payload.is_featured = data.isFeatured;
  if (data.isVerified !== undefined) payload.is_verified = data.isVerified;
  if (data.isPremium !== undefined) payload.is_premium = data.isPremium;
  if (data.metaTitle !== undefined) payload.meta_title = data.metaTitle;
  if (data.metaDescription !== undefined) payload.meta_description = data.metaDescription;
  if (data.reraNumber !== undefined) payload.rera_number = data.reraNumber;

  if (Object.keys(payload).length === 0) {
    const existing = await getPropertyById(id);
    if (!existing) {
      throw new Error("Repository Error - Property to update not found");
    }
    return existing;
  }

  const { data: row, error } = await supabase
    .from('properties')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Repository Error - Failed to update property: ${error.message}`);
  }

  return mapToProperty(row);
}

/**
 * Toggles a property status (e.g., ACTIVE, INACTIVE).
 */
export async function togglePropertyStatus(id: string, status: PropertyStatus): Promise<Property> {
  const supabase = await createClient();
  
  const { data: row, error } = await supabase
    .from('properties')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Repository Error - Failed to toggle property status: ${error.message}`);
  }

  return mapToProperty(row);
}

/**
 * Hard deletes a property from the database.
 */
export async function deleteProperty(id: string): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Repository Error - Failed to delete property: ${error.message}`);
  }
}

/**
 * Gets the next available property code.
 */
export async function getNextPropertyCode(): Promise<string> {
  const supabase = await createClient();
  
  // We'll get the highest property code that starts with PROP-
  const { data, error } = await supabase
    .from('properties')
    .select('property_code')
    .like('property_code', 'PROP-%')
    .order('property_code', { ascending: false })
    .limit(1)
    .maybeSingle();
    
  if (error && error.code !== 'PGRST116') {
    console.error("Failed to fetch max property code:", error);
    // Fallback if query fails
    return `PROP-${Date.now().toString().slice(-6)}`;
  }
  
  if (!data || !data.property_code) {
    return 'PROP-000001';
  }
  
  const currentCode = data.property_code;
  // Extract the number part
  const numMatch = currentCode.match(/PROP-(\d+)/);
  if (numMatch && numMatch[1]) {
    const nextNum = parseInt(numMatch[1], 10) + 1;
    return `PROP-${nextNum.toString().padStart(6, '0')}`;
  }
  
  // Fallback if regex fails
  return `PROP-${Date.now().toString().slice(-6)}`;
}
