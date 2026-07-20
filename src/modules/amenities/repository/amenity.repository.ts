import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { AmenityEntity } from "@/types/amenity.types";
import { CreateAmenityDto, UpdateAmenityDto, AmenityFilterDto } from "../dto/amenity.dto";
import { Modules } from "@/lib/constants/modules";

export class AmenityRepository extends BaseRepository<AmenityEntity, CreateAmenityDto, UpdateAmenityDto> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.AMENITIES);
  }

  async findMany(query: AmenityFilterDto): Promise<{ data: AmenityEntity[]; count: number }> {
    const { page, limit, sort, order, search, ...filters } = query;
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

    // Apply enterprise search strategy (Phase 6.13)
    if (search) {
      q = q.or(`name.ilike.%${search}%,slug.ilike.%${search}%,amenity_group.ilike.%${search}%,short_description.ilike.%${search}%,detailed_description.ilike.%${search}%,seo_title.ilike.%${search}%,seo_keywords.ilike.%${search}%`);
    }

    // Apply pagination
    q = q.range(offset, offset + limit! - 1);

    // Apply stable sorting
    if (sort) {
      q = q.order(sort, { ascending: order === 'asc' });
    } else {
      q = q.order('display_order', { ascending: true }); // Default sort for amenities
    }
    // Always append id as tie-breaker for stable sorting
    q = q.order('id', { ascending: false });

    const { data, count, error } = await q;

    if (error) {
      this.handleError(error, 'findMany');
    }

    return { data: data as AmenityEntity[], count: count || 0 };
  }

  async findBySlug(slug: string): Promise<AmenityEntity | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('slug', slug)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'findBySlug');
    }

    return data as AmenityEntity | null;
  }

  async findByName(name: string): Promise<AmenityEntity | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .ilike('name', name)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'findByName');
    }

    return data as AmenityEntity | null;
  }
}
