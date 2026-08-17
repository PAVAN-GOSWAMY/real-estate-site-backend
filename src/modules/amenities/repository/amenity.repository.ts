import { createClient } from '@/lib/supabase/server';
import { Amenity, CreateAmenityInput, UpdateAmenityInput } from '../types/amenity';

function mapAmenityRow(row: any): Amenity {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    icon: row.icon,
    description: row.description,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listActiveAmenities(): Promise<Amenity[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('amenities')
    .select('*')
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Database Error: ${error.message}`);
  }

  return (data || []).map(mapAmenityRow);
}

export async function listAllAmenities(): Promise<Amenity[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('amenities')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Database Error: ${error.message}`);
  }

  return (data || []).map(mapAmenityRow);
}

export async function getAmenityById(id: string): Promise<Amenity | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('amenities')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(`Database Error: ${error.message}`);
  }

  return mapAmenityRow(data);
}

export async function createAmenity(input: CreateAmenityInput): Promise<Amenity> {
  const supabase = await createClient();
  
  const payload = {
    name: input.name,
    category: input.category,
    icon: input.icon,
    description: input.description,
    is_active: input.isActive,
  };

  const { data, error } = await supabase
    .from('amenities')
    .insert([payload])
    .select('*')
    .single();

  if (error) {
    throw new Error(`Database Error: ${error.message}`);
  }

  return mapAmenityRow(data);
}

export async function updateAmenity(id: string, input: UpdateAmenityInput): Promise<Amenity> {
  const supabase = await createClient();
  
  const payload: any = {};
  if (input.name !== undefined) payload.name = input.name;
  if (input.category !== undefined) payload.category = input.category;
  if (input.icon !== undefined) payload.icon = input.icon;
  if (input.description !== undefined) payload.description = input.description;
  if (input.isActive !== undefined) payload.is_active = input.isActive;
  
  payload.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('amenities')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Database Error: ${error.message}`);
  }

  return mapAmenityRow(data);
}
