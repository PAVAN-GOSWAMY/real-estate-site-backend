import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { PropertyConfigurationRepository } from "../repository/property-configuration.repository";
import { CreatePropertyConfigurationDto, UpdatePropertyConfigurationDto, PropertyConfigurationFilterDto } from "../dto/property-configuration.dto";
import { PropertyConfigurationEntity } from "@/types/property-configuration.types";
import { ConflictError, NotFoundError } from "@/lib/errors/domain.error";

export class PropertyConfigurationService extends BaseService {
  private repository: PropertyConfigurationRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new PropertyConfigurationRepository(supabase);
  }

  async createConfiguration(dto: CreatePropertyConfigurationDto): Promise<PropertyConfigurationEntity> {
    return this.executeSafe(async () => {
      // 1. Validate slug uniqueness
      const existingSlug = await this.repository.findBySlug(dto.slug);
      if (existingSlug) {
        throw new ConflictError(`A configuration with slug '${dto.slug}' already exists.`);
      }

      // 2. Validate name uniqueness
      const existingName = await this.repository.findByName(dto.name);
      if (existingName) {
        throw new ConflictError(`A configuration with name '${dto.name}' already exists.`);
      }

      // 3. Create the configuration
      return await this.repository.create(dto);
    });
  }

  async updateConfiguration(id: string, dto: UpdatePropertyConfigurationDto): Promise<PropertyConfigurationEntity> {
    return this.executeSafe(async () => {
      // 1. Ensure target exists
      const target = await this.repository.findById(id);
      if (!target) {
        throw new NotFoundError("Property Configuration");
      }

      // 2. Validate slug uniqueness if slug is being updated
      if (dto.slug && dto.slug !== target.slug) {
        const existingSlug = await this.repository.findBySlug(dto.slug);
        if (existingSlug) {
          throw new ConflictError(`A configuration with slug '${dto.slug}' already exists.`);
        }
      }

      // 3. Validate name uniqueness if name is being updated
      if (dto.name && dto.name.toLowerCase() !== target.name.toLowerCase()) {
        const existingName = await this.repository.findByName(dto.name);
        if (existingName) {
          throw new ConflictError(`A configuration with name '${dto.name}' already exists.`);
        }
      }

      // 4. Update the configuration
      return await this.repository.update(id, dto);
    });
  }

  async getConfiguration(id: string): Promise<PropertyConfigurationEntity> {
    return this.executeSafe(async () => {
      const configuration = await this.repository.findById(id);
      if (!configuration) {
        throw new NotFoundError("Property Configuration");
      }
      return configuration;
    });
  }

  async listConfigurations(query: PropertyConfigurationFilterDto): Promise<{ data: PropertyConfigurationEntity[]; count: number }> {
    return this.executeSafe(async () => {
      return await this.repository.findMany(query);
    });
  }

  async deleteConfiguration(id: string): Promise<void> {
    return this.executeSafe(async () => {
      const target = await this.repository.findById(id);
      if (!target) {
        throw new NotFoundError("Property Configuration");
      }

      await this.repository.softDelete(id);
    });
  }
}
