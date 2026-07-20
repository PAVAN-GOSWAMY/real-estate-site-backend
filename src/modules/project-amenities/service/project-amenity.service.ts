import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { ProjectAmenityRepository } from "../repository/project-amenity.repository";
import { ProjectRepository } from "../../projects/repository/project.repository";
import { AmenityRepository } from "../../amenities/repository/amenity.repository";
import { 
  AssignProjectAmenityDto, 
  UpdateProjectAmenityDto, 
  ProjectAmenityFilterDto,
  BulkAssignProjectAmenitiesDto,
  BulkUpdateProjectAmenitiesDto,
  BulkDeleteProjectAmenitiesDto
} from "../dto/project-amenity.dto";
import { ProjectAmenityEntity } from "@/types/project-amenity.types";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/errors/domain.error";

export class ProjectAmenityService extends BaseService {
  private repository: ProjectAmenityRepository;
  private projectRepository: ProjectRepository;
  private amenityRepository: AmenityRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new ProjectAmenityRepository(supabase);
    this.projectRepository = new ProjectRepository(supabase);
    this.amenityRepository = new AmenityRepository(supabase);
  }

  async assignAmenity(dto: AssignProjectAmenityDto): Promise<ProjectAmenityEntity> {
    return this.executeSafe(async () => {
      // 1. Validate parent project exists
      const projectExists = await this.projectRepository.exists({ id: dto.project_id });
      if (!projectExists) throw new NotFoundError("Project");

      // 2. Validate amenity exists
      const amenity = await this.amenityRepository.findById(dto.amenity_id);
      if (!amenity) throw new NotFoundError("Amenity");

      // 3. Prevent duplicate assignment
      const exists = await this.repository.existsByProjectAndAmenity(dto.project_id, dto.amenity_id);
      if (exists) {
        throw new ConflictError("This amenity is already assigned to the project.");
      }

      return await this.repository.create(dto);
    });
  }

  async updateAssignment(id: string, dto: UpdateProjectAmenityDto): Promise<ProjectAmenityEntity> {
    return this.executeSafe(async () => {
      const target = await this.repository.findById(id);
      if (!target) throw new NotFoundError("Project Amenity Assignment");

      return await this.repository.update(id, dto);
    });
  }

  async removeAssignment(id: string): Promise<void> {
    return this.executeSafe(async () => {
      const target = await this.repository.findById(id);
      if (!target) throw new NotFoundError("Project Amenity Assignment");

      await this.repository.softDelete(id);
    });
  }

  async getAssignment(id: string): Promise<any> {
    return this.executeSafe(async () => {
      const assignment = await this.repository.findByIdWithRelations(id);
      if (!assignment) throw new NotFoundError("Project Amenity Assignment");
      return assignment;
    });
  }

  async listAssignments(query: ProjectAmenityFilterDto): Promise<{ data: any[]; count: number }> {
    return this.executeSafe(async () => {
      return await this.repository.findMany(query);
    });
  }

  // --- Bulk Operations ---

  async bulkAssignAmenities(dto: BulkAssignProjectAmenitiesDto): Promise<ProjectAmenityEntity[]> {
    return this.executeSafe(async () => {
      const projectExists = await this.projectRepository.exists({ id: dto.project_id });
      if (!projectExists) throw new NotFoundError("Project");

      // 1. Check for duplicates within the request payload
      const amenityIds = dto.assignments.map(a => a.amenity_id);
      if (new Set(amenityIds).size !== amenityIds.length) {
        throw new ValidationError("Duplicate amenity IDs found within the request payload.");
      }

      // 2. Validate all amenities exist in the DB (can be optimized with an 'in' query, but looping is okay for small batches)
      for (const amenityId of amenityIds) {
        const amenity = await this.amenityRepository.findById(amenityId);
        if (!amenity) throw new NotFoundError(`Amenity ID ${amenityId} not found.`);
      }

      // 3. Check for existing conflicts in the DB
      for (const amenityId of amenityIds) {
        const exists = await this.repository.existsByProjectAndAmenity(dto.project_id, amenityId);
        if (exists) {
          throw new ConflictError(`Amenity ID ${amenityId} is already assigned to this project.`);
        }
      }

      // 4. Map DTO to entities and insert
      const toInsert = dto.assignments.map(a => ({
        project_id: dto.project_id,
        ...a
      }));

      return await this.repository.bulkCreate(toInsert);
    });
  }

  async bulkUpdateAmenities(dto: BulkUpdateProjectAmenitiesDto): Promise<ProjectAmenityEntity[]> {
    return this.executeSafe(async () => {
      // 1. Check if all target IDs exist and belong to the project
      for (const update of dto.updates) {
        const existing = await this.repository.findById(update.id);
        if (!existing) throw new NotFoundError(`Junction ID ${update.id} not found.`);
        if (existing.project_id !== dto.project_id) {
          throw new ConflictError(`Junction ID ${update.id} does not belong to Project ID ${dto.project_id}.`);
        }
      }

      // 2. Construct updates merging existing values (since bulkUpdate uses upsert on 'id')
      // To perform a safe bulk upsert without overwriting untouched fields with null, 
      // we must fetch current state and merge. 
      const finalUpdates = await Promise.all(dto.updates.map(async (u) => {
        const current = await this.repository.findById(u.id);
        return {
          ...current,
          ...u
        } as any;
      }));

      return await this.repository.bulkUpdate(finalUpdates);
    });
  }

  async bulkRemoveAmenities(dto: BulkDeleteProjectAmenitiesDto): Promise<void> {
    return this.executeSafe(async () => {
      // Validate they exist and belong to project
      for (const id of dto.ids) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundError(`Junction ID ${id} not found.`);
        if (existing.project_id !== dto.project_id) {
           throw new ConflictError(`Junction ID ${id} does not belong to Project ID ${dto.project_id}.`);
        }
      }

      await this.repository.bulkSoftDelete(dto.ids);
    });
  }
}
