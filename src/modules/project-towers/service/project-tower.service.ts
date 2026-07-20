import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { ProjectTowerRepository } from "../repository/project-tower.repository";
import { ProjectRepository } from "../../projects/repository/project.repository";
import { CreateProjectTowerDto, UpdateProjectTowerDto, ProjectTowerFilterDto } from "../dto/project-tower.dto";
import { ProjectTowerEntity } from "@/types/project-tower.types";
import { ConflictError, NotFoundError } from "@/lib/errors/domain.error";

export class ProjectTowerService extends BaseService {
  private repository: ProjectTowerRepository;
  private projectRepository: ProjectRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new ProjectTowerRepository(supabase);
    this.projectRepository = new ProjectRepository(supabase);
  }

  async createTower(dto: CreateProjectTowerDto): Promise<ProjectTowerEntity> {
    return this.executeSafe(async () => {
      // 1. Validate parent project exists
      const projectExists = await this.projectRepository.exists({ id: dto.project_id });
      if (!projectExists) {
        throw new NotFoundError("Project");
      }

      // 2. Validate composite uniqueness (project_id + slug)
      const existingSlug = await this.repository.findByProjectAndSlug(dto.project_id, dto.slug);
      if (existingSlug) {
        throw new ConflictError(`Tower with slug '${dto.slug}' already exists in this project.`);
      }

      // 3. Validate composite uniqueness (project_id + tower_code)
      const existingCode = await this.repository.findByProjectAndCode(dto.project_id, dto.tower_code);
      if (existingCode) {
        throw new ConflictError(`Tower with code '${dto.tower_code}' already exists in this project.`);
      }

      // 4. Create the tower
      return await this.repository.create(dto);
    });
  }

  async updateTower(id: string, dto: UpdateProjectTowerDto): Promise<ProjectTowerEntity> {
    return this.executeSafe(async () => {
      // 1. Ensure target tower exists
      const target = await this.repository.findById(id);
      if (!target) {
        throw new NotFoundError("Project Tower");
      }

      const projectId = dto.project_id || target.project_id;

      // 2. If moving to a different project, validate new project exists
      if (dto.project_id && dto.project_id !== target.project_id) {
        const projectExists = await this.projectRepository.exists({ id: dto.project_id });
        if (!projectExists) {
          throw new NotFoundError("Project");
        }
      }

      // 3. Validate composite uniqueness if slug or project changes
      if ((dto.slug && dto.slug !== target.slug) || (dto.project_id && dto.project_id !== target.project_id)) {
        const checkSlug = dto.slug || target.slug;
        const existingSlug = await this.repository.findByProjectAndSlug(projectId, checkSlug);
        if (existingSlug && existingSlug.id !== id) {
          throw new ConflictError(`Tower with slug '${checkSlug}' already exists in this project.`);
        }
      }

      // 4. Validate composite uniqueness if code or project changes
      if ((dto.tower_code && dto.tower_code !== target.tower_code) || (dto.project_id && dto.project_id !== target.project_id)) {
        const checkCode = dto.tower_code || target.tower_code;
        const existingCode = await this.repository.findByProjectAndCode(projectId, checkCode);
        if (existingCode && existingCode.id !== id) {
          throw new ConflictError(`Tower with code '${checkCode}' already exists in this project.`);
        }
      }

      // 5. Update the tower
      return await this.repository.update(id, dto);
    });
  }

  async getTower(id: string): Promise<any> {
    return this.executeSafe(async () => {
      const tower = await this.repository.findByIdWithProject(id);
      if (!tower) {
        throw new NotFoundError("Project Tower");
      }
      return tower;
    });
  }

  async getTowerByProjectAndSlug(projectId: string, slug: string): Promise<any> {
    return this.executeSafe(async () => {
      const tower = await this.repository.findByProjectAndSlug(projectId, slug);
      if (!tower) {
        throw new NotFoundError("Project Tower");
      }
      return tower;
    });
  }

  async listTowers(query: ProjectTowerFilterDto): Promise<{ data: any[]; count: number }> {
    return this.executeSafe(async () => {
      return await this.repository.findMany(query);
    });
  }

  async deleteTower(id: string): Promise<void> {
    return this.executeSafe(async () => {
      const target = await this.repository.findById(id);
      if (!target) {
        throw new NotFoundError("Project Tower");
      }

      await this.repository.softDelete(id);
    });
  }
}
