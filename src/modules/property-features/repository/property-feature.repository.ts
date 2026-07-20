import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { PropertyFeatureAssignmentEntity } from "@/types/property-feature.types";
import { AssignPropertyFeatureDto, UpdatePropertyFeatureDto, PropertyFeatureFilterDto } from "../dto/property-feature.dto";
import { Modules } from "@/lib/constants/modules";

export class PropertyFeatureRepository extends BaseRepository<PropertyFeatureAssignmentEntity, AssignPropertyFeatureDto, UpdatePropertyFeatureDto> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.PROPERTY_FEATURES);
  }

  async findMany(query: PropertyFeatureFilterDto): Promise<{ data: any[]; count: number }> {
    const { page, limit, sort, order, search, ...filters } = query;
    const offset = (page! - 1) * limit!;

    // properties and property_features are the related table names
    let q = this.supabase
      .from(this.tableName)
      .select('*, properties!inner(id), property_features!inner(id, name, icon_name, theme_color, is_premium)', { count: 'exact' })
      .is('deleted_at', null);

    // Apply strict filtering
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        q = q.eq(key, value);
      }
    });

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
      .select('*, properties(id), property_features(id, name, icon_name, theme_color, is_premium)')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'findByIdWithRelations');
    }

    return data;
  }

  async existsByPropertyAndFeature(propertyId: string, featureId: string): Promise<boolean> {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select('id', { count: 'exact', head: true })
      .eq('property_id', propertyId)
      .eq('feature_id', featureId)
      .is('deleted_at', null);

    if (error) {
      this.handleError(error, 'existsByPropertyAndFeature');
    }

    return (count || 0) > 0;
  }

  async bulkCreate(data: AssignPropertyFeatureDto[]): Promise<PropertyFeatureAssignmentEntity[]> {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .insert(data as any)
      .select();

    if (error) {
      this.handleError(error, 'bulkCreate');
    }

    return result as PropertyFeatureAssignmentEntity[];
  }

  async bulkUpdate(data: (UpdatePropertyFeatureDto & { id: string })[]): Promise<PropertyFeatureAssignmentEntity[]> {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .upsert(data as any, { onConflict: 'id' })
      .select();

    if (error) {
      this.handleError(error, 'bulkUpdate');
    }

    return result as PropertyFeatureAssignmentEntity[];
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
