import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { PropertyBrochureRepository } from "../repository/property-brochure.repository";
import { PropertyRepository } from "../../properties/repository/property.repository";
import { 
  CreatePropertyBrochureDto, 
  UpdatePropertyBrochureDto, 
  PropertyBrochureFilterDto,
  BulkUploadPropertyBrochuresDto,
  BulkUpdatePropertyBrochuresDto,
  BulkDeletePropertyBrochuresDto,
  ReorderPropertyBrochuresDto,
  UpdatePrimaryBrochureDto
} from "../dto/property-brochure.dto";
import { PropertyBrochureEntity } from "@/types/property-brochure.types";
import { ConflictError, NotFoundError } from "@/lib/errors/domain.error";

export class PropertyBrochureService extends BaseService {
  private repository: PropertyBrochureRepository;
  private propertyRepository: PropertyRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new PropertyBrochureRepository(supabase);
    this.propertyRepository = new PropertyRepository(supabase);
  }

  private async validateProperty(propertyId: string): Promise<void> {
    const exists = await this.propertyRepository.exists({ id: propertyId });
    if (!exists) throw new NotFoundError("Property Unit");
  }

  private async handleLatestVersionDemotion(propertyId: string, brochureType: string, language: string, isLatest: boolean): Promise<void> {
    if (isLatest) {
      await this.repository.unsetLatestVersion(propertyId, brochureType, language);
    }
  }

  private async validateUniqueBrochureCode(propertyId: string, brochureCode: string): Promise<void> {
    const exists = await this.repository.existsByBrochureCode(propertyId, brochureCode);
    if (exists) {
      throw new ConflictError(`Brochure code ${brochureCode} already exists for this property unit.`);
    }
  }

  async createBrochure(dto: CreatePropertyBrochureDto): Promise<PropertyBrochureEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);
      await this.validateUniqueBrochureCode(dto.property_id, dto.brochure_code);
      
      if (dto.is_latest_version) {
        await this.handleLatestVersionDemotion(dto.property_id, dto.brochure_type, dto.language, true);
      }
      return await this.repository.create(dto);
    });
  }

  async updateBrochure(id: string, dto: UpdatePropertyBrochureDto): Promise<PropertyBrochureEntity> {
    return this.executeSafe(async () => {
      const target = await this.repository.findById(id);
      if (!target) throw new NotFoundError("Property Brochure");

      if (dto.brochure_code && dto.brochure_code !== target.brochure_code) {
        await this.validateUniqueBrochureCode(target.property_id, dto.brochure_code);
      }

      if (dto.is_latest_version !== undefined && dto.is_latest_version !== target.is_latest_version) {
        await this.handleLatestVersionDemotion(
          target.property_id, 
          target.brochure_type, 
          target.language, 
          dto.is_latest_version
        );
      }

      return await this.repository.update(id, dto);
    });
  }

  async deleteBrochure(id: string): Promise<void> {
    return this.executeSafe(async () => {
      const target = await this.repository.findById(id);
      if (!target) throw new NotFoundError("Property Brochure");
      await this.repository.softDelete(id);
    });
  }

  async getBrochure(id: string): Promise<any> {
    return this.executeSafe(async () => {
      const brochure = await this.repository.findByIdWithRelations(id);
      if (!brochure) throw new NotFoundError("Property Brochure");
      return brochure;
    });
  }

  async registerDownload(id: string): Promise<string> {
    return this.executeSafe(async () => {
      const brochure = await this.repository.findById(id);
      if (!brochure) throw new NotFoundError("Property Brochure");
      
      await this.repository.incrementDownloadCount(id);
      
      return brochure.public_url;
    });
  }

  async listBrochures(query: PropertyBrochureFilterDto): Promise<{ data: any[]; count: number }> {
    return this.executeSafe(async () => {
      return await this.repository.findMany(query);
    });
  }

  // --- Bulk Operations ---

  async bulkUpload(dto: BulkUploadPropertyBrochuresDto): Promise<PropertyBrochureEntity[]> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);
      
      for (const brochure of dto.brochures) {
         await this.validateUniqueBrochureCode(dto.property_id, brochure.brochure_code);
         if (brochure.is_latest_version) {
           await this.handleLatestVersionDemotion(dto.property_id, brochure.brochure_type, brochure.language, true);
         }
      }

      const payloads = dto.brochures.map(img => ({ ...img, property_id: dto.property_id }));
      return await this.repository.bulkCreate(payloads as any);
    });
  }

  async bulkUpdate(dto: BulkUpdatePropertyBrochuresDto): Promise<PropertyBrochureEntity[]> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);

      const finalUpdates = await Promise.all(dto.updates.map(async (u) => {
        const current = await this.repository.findById(u.id);
        if (!current) throw new NotFoundError(`Property Brochure ID ${u.id}`);
        
        if (u.brochure_code && u.brochure_code !== current.brochure_code) {
          await this.validateUniqueBrochureCode(dto.property_id, u.brochure_code);
        }
        
        return { ...current, ...u } as any;
      }));

      return await this.repository.bulkUpdate(finalUpdates);
    });
  }

  async bulkDelete(dto: BulkDeletePropertyBrochuresDto): Promise<void> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);
      await this.repository.bulkSoftDelete(dto.ids);
    });
  }

  async reorderBrochures(dto: ReorderPropertyBrochuresDto): Promise<PropertyBrochureEntity[]> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);
      
      const finalUpdates = await Promise.all(dto.items.map(async (u) => {
        const current = await this.repository.findById(u.id);
        if (!current) throw new NotFoundError(`Property Brochure ID ${u.id}`);
        return { ...current, display_order: u.display_order } as any;
      }));

      return await this.repository.bulkUpdate(finalUpdates);
    });
  }

  async setPrimaryBrochure(dto: UpdatePrimaryBrochureDto): Promise<PropertyBrochureEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);
      
      const target = await this.repository.findById(dto.id);
      if (!target) throw new NotFoundError("Property Brochure");

      await this.handleLatestVersionDemotion(dto.property_id, target.brochure_type, target.language, true);
      return await this.repository.update(dto.id, { is_latest_version: true });
    });
  }
}
