import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { ProjectTowerEntity } from "@/types/project-tower.types";
import { CreateProjectTowerDto, UpdateProjectTowerDto, ProjectTowerFilterDto } from "../dto/project-tower.dto";
import { Modules } from "@/lib/constants/modules";

export class ProjectTowerRepository extends BaseRepository<ProjectTowerEntity, CreateProjectTowerDto, UpdateProjectTowerDto> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.PROJECT_TOWERS);
  }

  async findMany(query: ProjectTowerFilterDto): Promise<{ data: any[]; count: number }> {
    const { page, limit, sort, order, search, ...filters } = query;
    const offset = (page! - 1) * limit!;

    let q = this.supabase
      .from(this.tableName)
      .select('*, projects!inner(id, project_name, project_code, slug)', { count: 'exact' })
      .is('deleted_at', null);

    // Apply strict filtering
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        q = q.eq(key, value);
      }
    });

    // Apply search
    if (search) {
      q = q.or(`tower_name.ilike.%${search}%,tower_code.ilike.%${search}%,slug.ilike.%${search}%,short_description.ilike.%${search}%,seo_title.ilike.%${search}%,seo_keywords.ilike.%${search}%`);
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

  async findByIdWithProject(id: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*, projects(id, project_name, project_code, slug)')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'findByIdWithProject');
    }

    return data;
  }

  async findByProjectAndSlug(projectId: string, slug: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*, projects(id, project_name, project_code, slug)')
      .eq('project_id', projectId)
      .eq('slug', slug)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'findByProjectAndSlug');
    }

    return data;
  }

  async findByProjectAndCode(projectId: string, towerCode: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*, projects(id, project_name, project_code, slug)')
      .eq('project_id', projectId)
      .eq('tower_code', towerCode)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'findByProjectAndCode');
    }

    return data;
  }
}
