import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { PropertyImageRepository } from "../repository/property-image.repository";
import { PropertyRepository } from "../../properties/repository/property.repository";
import { 
  CreatePropertyImageDto, 
  UpdatePropertyImageDto, 
  PropertyImageFilterDto,
  BulkUploadPropertyImagesDto,
  BulkUpdatePropertyImagesDto,
  BulkDeletePropertyImagesDto,
  ReorderPropertyImagesDto,
  UpdateCoverImageDto
} from "../dto/property-image.dto";
import { PropertyImageEntity } from "@/types/property-image.types";
import { NotFoundError } from "@/lib/errors/domain.error";

export class PropertyImageService extends BaseService {
  private repository: PropertyImageRepository;
  private propertyRepository: PropertyRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new PropertyImageRepository(supabase);
    this.propertyRepository = new PropertyRepository(supabase);
  }

  private async validateProperty(propertyId: string): Promise<void> {
    const exists = await this.propertyRepository.exists({ id: propertyId });
    if (!exists) throw new NotFoundError("Property Unit");
  }

  private async handleCoverSingleton(propertyId: string, isCover: boolean): Promise<void> {
    if (isCover) {
      await this.repository.unsetCoverImage(propertyId);
    }
  }

  async createImage(dto: CreatePropertyImageDto): Promise<PropertyImageEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);
      if (dto.is_cover) {
        await this.handleCoverSingleton(dto.property_id, true);
      }
      return await this.repository.create(dto);
    });
  }

  async updateImage(id: string, dto: UpdatePropertyImageDto): Promise<PropertyImageEntity> {
    return this.executeSafe(async () => {
      const target = await this.repository.findById(id);
      if (!target) throw new NotFoundError("Property Image");

      if (dto.is_cover !== undefined && dto.is_cover !== target.is_cover) {
        await this.handleCoverSingleton(target.property_id, dto.is_cover);
      }

      return await this.repository.update(id, dto);
    });
  }

  async deleteImage(id: string): Promise<void> {
    return this.executeSafe(async () => {
      const target = await this.repository.findById(id);
      if (!target) throw new NotFoundError("Property Image");
      await this.repository.softDelete(id);
    });
  }

  async getImage(id: string): Promise<any> {
    return this.executeSafe(async () => {
      const image = await this.repository.findByIdWithRelations(id);
      if (!image) throw new NotFoundError("Property Image");
      return image;
    });
  }

  async listImages(query: PropertyImageFilterDto): Promise<{ data: any[]; count: number }> {
    return this.executeSafe(async () => {
      return await this.repository.findMany(query);
    });
  }

  // --- Bulk Operations ---

  async bulkUpload(dto: BulkUploadPropertyImagesDto): Promise<PropertyImageEntity[]> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);
      
      const hasCover = dto.images.some(img => img.is_cover);
      if (hasCover) {
        await this.handleCoverSingleton(dto.property_id, true);
      }

      const payloads = dto.images.map(img => ({ ...img, property_id: dto.property_id }));
      return await this.repository.bulkCreate(payloads as any);
    });
  }

  async bulkUpdate(dto: BulkUpdatePropertyImagesDto): Promise<PropertyImageEntity[]> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);

      const finalUpdates = await Promise.all(dto.updates.map(async (u) => {
        const current = await this.repository.findById(u.id);
        if (!current) throw new NotFoundError(`Property Image ID ${u.id}`);
        return { ...current, ...u } as any;
      }));

      return await this.repository.bulkUpdate(finalUpdates);
    });
  }

  async bulkDelete(dto: BulkDeletePropertyImagesDto): Promise<void> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);
      await this.repository.bulkSoftDelete(dto.ids);
    });
  }

  async reorderImages(dto: ReorderPropertyImagesDto): Promise<PropertyImageEntity[]> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);
      
      const finalUpdates = await Promise.all(dto.items.map(async (u) => {
        const current = await this.repository.findById(u.id);
        if (!current) throw new NotFoundError(`Property Image ID ${u.id}`);
        return { ...current, display_order: u.display_order } as any;
      }));

      return await this.repository.bulkUpdate(finalUpdates);
    });
  }

  async setCoverImage(dto: UpdateCoverImageDto): Promise<PropertyImageEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);
      
      const target = await this.repository.findById(dto.id);
      if (!target) throw new NotFoundError("Property Image");

      await this.handleCoverSingleton(dto.property_id, true);
      return await this.repository.update(dto.id, { is_cover: true });
    });
  }
}
