import { createClient } from '@/lib/supabase/server';
import { City, CityInput } from '../types';
import { generateSlug } from '@/lib/utils';

export class CitiesRepository {
  static async findAll(activeOnly = true): Promise<City[]> {
    const supabase = await createClient();
    let query = supabase.from('cities').select('*, properties(count)').order('name');
    if (activeOnly) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  static async findPaginated(page: number, limit: number, filters: any = {}): Promise<{ cities: City[], total: number }> {
    const supabase = await createClient();
    const offset = (page - 1) * limit;

    let query = supabase.from('cities').select('*, properties(count)', { count: 'exact' });

    if (filters.q) {
      query = query.ilike('name', `%${filters.q}%`);
    }
    if (filters.state && filters.state !== 'all') {
      query = query.eq('state', filters.state);
    }
    if (filters.status && filters.status !== 'all') {
      query = query.eq('is_active', filters.status === 'active');
    }

    const { data, count, error } = await query
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);
    return { cities: data || [], total: count || 0 };
  }

  static async findById(id: string): Promise<City | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('cities').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  }

  static async create(input: CityInput): Promise<City> {
    const supabase = await createClient();
    const slug = generateSlug(`${input.name}-${input.state}`);
    const { data, error } = await supabase
      .from('cities')
      .insert({ ...input, slug, country: input.country || 'India' })
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  }

  static async update(id: string, input: Partial<CityInput>): Promise<City> {
    const supabase = await createClient();
    const updateData: any = { ...input };
    if (input.name || input.state) {
      // Re-generate slug if name or state changes, though risky for SEO, it's admin's choice.
      // Usually better to keep slug constant or alias it, but for now we follow simple logic.
      // We will skip slug update on regular edits unless strictly needed.
    }
    
    const { data, error } = await supabase
      .from('cities')
      .update(updateData)
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
      .eq('city_id', id);

    if (countErr) throw new Error(countErr.message);
    if (count && count > 0) {
      throw new Error("This city is assigned to existing properties. Mark it as Inactive instead.");
    }

    const { error } = await supabase.from('cities').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
