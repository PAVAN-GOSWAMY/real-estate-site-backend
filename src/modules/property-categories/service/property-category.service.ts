import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { PropertyCategoryRepository } from "../repository/property-category.repository";
import { CreatePropertyCategoryDto, UpdatePropertyCategoryDto, PropertyCategoryFilterDto } from "../dto/property-category.dto";
import { PropertyCategoryEntity } from "@/types/property-category.types";
import { ConflictError, NotFoundError } from "@/lib/errors/domain.error";

export class PropertyCategoryService extends BaseService {
  private repository: PropertyCategoryRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new PropertyCategoryRepository(supabase);
  }

  async createCategory(dto: CreatePropertyCategoryDto): Promise<PropertyCategoryEntity> {
    return this.executeSafe(async () => {
      // 1. Validate slug uniqueness
      const existingSlug = await this.repository.findBySlug(dto.slug);
      if (existingSlug) {
        throw new ConflictError(`A category with slug '${dto.slug}' already exists.`);
      }

      // 2. Validate name uniqueness
      const existingName = await this.repository.findByName(dto.name);
      if (existingName) {
        throw new ConflictError(`A category with name '${dto.name}' already exists.`);
      }

      // 3. Create the category
      return await this.repository.create(dto);
    });
  }

  async updateCategory(id: string, dto: UpdatePropertyCategoryDto): Promise<PropertyCategoryEntity> {
    return this.executeSafe(async () => {
      // 1. Ensure target exists
      const target = await this.repository.findById(id);
      if (!target) {
        throw new NotFoundError("Property Category");
      }

      // 2. Validate slug uniqueness if slug is being updated
      if (dto.slug && dto.slug !== target.slug) {
        const existingSlug = await this.repository.findBySlug(dto.slug);
        if (existingSlug) {
          throw new ConflictError(`A category with slug '${dto.slug}' already exists.`);
        }
      }

      // 3. Validate name uniqueness if name is being updated
      if (dto.name && dto.name.toLowerCase() !== target.name.toLowerCase()) {
        const existingName = await this.repository.findByName(dto.name);
        if (existingName) {
          throw new ConflictError(`A category with name '${dto.name}' already exists.`);
        }
      }

      // 4. Update the category
      return await this.repository.update(id, dto);
    });
  }

  async getCategory(id: string): Promise<PropertyCategoryEntity> {
    return this.executeSafe(async () => {
      const category = await this.repository.findById(id);
      if (!category) {
        throw new NotFoundError("Property Category");
      }
      return category;
    });
  }

  async listCategories(query: PropertyCategoryFilterDto): Promise<{ data: PropertyCategoryEntity[]; count: number }> {
    return this.executeSafe(async () => {
      return await this.repository.findMany(query);
    });
  }

  async deleteCategory(id: string): Promise<void> {
    return this.executeSafe(async () => {
      const target = await this.repository.findById(id);
      if (!target) {
        throw new NotFoundError("Property Category");
      }

      await this.repository.softDelete(id);
    });
  }
}
