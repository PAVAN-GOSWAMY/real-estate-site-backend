import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { PropertyEntity } from "@/types/property.types";
import { CreatePropertyDto, UpdatePropertyDto, PropertyFilterDto } from "../dto/property.dto";
import { Modules } from "@/lib/constants/modules";

export class PropertyRepository extends BaseRepository<PropertyEntity, CreatePropertyDto, UpdatePropertyDto> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.PROPERTIES);
  }

  private get baseSelect() {
    return '*, project_towers(id, tower_name, projects(id, project_name)), property_configurations(id, name, property_categories(id, name))';
  }

  async findMany(query: PropertyFilterDto): Promise<{ data: any[]; count: number }> {
    const { page, limit, sort, order, search, min_price, max_price, min_area, max_area, bedrooms, ...filters } = query;
    const offset = (page! - 1) * limit!;

    let q = this.supabase
      .from(this.tableName)
      .select(this.baseSelect, { count: 'exact' })
      .is('deleted_at', null);

    // Exact match filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        q = q.eq(key, value);
      }
    });

    // Range queries
    if (min_price !== undefined) q = q.gte('price', min_price);
    if (max_price !== undefined) q = q.lte('price', max_price);
    if (min_area !== undefined) q = q.gte('carpet_area', min_area);
    if (max_area !== undefined) q = q.lte('carpet_area', max_area);
    
    // Additional exact match
    if (bedrooms !== undefined) q = q.eq('bedrooms', bedrooms);

    // Search (unit_code, listing_title, slug)
    if (search) {
      q = q.or(`unit_code.ilike.%${search}%,listing_title.ilike.%${search}%,slug.ilike.%${search}%`);
    }

    // Apply pagination
    q = q.range(offset, offset + limit! - 1);

    // Apply sorting
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

  async findBySlugWithRelations(slug: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(this.baseSelect)
      .eq('slug', slug)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'findBySlugWithRelations');
    }

    return data;
  }

  async existsByTowerAndUnitNumber(towerId: string, unitNumber: string): Promise<boolean> {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select('id', { count: 'exact', head: true })
      .eq('tower_id', towerId)
      .eq('unit_number', unitNumber)
      .is('deleted_at', null);

    if (error) {
      this.handleError(error, 'existsByTowerAndUnitNumber');
    }

    return (count || 0) > 0;
  }

  async existsByUnitCode(unitCode: string): Promise<boolean> {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select('id', { count: 'exact', head: true })
      .eq('unit_code', unitCode)
      .is('deleted_at', null);

    if (error) {
      this.handleError(error, 'existsByUnitCode');
    }

    return (count || 0) > 0;
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select('id', { count: 'exact', head: true })
      .eq('slug', slug)
      .is('deleted_at', null);

    if (error) {
      this.handleError(error, 'existsBySlug');
    }

    return (count || 0) > 0;
  }

  async bulkCreate(data: CreatePropertyDto[]): Promise<PropertyEntity[]> {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .insert(data as any)
      .select();

    if (error) {
      this.handleError(error, 'bulkCreate');
    }

    return result as PropertyEntity[];
  }

  async bulkUpdate(data: (UpdatePropertyDto & { id: string })[]): Promise<PropertyEntity[]> {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .upsert(data as any, { onConflict: 'id' })
      .select();

    if (error) {
      this.handleError(error, 'bulkUpdate');
    }

    return result as PropertyEntity[];
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
