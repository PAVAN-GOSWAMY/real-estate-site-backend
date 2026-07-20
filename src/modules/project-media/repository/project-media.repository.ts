import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { ProjectMediaEntity } from "@/types/project-media.types";
import { CreateProjectMediaDto, UpdateProjectMediaDto, ProjectMediaFilterDto } from "../dto/project-media.dto";
import { Modules } from "@/lib/constants/modules";

export class ProjectMediaRepository extends BaseRepository<ProjectMediaEntity, CreateProjectMediaDto, UpdateProjectMediaDto> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.PROJECT_MEDIA);
  }

  async findMany(query: ProjectMediaFilterDto): Promise<{ data: any[]; count: number }> {
    const { page, limit, sort, order, search, ...filters } = query;
    const offset = (page! - 1) * limit!;

    let q = this.supabase
      .from(this.tableName)
      .select('*, projects(id, project_name)', { count: 'exact' })
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

  async findByIdWithProject(id: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*, projects(id, project_name)')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'findByIdWithProject');
    }

    return data;
  }

  async findCurrentCover(projectId: string): Promise<ProjectMediaEntity | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('project_id', projectId)
      .eq('is_cover', true)
      .is('deleted_at', null)
      .maybeSingle();

    if (error) {
      this.handleError(error, 'findCurrentCover');
    }

    return data as ProjectMediaEntity | null;
  }

  async bulkCreate(data: CreateProjectMediaDto[]): Promise<ProjectMediaEntity[]> {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .insert(data as any)
      .select();

    if (error) {
      this.handleError(error, 'bulkCreate');
    }

    return result as ProjectMediaEntity[];
  }

  async bulkUpdate(data: any[]): Promise<ProjectMediaEntity[]> {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .upsert(data, { onConflict: 'id' })
      .select();

    if (error) {
      this.handleError(error, 'bulkUpdate');
    }

    return result as ProjectMediaEntity[];
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
