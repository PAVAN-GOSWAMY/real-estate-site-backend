import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { PropertyBrochureEntity } from "@/types/property-brochure.types";
import { CreatePropertyBrochureDto, UpdatePropertyBrochureDto, PropertyBrochureFilterDto } from "../dto/property-brochure.dto";
import { Modules } from "@/lib/constants/modules";

export class PropertyBrochureRepository extends BaseRepository<PropertyBrochureEntity, CreatePropertyBrochureDto, UpdatePropertyBrochureDto> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.PROPERTY_BROCHURES);
  }

  private get baseSelect() {
    return '*, properties(id, unit_code, slug)';
  }

  async findMany(query: PropertyBrochureFilterDto): Promise<{ data: any[]; count: number }> {
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
      q = q.or(`brochure_name.ilike.%${search}%,brochure_code.ilike.%${search}%,version.ilike.%${search}%`);
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

  async existsByBrochureCode(propertyId: string, brochureCode: string): Promise<boolean> {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select('id', { count: 'exact', head: true })
      .eq('property_id', propertyId)
      .eq('brochure_code', brochureCode)
      .is('deleted_at', null);

    if (error) {
      this.handleError(error, 'existsByBrochureCode');
    }

    return (count || 0) > 0;
  }

  async incrementDownloadCount(id: string): Promise<void> {
    // Note: Assuming Supabase RPC `increment_download_count` exists or falls back to standard update
    // For robust production, use a native postgres function to avoid race conditions.
    const { data: current } = await this.supabase
      .from(this.tableName)
      .select('download_count')
      .eq('id', id)
      .single();
      
    const currentCount = current?.download_count || 0;
      
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ download_count: currentCount + 1 })
      .eq('id', id)
      .is('deleted_at', null);

    if (error) {
      this.handleError(error, 'incrementDownloadCount');
    }
  }

  async unsetLatestVersion(propertyId: string, brochureType: string, language: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ is_latest_version: false })
      .eq('property_id', propertyId)
      .eq('brochure_type', brochureType)
      .eq('language', language)
      .eq('is_latest_version', true)
      .is('deleted_at', null);

    if (error) {
      this.handleError(error, 'unsetLatestVersion');
    }
  }

  async bulkCreate(data: CreatePropertyBrochureDto[]): Promise<PropertyBrochureEntity[]> {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .insert(data as any)
      .select();

    if (error) {
      this.handleError(error, 'bulkCreate');
    }

    return result as PropertyBrochureEntity[];
  }

  async bulkUpdate(data: (UpdatePropertyBrochureDto & { id: string })[]): Promise<PropertyBrochureEntity[]> {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .upsert(data as any, { onConflict: 'id' })
      .select();

    if (error) {
      this.handleError(error, 'bulkUpdate');
    }

    return result as PropertyBrochureEntity[];
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
