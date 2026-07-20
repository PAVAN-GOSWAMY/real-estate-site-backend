import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { BuilderRepository } from "../repository/builder.repository";
import { CreateBuilderDto, UpdateBuilderDto, BuilderFilterDto } from "../dto/builder.dto";
import { BuilderEntity } from "@/types/builder.types";
import { ConflictError, NotFoundError, BusinessRuleError } from "@/lib/errors/domain.error";

export class BuilderService extends BaseService {
  private repository: BuilderRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new BuilderRepository(supabase);
  }

  async createBuilder(dto: CreateBuilderDto): Promise<BuilderEntity> {
    return this.executeSafe(async () => {
      // 1. Validate slug uniqueness
      const existingSlug = await this.repository.findBySlug(dto.slug);
      if (existingSlug) {
        throw new ConflictError(`A builder with slug '${dto.slug}' already exists.`);
      }

      // 2. Validate name uniqueness (from schema uq_builders_name)
      const existingName = await this.repository.findByName(dto.name);
      if (existingName) {
        throw new ConflictError(`A builder with name '${dto.name}' already exists.`);
      }

      // 3. Create the builder
      return await this.repository.create(dto);
    });
  }

  async updateBuilder(id: string, dto: UpdateBuilderDto): Promise<BuilderEntity> {
    return this.executeSafe(async () => {
      // 1. Ensure target exists
      const target = await this.repository.findById(id);
      if (!target) {
        throw new NotFoundError("Builder");
      }

      // 2. Validate slug uniqueness if slug is being updated
      if (dto.slug && dto.slug !== target.slug) {
        const existingSlug = await this.repository.findBySlug(dto.slug);
        if (existingSlug) {
          throw new ConflictError(`A builder with slug '${dto.slug}' already exists.`);
        }
      }

      // 3. Validate name uniqueness if name is being updated
      if (dto.name && dto.name.toLowerCase() !== target.name.toLowerCase()) {
        const existingName = await this.repository.findByName(dto.name);
        if (existingName) {
          throw new ConflictError(`A builder with name '${dto.name}' already exists.`);
        }
      }

      // 4. Update the builder
      return await this.repository.update(id, dto);
    });
  }

  async getBuilder(id: string): Promise<BuilderEntity> {
    return this.executeSafe(async () => {
      const builder = await this.repository.findById(id);
      if (!builder) {
        throw new NotFoundError("Builder");
      }
      return builder;
    });
  }

  async listBuilders(query: BuilderFilterDto): Promise<{ data: BuilderEntity[]; count: number }> {
    return this.executeSafe(async () => {
      return await this.repository.findMany(query);
    });
  }

  async deleteBuilder(id: string): Promise<void> {
    return this.executeSafe(async () => {
      const target = await this.repository.findById(id);
      if (!target) {
        throw new NotFoundError("Builder");
      }

      // Note: In future phases, we might want to check if the builder is 
      // linked to active properties before allowing deletion to prevent orphaned properties.
      // For now, we perform the soft delete.
      await this.repository.softDelete(id);
    });
  }
}
