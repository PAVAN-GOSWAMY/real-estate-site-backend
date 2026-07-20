import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { PropertyVideoRepository } from "../repository/property-video.repository";
import { PropertyRepository } from "../../properties/repository/property.repository";
import { 
  CreatePropertyVideoDto, 
  UpdatePropertyVideoDto, 
  PropertyVideoFilterDto,
  BulkUploadPropertyVideosDto,
  BulkUpdatePropertyVideosDto,
  BulkDeletePropertyVideosDto,
  ReorderPropertyVideosDto,
  UpdatePrimaryVideoDto,
  PropertyVideoStreamDto
} from "../dto/property-video.dto";
import { PropertyVideoEntity } from "@/types/property-video.types";
import { ConflictError, NotFoundError } from "@/lib/errors/domain.error";

export class PropertyVideoService extends BaseService {
  private repository: PropertyVideoRepository;
  private propertyRepository: PropertyRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new PropertyVideoRepository(supabase);
    this.propertyRepository = new PropertyRepository(supabase);
  }

  private async validateProperty(propertyId: string): Promise<void> {
    const exists = await this.propertyRepository.exists({ id: propertyId });
    if (!exists) throw new NotFoundError("Property Unit");
  }

  private async handlePrimarySingleton(propertyId: string, isPrimary: boolean): Promise<void> {
    if (isPrimary) {
      await this.repository.unsetPrimaryVideo(propertyId);
    }
  }

  private async validateUniqueVideoCode(propertyId: string, videoCode: string): Promise<void> {
    const exists = await this.repository.existsByVideoCode(propertyId, videoCode);
    if (exists) {
      throw new ConflictError(`Video code ${videoCode} already exists for this property unit.`);
    }
  }

  private normalizeProviderPayload(dto: CreatePropertyVideoDto | UpdatePropertyVideoDto): void {
    if (dto.video_provider === 'SUPABASE') {
      dto.provider_video_id = null;
    } else if (dto.video_provider) {
      dto.storage_bucket = null;
      dto.storage_path = null;
    }
  }

  async createVideo(dto: CreatePropertyVideoDto): Promise<PropertyVideoEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);
      await this.validateUniqueVideoCode(dto.property_id, dto.video_code);
      
      this.normalizeProviderPayload(dto);

      if (dto.is_primary) {
        await this.handlePrimarySingleton(dto.property_id, true);
      }
      return await this.repository.create(dto);
    });
  }

  async updateVideo(id: string, dto: UpdatePropertyVideoDto): Promise<PropertyVideoEntity> {
    return this.executeSafe(async () => {
      const target = await this.repository.findById(id);
      if (!target) throw new NotFoundError("Property Video");

      if (dto.video_code && dto.video_code !== target.video_code) {
        await this.validateUniqueVideoCode(target.property_id, dto.video_code);
      }

      const mergedDto = { ...target, ...dto } as any;
      this.normalizeProviderPayload(mergedDto);

      if (dto.is_primary !== undefined && dto.is_primary !== target.is_primary) {
        await this.handlePrimarySingleton(target.property_id, dto.is_primary);
      }

      return await this.repository.update(id, dto);
    });
  }

  async deleteVideo(id: string): Promise<void> {
    return this.executeSafe(async () => {
      const target = await this.repository.findById(id);
      if (!target) throw new NotFoundError("Property Video");
      await this.repository.softDelete(id);
    });
  }

  async getVideo(id: string): Promise<any> {
    return this.executeSafe(async () => {
      const video = await this.repository.findByIdWithRelations(id);
      if (!video) throw new NotFoundError("Property Video");
      return video;
    });
  }

  async registerStream(id: string): Promise<PropertyVideoStreamDto> {
    return this.executeSafe(async () => {
      const video = await this.repository.findById(id);
      if (!video) throw new NotFoundError("Property Video");
      
      await this.repository.incrementViewCount(id);
      
      return {
        url: video.public_url || '',
        provider: video.video_provider,
        provider_video_id: video.provider_video_id
      };
    });
  }

  async listVideos(query: PropertyVideoFilterDto): Promise<{ data: any[]; count: number }> {
    return this.executeSafe(async () => {
      return await this.repository.findMany(query);
    });
  }

  // --- Bulk Operations ---

  async bulkUpload(dto: BulkUploadPropertyVideosDto): Promise<PropertyVideoEntity[]> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);
      
      for (const video of dto.videos) {
         await this.validateUniqueVideoCode(dto.property_id, video.video_code);
         this.normalizeProviderPayload(video);
         if (video.is_primary) {
           await this.handlePrimarySingleton(dto.property_id, true);
         }
      }

      const payloads = dto.videos.map(img => ({ ...img, property_id: dto.property_id }));
      return await this.repository.bulkCreate(payloads as any);
    });
  }

  async bulkUpdate(dto: BulkUpdatePropertyVideosDto): Promise<PropertyVideoEntity[]> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);

      const finalUpdates = await Promise.all(dto.updates.map(async (u) => {
        const current = await this.repository.findById(u.id);
        if (!current) throw new NotFoundError(`Property Video ID ${u.id}`);
        
        if (u.video_code && u.video_code !== current.video_code) {
          await this.validateUniqueVideoCode(dto.property_id, u.video_code);
        }
        
        return { ...current, ...u } as any;
      }));

      return await this.repository.bulkUpdate(finalUpdates);
    });
  }

  async bulkDelete(dto: BulkDeletePropertyVideosDto): Promise<void> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);
      await this.repository.bulkSoftDelete(dto.ids);
    });
  }

  async reorderVideos(dto: ReorderPropertyVideosDto): Promise<PropertyVideoEntity[]> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);
      
      const finalUpdates = await Promise.all(dto.items.map(async (u) => {
        const current = await this.repository.findById(u.id);
        if (!current) throw new NotFoundError(`Property Video ID ${u.id}`);
        return { ...current, display_order: u.display_order } as any;
      }));

      return await this.repository.bulkUpdate(finalUpdates);
    });
  }

  async setPrimaryVideo(dto: UpdatePrimaryVideoDto): Promise<PropertyVideoEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(dto.property_id);
      
      const target = await this.repository.findById(dto.id);
      if (!target) throw new NotFoundError("Property Video");

      await this.handlePrimarySingleton(dto.property_id, true);
      return await this.repository.update(dto.id, { is_primary: true });
    });
  }
}
