import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { PropertyFeatureRepository } from "../repository/property-feature.repository";
import { PropertyRepository } from "../../properties/repository/property.repository";
import { FeatureRepository } from "../../features/repository/feature.repository";
import { 
  AssignPropertyFeatureDto, 
  UpdatePropertyFeatureDto, 
  PropertyFeatureFilterDto,
  BulkAssignPropertyFeaturesDto,
  BulkUpdatePropertyFeaturesDto,
  BulkDeletePropertyFeaturesDto
} from "../dto/property-feature.dto";
import { PropertyFeatureAssignmentEntity } from "@/types/property-feature.types";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/errors/domain.error";

export class PropertyFeatureService extends BaseService {
  private repository: PropertyFeatureRepository;
  private propertyRepository: PropertyRepository;
  private featureRepository: FeatureRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new PropertyFeatureRepository(supabase);
    this.propertyRepository = new PropertyRepository(supabase);
    this.featureRepository = new FeatureRepository(supabase);
  }

  async assignFeature(dto: AssignPropertyFeatureDto): Promise<PropertyFeatureAssignmentEntity> {
    return this.executeSafe(async () => {
      // 1. Validate parent property exists
      const propertyExists = await this.propertyRepository.exists({ id: dto.property_id });
      if (!propertyExists) throw new NotFoundError("Property");

      // 2. Validate feature exists
      const feature = await this.featureRepository.findById(dto.feature_id);
      if (!feature) throw new NotFoundError("Feature");

      // 3. Prevent duplicate assignment
      const exists = await this.repository.existsByPropertyAndFeature(dto.property_id, dto.feature_id);
      if (exists) {
        throw new ConflictError("This feature is already assigned to the property.");
      }

      return await this.repository.create(dto);
    });
  }

  async updateAssignment(id: string, dto: UpdatePropertyFeatureDto): Promise<PropertyFeatureAssignmentEntity> {
    return this.executeSafe(async () => {
      const target = await this.repository.findById(id);
      if (!target) throw new NotFoundError("Property Feature Assignment");

      return await this.repository.update(id, dto);
    });
  }

  async removeAssignment(id: string): Promise<void> {
    return this.executeSafe(async () => {
      const target = await this.repository.findById(id);
      if (!target) throw new NotFoundError("Property Feature Assignment");

      await this.repository.softDelete(id);
    });
  }

  async getAssignment(id: string): Promise<any> {
    return this.executeSafe(async () => {
      const assignment = await this.repository.findByIdWithRelations(id);
      if (!assignment) throw new NotFoundError("Property Feature Assignment");
      return assignment;
    });
  }

  async listAssignments(query: PropertyFeatureFilterDto): Promise<{ data: any[]; count: number }> {
    return this.executeSafe(async () => {
      return await this.repository.findMany(query);
    });
  }

  // --- Bulk Operations ---

  async bulkAssignFeatures(dto: BulkAssignPropertyFeaturesDto): Promise<PropertyFeatureAssignmentEntity[]> {
    return this.executeSafe(async () => {
      const propertyExists = await this.propertyRepository.exists({ id: dto.property_id });
      if (!propertyExists) throw new NotFoundError("Property");

      // 1. Check for duplicates within the request payload
      const featureIds = dto.assignments.map(a => a.feature_id);
      if (new Set(featureIds).size !== featureIds.length) {
        throw new ValidationError("Duplicate feature IDs found within the request payload.");
      }

      // 2. Validate all features exist in the DB
      for (const featureId of featureIds) {
        const feature = await this.featureRepository.findById(featureId);
        if (!feature) throw new NotFoundError(`Feature ID ${featureId} not found.`);
      }

      // 3. Check for existing conflicts in the DB
      for (const featureId of featureIds) {
        const exists = await this.repository.existsByPropertyAndFeature(dto.property_id, featureId);
        if (exists) {
          throw new ConflictError(`Feature ID ${featureId} is already assigned to this property.`);
        }
      }

      // 4. Map DTO to entities and insert
      const toInsert = dto.assignments.map(a => ({
        property_id: dto.property_id,
        ...a
      }));

      return await this.repository.bulkCreate(toInsert);
    });
  }

  async bulkUpdateFeatures(dto: BulkUpdatePropertyFeaturesDto): Promise<PropertyFeatureAssignmentEntity[]> {
    return this.executeSafe(async () => {
      for (const update of dto.updates) {
        const existing = await this.repository.findById(update.id);
        if (!existing) throw new NotFoundError(`Junction ID ${update.id} not found.`);
        if (existing.property_id !== dto.property_id) {
          throw new ConflictError(`Junction ID ${update.id} does not belong to Property ID ${dto.property_id}.`);
        }
      }

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

  async bulkRemoveFeatures(dto: BulkDeletePropertyFeaturesDto): Promise<void> {
    return this.executeSafe(async () => {
      for (const id of dto.ids) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundError(`Junction ID ${id} not found.`);
        if (existing.property_id !== dto.property_id) {
           throw new ConflictError(`Junction ID ${id} does not belong to Property ID ${dto.property_id}.`);
        }
      }

      await this.repository.bulkSoftDelete(dto.ids);
    });
  }
}
