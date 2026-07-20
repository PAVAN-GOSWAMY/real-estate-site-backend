import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { LocationRepository } from "../repository/location.repository";
import { CreateLocationDto, UpdateLocationDto, LocationFilterDto } from "../dto/location.dto";
import { LocationEntity } from "@/types/location.types";
import { ConflictError, BusinessRuleError, NotFoundError } from "@/lib/errors/domain.error";

export class LocationService extends BaseService {
  private repository: LocationRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new LocationRepository(supabase);
  }

  async createLocation(dto: CreateLocationDto): Promise<LocationEntity> {
    return this.executeSafe(async () => {
      // 1. Validate slug uniqueness
      const existing = await this.repository.findBySlug(dto.slug);
      if (existing) {
        throw new ConflictError(`A location with slug '${dto.slug}' already exists.`);
      }

      // 2. Validate parent exists (if provided)
      if (dto.parent_location_id) {
        const parent = await this.repository.findById(dto.parent_location_id);
        if (!parent) {
          throw new BusinessRuleError("Provided parent_location_id does not exist.");
        }
      }

      // 3. Create the location
      return await this.repository.create(dto);
    });
  }

  async updateLocation(id: string, dto: UpdateLocationDto): Promise<LocationEntity> {
    return this.executeSafe(async () => {
      // 1. Ensure target exists
      const target = await this.repository.findById(id);
      if (!target) {
        throw new NotFoundError("Location");
      }

      // 2. Prevent circular reference
      if (dto.parent_location_id === id) {
        throw new BusinessRuleError("A location cannot be its own parent.");
      }

      // 3. Validate slug uniqueness if slug is being updated
      if (dto.slug && dto.slug !== target.slug) {
        const existing = await this.repository.findBySlug(dto.slug);
        if (existing) {
          throw new ConflictError(`A location with slug '${dto.slug}' already exists.`);
        }
      }

      // 4. Update the location
      return await this.repository.update(id, dto);
    });
  }

  async getLocation(id: string): Promise<LocationEntity> {
    return this.executeSafe(async () => {
      const location = await this.repository.findById(id);
      if (!location) {
        throw new NotFoundError("Location");
      }
      return location;
    });
  }

  async listLocations(query: LocationFilterDto): Promise<{ data: LocationEntity[]; count: number }> {
    return this.executeSafe(async () => {
      return await this.repository.findMany(query);
    });
  }

  async deleteLocation(id: string): Promise<void> {
    return this.executeSafe(async () => {
      // 1. Check if it exists
      const target = await this.repository.findById(id);
      if (!target) {
        throw new NotFoundError("Location");
      }

      // 2. Check if it has active children. If so, soft delete should cascade 
      // or be prevented. The architecture (Phase 3.3.1) says "ON DELETE SET NULL", 
      // but that's for hard deletes. For soft deletes, we should prevent it 
      // to maintain data integrity, or manually soft-delete children.
      // We will prevent it as a business rule.
      const hasChildren = await this.repository.exists({ parent_location_id: id });
      if (hasChildren) {
        throw new BusinessRuleError("Cannot delete a location that has child locations. Please reassign them first.");
      }

      // 3. Soft delete
      await this.repository.softDelete(id);
    });
  }
}
