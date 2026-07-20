import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { ProjectMediaRepository } from "../repository/project-media.repository";
import { ProjectRepository } from "../../projects/repository/project.repository";
import { 
  CreateProjectMediaDto, 
  UpdateProjectMediaDto, 
  ProjectMediaFilterDto,
  BulkUploadProjectMediaDto,
  BulkUpdateProjectMediaDto,
  BulkDeleteProjectMediaDto,
  ReorderProjectMediaDto,
  ProjectMediaStatusDto
} from "../dto/project-media.dto";
import { ProjectMediaEntity } from "@/types/project-media.types";
import { NotFoundError, ConflictError, ValidationError } from "@/lib/errors/domain.error";

export class ProjectMediaService extends BaseService {
  private repository: ProjectMediaRepository;
  private projectRepository: ProjectRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new ProjectMediaRepository(supabase);
    this.projectRepository = new ProjectRepository(supabase);
  }

  /**
   * Enforces the business rule that a project can have at most one cover image.
   * If the incoming media is marked as cover, this method unsets the previous cover.
   */
  private async handleCoverSingleton(projectId: string, incomingMediaId?: string): Promise<void> {
    const currentCover = await this.repository.findCurrentCover(projectId);
    
    if (currentCover && currentCover.id !== incomingMediaId) {
      // Unset the previous cover
      await this.repository.update(currentCover.id, { is_cover: false });
    }
  }

  async createMedia(dto: CreateProjectMediaDto): Promise<ProjectMediaEntity> {
    return this.executeSafe(async () => {
      const projectExists = await this.projectRepository.exists({ id: dto.project_id });
      if (!projectExists) throw new NotFoundError("Project");

      if (dto.is_cover) {
        await this.handleCoverSingleton(dto.project_id);
      }

      return await this.repository.create(dto);
    });
  }

  async updateMedia(id: string, dto: UpdateProjectMediaDto): Promise<ProjectMediaEntity> {
    return this.executeSafe(async () => {
      const target = await this.repository.findById(id);
      if (!target) throw new NotFoundError("Project Media");

      if (dto.is_cover === true && !target.is_cover) {
        await this.handleCoverSingleton(target.project_id, id);
      }

      return await this.repository.update(id, dto);
    });
  }

  async deleteMedia(id: string): Promise<void> {
    return this.executeSafe(async () => {
      const target = await this.repository.findById(id);
      if (!target) throw new NotFoundError("Project Media");

      await this.repository.softDelete(id);
    });
  }

  async getMedia(id: string): Promise<any> {
    return this.executeSafe(async () => {
      const media = await this.repository.findByIdWithProject(id);
      if (!media) throw new NotFoundError("Project Media");
      return media;
    });
  }

  async listMedia(query: ProjectMediaFilterDto): Promise<{ data: any[]; count: number }> {
    return this.executeSafe(async () => {
      return await this.repository.findMany(query);
    });
  }

  // --- Bulk & Reorder Operations ---

  async bulkCreateMedia(dto: BulkUploadProjectMediaDto): Promise<ProjectMediaEntity[]> {
    return this.executeSafe(async () => {
      const projectExists = await this.projectRepository.exists({ id: dto.project_id });
      if (!projectExists) throw new NotFoundError("Project");

      // Validate cover rule within the payload
      const coversInPayload = dto.media.filter(m => m.is_cover);
      if (coversInPayload.length > 1) {
        throw new ValidationError("Cannot upload multiple cover images in a single bulk request.");
      }

      if (coversInPayload.length === 1) {
        await this.handleCoverSingleton(dto.project_id);
      }

      const toInsert = dto.media.map(m => ({
        project_id: dto.project_id,
        ...m
      }));

      return await this.repository.bulkCreate(toInsert as any);
    });
  }

  async bulkUpdateMedia(dto: BulkUpdateProjectMediaDto): Promise<ProjectMediaEntity[]> {
    return this.executeSafe(async () => {
      // 1. Verify existence and ownership
      for (const update of dto.updates) {
        const existing = await this.repository.findById(update.id);
        if (!existing) throw new NotFoundError(`Media ID ${update.id} not found.`);
        if (existing.project_id !== dto.project_id) {
          throw new ConflictError(`Media ID ${update.id} does not belong to Project ID ${dto.project_id}.`);
        }
      }

      // 2. Validate cover logic
      const coversInUpdates = dto.updates.filter(m => m.is_cover === true);
      if (coversInUpdates.length > 1) {
        throw new ValidationError("Cannot set multiple cover images simultaneously.");
      }
      if (coversInUpdates.length === 1) {
        await this.handleCoverSingleton(dto.project_id, coversInUpdates[0].id);
      }

      // 3. Construct updates
      const finalUpdates = await Promise.all(dto.updates.map(async (u) => {
        const current = await this.repository.findById(u.id);
        return { ...current, ...u } as any;
      }));

      return await this.repository.bulkUpdate(finalUpdates);
    });
  }

  async bulkDeleteMedia(dto: BulkDeleteProjectMediaDto): Promise<void> {
    return this.executeSafe(async () => {
      for (const id of dto.ids) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundError(`Media ID ${id} not found.`);
        if (existing.project_id !== dto.project_id) {
           throw new ConflictError(`Media ID ${id} does not belong to Project ID ${dto.project_id}.`);
        }
      }

      await this.repository.bulkSoftDelete(dto.ids);
    });
  }

  async reorderMedia(dto: ReorderProjectMediaDto): Promise<void> {
    return this.executeSafe(async () => {
      for (const item of dto.items) {
        const existing = await this.repository.findById(item.id);
        if (!existing) throw new NotFoundError(`Media ID ${item.id} not found.`);
        if (existing.project_id !== dto.project_id) {
           throw new ConflictError(`Media ID ${item.id} does not belong to Project ID ${dto.project_id}.`);
        }
      }

      // Perform a bulk upsert for reordering
      const updates = await Promise.all(dto.items.map(async (item) => {
        const current = await this.repository.findById(item.id);
        return { ...current, display_order: item.display_order };
      }));

      await this.repository.bulkUpdate(updates);
    });
  }

  async updateStatus(id: string, dto: ProjectMediaStatusDto): Promise<ProjectMediaEntity> {
    return this.executeSafe(async () => {
      const target = await this.repository.findById(id);
      if (!target) throw new NotFoundError("Project Media");

      if (dto.is_cover === true && !target.is_cover) {
        await this.handleCoverSingleton(target.project_id, id);
      }

      return await this.repository.update(id, dto);
    });
  }
}
