import { createClient } from '@/lib/supabase/server';
import { Amenity } from '../types/amenity';

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
