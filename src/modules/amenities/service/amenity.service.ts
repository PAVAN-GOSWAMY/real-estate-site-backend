import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { AmenityRepository } from "../repository/amenity.repository";
import { CreateAmenityDto, UpdateAmenityDto, AmenityFilterDto } from "../dto/amenity.dto";
import { AmenityEntity } from "@/types/amenity.types";
import { ConflictError, NotFoundError } from "@/lib/errors/domain.error";

export class AmenityService extends BaseService {
  private repository: AmenityRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new AmenityRepository(supabase);
  }

  async createAmenity(dto: CreateAmenityDto): Promise<AmenityEntity> {
    return this.executeSafe(async () => {
      // 1. Validate slug uniqueness
      const existingSlug = await this.repository.findBySlug(dto.slug);
      if (existingSlug) {
        throw new ConflictError(`An amenity with slug '${dto.slug}' already exists.`);
      }

      // 2. Validate name uniqueness
      const existingName = await this.repository.findByName(dto.name);
      if (existingName) {
        throw new ConflictError(`An amenity with name '${dto.name}' already exists.`);
      }

      // 3. Create the amenity
      return await this.repository.create(dto);
    });
  }

  async updateAmenity(id: string, dto: UpdateAmenityDto): Promise<AmenityEntity> {
    return this.executeSafe(async () => {
      // 1. Ensure target exists
      const target = await this.repository.findById(id);
      if (!target) {
        throw new NotFoundError("Amenity");
      }

      // 2. Validate slug uniqueness if slug is being updated
      if (dto.slug && dto.slug !== target.slug) {
        const existingSlug = await this.repository.findBySlug(dto.slug);
        if (existingSlug) {
          throw new ConflictError(`An amenity with slug '${dto.slug}' already exists.`);
        }
      }

      // 3. Validate name uniqueness if name is being updated
      if (dto.name && dto.name.toLowerCase() !== target.name.toLowerCase()) {
        const existingName = await this.repository.findByName(dto.name);
        if (existingName) {
          throw new ConflictError(`An amenity with name '${dto.name}' already exists.`);
        }
      }

      // 4. Update the amenity
      return await this.repository.update(id, dto);
    });
  }

  async getAmenity(id: string): Promise<AmenityEntity> {
    return this.executeSafe(async () => {
      const amenity = await this.repository.findById(id);
      if (!amenity) {
        throw new NotFoundError("Amenity");
      }
      return amenity;
    });
  }

  async listAmenities(query: AmenityFilterDto): Promise<{ data: AmenityEntity[]; count: number }> {
    return this.executeSafe(async () => {
      return await this.repository.findMany(query);
    });
  }

  async deleteAmenity(id: string): Promise<void> {
    return this.executeSafe(async () => {
      const target = await this.repository.findById(id);
      if (!target) {
        throw new NotFoundError("Amenity");
      }

      await this.repository.softDelete(id);
    });
  }
}
