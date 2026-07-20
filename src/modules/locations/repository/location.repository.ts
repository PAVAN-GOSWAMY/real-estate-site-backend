import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { LocationEntity } from "@/types/location.types";
import { CreateLocationDto, UpdateLocationDto, LocationFilterDto } from "../dto/location.dto";
import { Modules } from "@/lib/constants/modules";

export class LocationRepository extends BaseRepository<LocationEntity, CreateLocationDto, UpdateLocationDto> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.LOCATIONS);
  }

  /**
   * Extends the base findMany to support custom search behavior across multiple columns
   */
  async findMany(query: LocationFilterDto): Promise<{ data: LocationEntity[]; count: number }> {
    const { page, limit, sort, order, search, parent_location_id, ...filters } = query;
    const offset = (page! - 1) * limit!;

    let q = this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact' })
      .is('deleted_at', null);

    // Apply strict filtering
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        q = q.eq(key, value);
      }
    });

    // Handle explicit null for parent_location_id (e.g. fetching root locations)
    if (parent_location_id !== undefined) {
      if (parent_location_id === 'null') {
        q = q.is('parent_location_id', null);
      } else {
        q = q.eq('parent_location_id', parent_location_id);
      }
    }

    // Apply enterprise search strategy (Phase 6.13)
    if (search) {
      q = q.or(`name.ilike.%${search}%,slug.ilike.%${search}%,seo_title.ilike.%${search}%`);
    }

    // Apply pagination
    q = q.range(offset, offset + limit! - 1);

    // Apply stable sorting
    if (sort) {
      q = q.order(sort, { ascending: order === 'asc' });
    } else {
      // Default sort (as defined in Phase 6.14)
      q = q.order('display_order', { ascending: true });
    }
    // Always append id as tie-breaker for stable sorting
    q = q.order('id', { ascending: false });

    const { data, count, error } = await q;

    if (error) {
      this.handleError(error, 'findMany');
    }

    return { data: data as LocationEntity[], count: count || 0 };
  }

  async findBySlug(slug: string): Promise<LocationEntity | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('slug', slug)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
      this.handleError(error, 'findBySlug');
    }

    return data as LocationEntity | null;
  }
}
