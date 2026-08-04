import { createClient } from '@/lib/supabase/server';
import { Location, LocationInput } from '../types';
import { generateSlug } from '@/lib/utils';

export class LocationsRepository {
  static async findAllByCity(cityId: string, activeOnly = true): Promise<Location[]> {
    const supabase = await createClient();
    let query = supabase.from('locations').select('*, properties(count)').eq('city_id', cityId).order('name');
    if (activeOnly) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  static async findPaginated(page: number, limit: number, filters: any = {}): Promise<{ locations: Location[], total: number }> {
    const supabase = await createClient();
    const offset = (page - 1) * limit;

    let query = supabase.from('locations').select('*, city:cities(name), properties(count)', { count: 'exact' });

    if (filters.q) {
      query = query.ilike('name', `%${filters.q}%`);
    }
    if (filters.city_id && filters.city_id !== 'all') {
      query = query.eq('city_id', filters.city_id);
    }
    if (filters.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }
    if (filters.status && filters.status !== 'all') {
      query = query.eq('is_active', filters.status === 'active');
    }

    const { data, count, error } = await query
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);
    return { locations: data || [], total: count || 0 };
  }

  static async findById(id: string): Promise<Location | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('locations').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  }

  static async create(input: LocationInput, citySlug: string): Promise<Location> {
    const supabase = await createClient();
    const slug = generateSlug(`${citySlug}-${input.name}`);
    const { data, error } = await supabase
      .from('locations')
      .insert({ ...input, slug })
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  }

  static async update(id: string, input: Partial<LocationInput>): Promise<Location> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('locations')
      .update(input)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  }

  static async delete(id: string): Promise<void> {
    const supabase = await createClient();
    
    // Check properties count for safe delete
    const { count, error: countErr } = await supabase
      .from('properties')
      .select('id', { count: 'exact', head: true })
      .eq('location_id', id);

    if (countErr) throw new Error(countErr.message);
    if (count && count > 0) {
      throw new Error("This location is assigned to existing properties. Mark it as Inactive instead.");
    }

    const { error } = await supabase.from('locations').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  static async bulkUpsert(locations: Partial<LocationInput>[]): Promise<Location[]> {
    const supabase = await createClient();
    
    // We use Supabase upsert which requires a unique conflict target
    // We'll rely on the slug as the unique constraint (locations_slug_idx)
    // For this to work, we need to make sure the data is structured correctly
    const { data, error } = await supabase
      .from('locations')
      .upsert(locations, { 
        onConflict: 'slug', 
        ignoreDuplicates: false // We want to update existing
      })
      .select();

    if (error) {
      throw new Error(`Bulk Upsert Error: ${error.message}`);
    }

    return data || [];
  }
}
