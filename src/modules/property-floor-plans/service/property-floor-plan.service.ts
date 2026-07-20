import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { PropertyFloorPlanRepository } from "../repository/property-floor-plan.repository";
import { PropertyRepository } from "../../properties/repository/property.repository";
import { 
  CreatePropertyFloorPlanDto, 
  UpdatePropertyFloorPlanDto, 
  PropertyFloorPlanFilterDto,
  BulkUploadPropertyFloorPlansDto,
  BulkUpdatePropertyFloorPlansDto,
  BulkDeletePropertyFloorPlansDto,
  ReorderPropertyFloorPlansDto,
  UpdatePrimaryFloorPlanDto
} from "../dto/property-floor-plan.dto";
import { PropertyFloorPlanEntity } from "@/types/property-floor-plan.types";
import { ConflictError, NotFoundError } from "@/lib/errors/domain.error";

export class PropertyFloorPlanService extends BaseService {
  private repository: PropertyFloorPlanRepository;
  private propertyRepository: PropertyRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new PropertyFloorPlanRepository(supabase);
    this.propertyRepository = new PropertyRepository(supabase);
  }

  private async validateProperty(propertyId: string): Promise<void> {
    const exists = await this.propertyRepository.exists({ id: propertyId });
    if (!exists) throw new NotFoundError("Property Unit");
  }

  private async handlePrimarySingleton(propertyId: string, isPrimary: boolean): Promise<void> {
    if (isPrimary) {
      await this.repository.unsetPrimaryFloorPlan(propertyId);
    }
  }

  private async validateUniquePlanCode(propertyId: string, planCode: string, excludeId?: string): Promise<void> {
    const exists = await this.repository.existsByPlanCode(propertyId, planCode);
    if (exists) {
      // Basic block, full logic would use excludeId for true updates.
      throw new ConflictError(`Plan code ${planCode} already exists for this property unit.`);
    }
  }

  async createFloorPlan(dto: CreatePropertyFloorPlanDto): Promise<PropertyFloorPlanEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);
      await this.validateUniquePlanCode(dto.property_id, dto.plan_code);
      
      if (dto.is_primary) {
        await this.handlePrimarySingleton(dto.property_id, true);
      }
      return await this.repository.create(dto);
    });
  }

  async updateFloorPlan(id: string, dto: UpdatePropertyFloorPlanDto): Promise<PropertyFloorPlanEntity> {
    return this.executeSafe(async () => {
      const target = await this.repository.findById(id);
      if (!target) throw new NotFoundError("Property Floor Plan");

      if (dto.plan_code && dto.plan_code !== target.plan_code) {
        await this.validateUniquePlanCode(target.property_id, dto.plan_code, id);
      }

      if (dto.is_primary !== undefined && dto.is_primary !== target.is_primary) {
        await this.handlePrimarySingleton(target.property_id, dto.is_primary);
      }

      return await this.repository.update(id, dto);
    });
  }

  async deleteFloorPlan(id: string): Promise<void> {
    return this.executeSafe(async () => {
      const target = await this.repository.findById(id);
      if (!target) throw new NotFoundError("Property Floor Plan");
      await this.repository.softDelete(id);
    });
  }

  async getFloorPlan(id: string): Promise<any> {
    return this.executeSafe(async () => {
      const plan = await this.repository.findByIdWithRelations(id);
      if (!plan) throw new NotFoundError("Property Floor Plan");
      return plan;
    });
  }

  async listFloorPlans(query: PropertyFloorPlanFilterDto): Promise<{ data: any[]; count: number }> {
    return this.executeSafe(async () => {
      return await this.repository.findMany(query);
    });
  }

  // --- Bulk Operations ---

  async bulkUpload(dto: BulkUploadPropertyFloorPlansDto): Promise<PropertyFloorPlanEntity[]> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);
      
      const hasPrimary = dto.floor_plans.some(img => img.is_primary);
      if (hasPrimary) {
        await this.handlePrimarySingleton(dto.property_id, true);
      }

      for (const plan of dto.floor_plans) {
         await this.validateUniquePlanCode(dto.property_id, plan.plan_code);
      }

      const payloads = dto.floor_plans.map(img => ({ ...img, property_id: dto.property_id }));
      return await this.repository.bulkCreate(payloads as any);
    });
  }

  async bulkUpdate(dto: BulkUpdatePropertyFloorPlansDto): Promise<PropertyFloorPlanEntity[]> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);

      const finalUpdates = await Promise.all(dto.updates.map(async (u) => {
        const current = await this.repository.findById(u.id);
        if (!current) throw new NotFoundError(`Property Floor Plan ID ${u.id}`);
        
        if (u.plan_code && u.plan_code !== current.plan_code) {
          await this.validateUniquePlanCode(dto.property_id, u.plan_code, u.id);
        }
        
        return { ...current, ...u } as any;
      }));

      return await this.repository.bulkUpdate(finalUpdates);
    });
  }

  async bulkDelete(dto: BulkDeletePropertyFloorPlansDto): Promise<void> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);
      await this.repository.bulkSoftDelete(dto.ids);
    });
  }

  async reorderFloorPlans(dto: ReorderPropertyFloorPlansDto): Promise<PropertyFloorPlanEntity[]> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);
      
      const finalUpdates = await Promise.all(dto.items.map(async (u) => {
        const current = await this.repository.findById(u.id);
        if (!current) throw new NotFoundError(`Property Floor Plan ID ${u.id}`);
        return { ...current, display_order: u.display_order } as any;
      }));

      return await this.repository.bulkUpdate(finalUpdates);
    });
  }

  async setPrimaryFloorPlan(dto: UpdatePrimaryFloorPlanDto): Promise<PropertyFloorPlanEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);
      
      const target = await this.repository.findById(dto.id);
      if (!target) throw new NotFoundError("Property Floor Plan");

      await this.handlePrimarySingleton(dto.property_id, true);
      return await this.repository.update(dto.id, { is_primary: true });
    });
  }
}
