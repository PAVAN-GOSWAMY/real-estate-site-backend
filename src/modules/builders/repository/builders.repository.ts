import { createClient } from '@/lib/supabase/server';
import { Builder, CreateBuilderInput, UpdateBuilderInput, BuilderFilters } from '../types/builder';

/**
 * Type representing the raw database row returned from the 'builders' table.
 */
type DBBuilderRow = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  established_year: number | null;
  headquarters: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * Helper to map the snake_case database row to the camelCase domain model.
 */
function mapToBuilder(row: DBBuilderRow): Builder {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logoUrl: row.logo_url,
    description: row.description,
    establishedYear: row.established_year,
    headquarters: row.headquarters,
    website: row.website,
    email: row.email,
    phone: row.phone,
    isFeatured: row.is_featured,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Inserts a new builder into the database.
 * 
 * @param data The payload required to create a builder.
 * @returns The newly created builder.
 */
export async function createBuilder(data: CreateBuilderInput): Promise<Builder> {
  const supabase = await createClient();
  
  const payload = {
    name: data.name,
    slug: data.slug,
    logo_url: data.logoUrl,
    description: data.description,
    established_year: data.establishedYear,
    headquarters: data.headquarters,
    website: data.website,
    email: data.email,
    phone: data.phone,
    is_featured: data.isFeatured,
    is_active: data.isActive,
  };

  const { data: row, error } = await supabase
    .from('builders')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Repository Error - Failed to create builder: ${error.message}`);
  }

  return mapToBuilder(row as DBBuilderRow);
}

/**
 * Retrieves a single builder by their unique ID.
 * 
 * @param id The UUID of the builder.
 * @returns The builder, or null if not found.
 */
export async function getBuilderById(id: string): Promise<Builder | null> {
  const supabase = await createClient();
  
  const { data: row, error } = await supabase
    .from('builders')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Repository Error - Failed to fetch builder by ID: ${error.message}`);
  }

  return row ? mapToBuilder(row as DBBuilderRow) : null;
}

/**
 * Retrieves a single builder by their unique slug.
 * 
 * @param slug The URL-friendly slug of the builder.
 * @returns The builder, or null if not found.
 */
export async function getBuilderBySlug(slug: string): Promise<Builder | null> {
  const supabase = await createClient();
  
  const { data: row, error } = await supabase
    .from('builders')
    .select()
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Repository Error - Failed to fetch builder by slug: ${error.message}`);
  }

  return row ? mapToBuilder(row as DBBuilderRow) : null;
}

/**
 * Lists builders based on provided filters with pagination.
 * 
 * @param filters Filtering and pagination parameters.
 * @returns An object containing the items, total count, and pagination state.
 */
export async function listBuilders(
  filters: BuilderFilters
): Promise<{ items: Builder[]; total: number; page: number; limit: number }> {
  const supabase = await createClient();
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('builders').select('*', { count: 'exact' });

  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  if (filters.featured !== undefined) {
    query = query.eq('is_featured', filters.featured);
  }

  if (filters.active !== undefined) {
    query = query.eq('is_active', filters.active);
  }

  const { data: rows, error, count } = await query
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Repository Error - Failed to list builders: ${error.message}`);
  }

  return {
    items: (rows as DBBuilderRow[]).map(mapToBuilder),
    total: count || 0,
    page,
    limit,
  };
}

/**
 * Updates an existing builder by ID. Only supplied fields are updated.
 * 
 * @param id The UUID of the builder to update.
 * @param data The payload containing fields to update.
 * @returns The updated builder.
 */
export async function updateBuilder(id: string, data: UpdateBuilderInput): Promise<Builder> {
  const supabase = await createClient();
  
  const payload: Partial<DBBuilderRow> = {};
  
  if (data.name !== undefined) payload.name = data.name;
  if (data.slug !== undefined) payload.slug = data.slug;
  if (data.logoUrl !== undefined) payload.logo_url = data.logoUrl;
  if (data.description !== undefined) payload.description = data.description;
  if (data.establishedYear !== undefined) payload.established_year = data.establishedYear;
  if (data.headquarters !== undefined) payload.headquarters = data.headquarters;
  if (data.website !== undefined) payload.website = data.website;
  if (data.email !== undefined) payload.email = data.email;
  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.isFeatured !== undefined) payload.is_featured = data.isFeatured;
  if (data.isActive !== undefined) payload.is_active = data.isActive;

  if (Object.keys(payload).length === 0) {
    // If no fields to update, just return the existing builder
    const existing = await getBuilderById(id);
    if (!existing) {
      throw new Error("Repository Error - Builder to update not found");
    }
    return existing;
  }

  const { data: row, error } = await supabase
    .from('builders')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Repository Error - Failed to update builder: ${error.message}`);
  }

  return mapToBuilder(row as DBBuilderRow);
}

/**
 * Soft deletes a builder by setting is_active to false.
 * Does not physically delete the row from the database.
 * 
 * @param id The UUID of the builder to deactivate.
 * @returns The updated builder.
 */
export async function deactivateBuilder(id: string): Promise<Builder> {
  const supabase = await createClient();
  
  const { data: row, error } = await supabase
    .from('builders')
    .update({ is_active: false })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Repository Error - Failed to deactivate builder: ${error.message}`);
  }

  return mapToBuilder(row as DBBuilderRow);
}

/**
 * Reactivates a builder by setting is_active to true.
 * 
 * @param id The UUID of the builder to activate.
 * @returns The updated builder.
 */
export async function activateBuilder(id: string): Promise<Builder> {
  const supabase = await createClient();
  
  const { data: row, error } = await supabase
    .from('builders')
    .update({ is_active: true })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Repository Error - Failed to activate builder: ${error.message}`);
  }

  return mapToBuilder(row as DBBuilderRow);
}
