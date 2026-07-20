import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { PropertyImageEntity } from "@/types/property-image.types";
import { CreatePropertyImageDto, UpdatePropertyImageDto, PropertyImageFilterDto } from "../dto/property-image.dto";
import { Modules } from "@/lib/constants/modules";

export class PropertyImageRepository extends BaseRepository<PropertyImageEntity, CreatePropertyImageDto, UpdatePropertyImageDto> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.PROPERTY_IMAGES);
  }

  private get baseSelect() {
    return '*, properties(id, unit_code, slug)';
  }

  async findMany(query: PropertyImageFilterDto): Promise<{ data: any[]; count: number }> {
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
      q = q.or(`title.ilike.%${search}%,description.ilike.%${search}%,alt_text.ilike.%${search}%`);
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

  async bulkCreate(data: CreatePropertyImageDto[]): Promise<PropertyImageEntity[]> {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .insert(data as any)
      .select();

    if (error) {
      this.handleError(error, 'bulkCreate');
    }

    return result as PropertyImageEntity[];
  }

  async bulkUpdate(data: (UpdatePropertyImageDto & { id: string })[]): Promise<PropertyImageEntity[]> {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .upsert(data as any, { onConflict: 'id' })
      .select();

    if (error) {
      this.handleError(error, 'bulkUpdate');
    }

    return result as PropertyImageEntity[];
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

  async unsetCoverImage(propertyId: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ is_cover: false })
      .eq('property_id', propertyId)
      .eq('is_cover', true)
      .is('deleted_at', null);

    if (error) {
      this.handleError(error, 'unsetCoverImage');
    }
  }
}
