import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { PropertyConfigurationEntity } from "@/types/property-configuration.types";
import { CreatePropertyConfigurationDto, UpdatePropertyConfigurationDto, PropertyConfigurationFilterDto } from "../dto/property-configuration.dto";

export class PropertyConfigurationRepository extends BaseRepository<PropertyConfigurationEntity, CreatePropertyConfigurationDto, UpdatePropertyConfigurationDto> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'property_configurations');
  }

  async findMany(query: PropertyConfigurationFilterDto): Promise<{ data: PropertyConfigurationEntity[]; count: number }> {
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
      q = q.or(`name.ilike.%${search}%,slug.ilike.%${search}%,configuration_group.ilike.%${search}%,short_description.ilike.%${search}%,detailed_description.ilike.%${search}%,seo_title.ilike.%${search}%,seo_keywords.ilike.%${search}%`);
    }

    // Apply pagination
    q = q.range(offset, offset + limit! - 1);

    // Apply stable sorting
    if (sort) {
      q = q.order(sort, { ascending: order === 'asc' });
    } else {
      q = q.order('display_order', { ascending: true }); // Default sort for property configurations
    }
    // Always append id as tie-breaker for stable sorting
    q = q.order('id', { ascending: false });

    const { data, count, error } = await q;

    if (error) {
      this.handleError(error, 'findMany');
    }

    return { data: data as PropertyConfigurationEntity[], count: count || 0 };
  }

  async findBySlug(slug: string): Promise<PropertyConfigurationEntity | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('slug', slug)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'findBySlug');
    }

    return data as PropertyConfigurationEntity | null;
  }

  async findByName(name: string): Promise<PropertyConfigurationEntity | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .ilike('name', name)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'findByName');
    }

    return data as PropertyConfigurationEntity | null;
  }
}
