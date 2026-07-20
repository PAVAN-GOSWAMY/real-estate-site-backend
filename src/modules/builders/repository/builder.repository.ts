import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { BuilderEntity } from "@/types/builder.types";
import { CreateBuilderDto, UpdateBuilderDto, BuilderFilterDto } from "../dto/builder.dto";
import { Modules } from "@/lib/constants/modules";

export class BuilderRepository extends BaseRepository<BuilderEntity, CreateBuilderDto, UpdateBuilderDto> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.BUILDERS);
  }

  async findMany(query: BuilderFilterDto): Promise<{ data: BuilderEntity[]; count: number }> {
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
      q = q.or(`name.ilike.%${search}%,slug.ilike.%${search}%,seo_title.ilike.%${search}%,rera_number.ilike.%${search}%,website.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Apply pagination
    q = q.range(offset, offset + limit! - 1);

    // Apply stable sorting
    if (sort) {
      q = q.order(sort, { ascending: order === 'asc' });
    } else {
      q = q.order('name', { ascending: true }); // Default sort for reference data
    }
    // Always append id as tie-breaker for stable sorting
    q = q.order('id', { ascending: false });

    const { data, count, error } = await q;

    if (error) {
      this.handleError(error, 'findMany');
    }

    return { data: data as BuilderEntity[], count: count || 0 };
  }

  async findBySlug(slug: string): Promise<BuilderEntity | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('slug', slug)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'findBySlug');
    }

    return data as BuilderEntity | null;
  }

  async findByName(name: string): Promise<BuilderEntity | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .ilike('name', name)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'findByName');
    }

    return data as BuilderEntity | null;
  }
}
