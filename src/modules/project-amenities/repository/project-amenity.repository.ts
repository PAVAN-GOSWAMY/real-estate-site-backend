import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { ProjectAmenityEntity } from "@/types/project-amenity.types";
import { AssignProjectAmenityDto, UpdateProjectAmenityDto, ProjectAmenityFilterDto } from "../dto/project-amenity.dto";
import { Modules } from "@/lib/constants/modules";

export class ProjectAmenityRepository extends BaseRepository<ProjectAmenityEntity, AssignProjectAmenityDto, UpdateProjectAmenityDto> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.PROJECT_AMENITIES);
  }

  async findMany(query: ProjectAmenityFilterDto): Promise<{ data: any[]; count: number }> {
    const { page, limit, sort, order, search, ...filters } = query;
    const offset = (page! - 1) * limit!;

    let q = this.supabase
      .from(this.tableName)
      .select('*, projects!inner(id, project_name), amenities!inner(id, name, icon_name, is_premium)', { count: 'exact' })
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
      .select('*, projects(id, project_name), amenities(id, name, icon_name, is_premium)')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'findByIdWithRelations');
    }

    return data;
  }

  async existsByProjectAndAmenity(projectId: string, amenityId: string): Promise<boolean> {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select('id', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .eq('amenity_id', amenityId)
      .is('deleted_at', null);

    if (error) {
      this.handleError(error, 'existsByProjectAndAmenity');
    }

    return (count || 0) > 0;
  }

  async bulkCreate(data: AssignProjectAmenityDto[]): Promise<ProjectAmenityEntity[]> {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .insert(data as any)
      .select();

    if (error) {
      this.handleError(error, 'bulkCreate');
    }

    return result as ProjectAmenityEntity[];
  }

  async bulkUpdate(data: (UpdateProjectAmenityDto & { id: string })[]): Promise<ProjectAmenityEntity[]> {
    // Supabase JS does not natively support bulk update via .update() array without upsert logic.
    // Using upsert based on primary key 'id' to achieve bulk update.
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .upsert(data as any, { onConflict: 'id' })
      .select();

    if (error) {
      this.handleError(error, 'bulkUpdate');
    }

    return result as ProjectAmenityEntity[];
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
