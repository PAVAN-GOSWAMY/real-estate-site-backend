import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { PropertyVideoEntity } from "@/types/property-video.types";
import { CreatePropertyVideoDto, UpdatePropertyVideoDto, PropertyVideoFilterDto } from "../dto/property-video.dto";
import { Modules } from "@/lib/constants/modules";

export class PropertyVideoRepository extends BaseRepository<PropertyVideoEntity, CreatePropertyVideoDto, UpdatePropertyVideoDto> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.PROPERTY_VIDEOS);
  }

  private get baseSelect() {
    return '*, properties(id, unit_code, slug)';
  }

  async findMany(query: PropertyVideoFilterDto): Promise<{ data: any[]; count: number }> {
    const { page, limit, sort, order, search, ...filters } = query;
    const offset = (page! - 1) * limit!;

    let q = this.supabase
      .from(this.tableName)
      .select(this.baseSelect, { count: 'exact' })
      .is('deleted_at', null);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        q = q.eq(key, value);
      }
    });

    if (search) {
      q = q.or(`video_name.ilike.%${search}%,title.ilike.%${search}%,video_code.ilike.%${search}%`);
    }

    q = q.range(offset, offset + limit! - 1);

    if (sort) {
      q = q.order(sort, { ascending: order === 'asc' });
    } else {
      q = q.order('display_order', { ascending: true });
    }
    q = q.order('id', { ascending: false });

    const { data, count, error } = await q;

    if (error) {
      this.handleError(error, 'findMany');
    }

    return { data: data || [], count: count || 0 };
  }

  async findByIdWithRelations(id: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(this.baseSelect)
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'findByIdWithRelations');
    }

    return data;
  }

  async existsByVideoCode(propertyId: string, videoCode: string): Promise<boolean> {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select('id', { count: 'exact', head: true })
      .eq('property_id', propertyId)
      .eq('video_code', videoCode)
      .is('deleted_at', null);

    if (error) {
      this.handleError(error, 'existsByVideoCode');
    }

    return (count || 0) > 0;
  }

  async incrementViewCount(id: string): Promise<void> {
    const { data: current } = await this.supabase
      .from(this.tableName)
      .select('view_count')
      .eq('id', id)
      .single();
      
    const currentCount = current?.view_count || 0;
      
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ view_count: currentCount + 1 })
      .eq('id', id)
      .is('deleted_at', null);

    if (error) {
      this.handleError(error, 'incrementViewCount');
    }
  }

  async unsetPrimaryVideo(propertyId: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ is_primary: false })
      .eq('property_id', propertyId)
      .eq('is_primary', true)
      .is('deleted_at', null);

    if (error) {
      this.handleError(error, 'unsetPrimaryVideo');
    }
  }

  async bulkCreate(data: CreatePropertyVideoDto[]): Promise<PropertyVideoEntity[]> {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .insert(data as any)
      .select();

    if (error) {
      this.handleError(error, 'bulkCreate');
    }

    return result as PropertyVideoEntity[];
  }

  async bulkUpdate(data: (UpdatePropertyVideoDto & { id: string })[]): Promise<PropertyVideoEntity[]> {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .upsert(data as any, { onConflict: 'id' })
      .select();

    if (error) {
      this.handleError(error, 'bulkUpdate');
    }

    return result as PropertyVideoEntity[];
  }

  async bulkSoftDelete(ids: string[]): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ deleted_at: new Date().toISOString() })
      .in('id', ids)
      .is('deleted_at', null);

    if (error) {
      this.handleError(error, 'bulkSoftDelete');
    }
  }
}
