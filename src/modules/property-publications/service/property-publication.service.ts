import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { PropertyPublicationRepository } from "../repository/property-publication.repository";
import { PropertyRepository } from "../../properties/repository/property.repository";
import { 
  ChangePublicationStatusDto,
  SchedulePublicationDto,
  BulkChangePublicationStatusDto,
  PublicationHistoryFilterDto,
  PublicationStatusQueryDto
} from "../dto/property-publication.dto";
import { PropertyPublicationEntity, PublicationStatus } from "@/types/property-publication.types";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/errors/domain.error";

export class PropertyPublicationService extends BaseService {
  private repository: PropertyPublicationRepository;
  private propertyRepository: PropertyRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new PropertyPublicationRepository(supabase);
    this.propertyRepository = new PropertyRepository(supabase);
  }

  private async validateProperty(propertyId: string): Promise<void> {
    const exists = await this.propertyRepository.exists({ id: propertyId });
    if (!exists) throw new NotFoundError("Property Unit");
  }

  private async syncToPropertyTable(propertyId: string, status: PublicationStatus): Promise<void> {
    // When a property is PUBLISHED, we set is_active=true, is_verified=true
    // Otherwise, is_active=false. 
    // Approved is is_active=false, is_verified=true.
    
    let is_active = false;
    let is_verified = false;
    let property_status = undefined; // Do not touch by default

    switch (status) {
      case 'DRAFT':
        is_active = false;
        is_verified = false;
        break;
      case 'PENDING_REVIEW':
        is_active = false;
        is_verified = false;
        break;
      case 'APPROVED':
        is_active = false;
        is_verified = true;
        break;
      case 'PUBLISHED':
        is_active = true;
        is_verified = true;
        break;
      case 'UNPUBLISHED':
        is_active = false;
        is_verified = true;
        break;
      case 'ARCHIVED':
        is_active = false;
        is_verified = false;
        property_status = 'ARCHIVED'; // Affect physical status if required by biz logic
        break;
      case 'REJECTED':
      case 'SCHEDULED':
      case 'EXPIRED':
        is_active = false;
        break;
    }

    const updatePayload: any = { is_active, is_verified };
    if (property_status) {
      updatePayload.property_status = property_status;
    }

    await this.propertyRepository.update(propertyId, updatePayload);
  }

  private validateWorkflow(currentStatus: PublicationStatus, newStatus: PublicationStatus): void {
    if (currentStatus === newStatus) {
      throw new ConflictError(`Property is already in ${newStatus} state.`);
    }

    if (newStatus === 'PUBLISHED') {
      if (currentStatus !== 'APPROVED' && currentStatus !== 'UNPUBLISHED' && currentStatus !== 'SCHEDULED') {
        throw new ValidationError("Property must be APPROVED before it can be PUBLISHED.");
      }
    }

    if (newStatus === 'APPROVED') {
      if (currentStatus !== 'PENDING_REVIEW' && currentStatus !== 'DRAFT') {
        throw new ValidationError("Only DRAFT or PENDING_REVIEW properties can be APPROVED.");
      }
    }
  }

  async publishProperty(id: string, dto: ChangePublicationStatusDto): Promise<PropertyPublicationEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(id);
      const currentStatus = await this.repository.getCurrentStatus(id);
      
      this.validateWorkflow(currentStatus, 'PUBLISHED');
      
      const transition = await this.repository.insertTransition(id, 'PUBLISHED', dto.notes);
      await this.syncToPropertyTable(id, 'PUBLISHED');
      
      return transition;
    });
  }

  async unpublishProperty(id: string, dto: ChangePublicationStatusDto): Promise<PropertyPublicationEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(id);
      const transition = await this.repository.insertTransition(id, 'UNPUBLISHED', dto.notes);
      await this.syncToPropertyTable(id, 'UNPUBLISHED');
      return transition;
    });
  }

  async approveProperty(id: string, dto: ChangePublicationStatusDto): Promise<PropertyPublicationEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(id);
      const currentStatus = await this.repository.getCurrentStatus(id);
      
      this.validateWorkflow(currentStatus, 'APPROVED');
      
      const transition = await this.repository.insertTransition(id, 'APPROVED', dto.notes);
      await this.syncToPropertyTable(id, 'APPROVED');
      return transition;
    });
  }

  async rejectProperty(id: string, dto: ChangePublicationStatusDto): Promise<PropertyPublicationEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(id);
      const transition = await this.repository.insertTransition(id, 'REJECTED', dto.notes);
      await this.syncToPropertyTable(id, 'REJECTED');
      return transition;
    });
  }

  async archiveProperty(id: string, dto: ChangePublicationStatusDto): Promise<PropertyPublicationEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(id);
      const transition = await this.repository.insertTransition(id, 'ARCHIVED', dto.notes);
      await this.syncToPropertyTable(id, 'ARCHIVED');
      return transition;
    });
  }

  async expireProperty(id: string, dto: ChangePublicationStatusDto): Promise<PropertyPublicationEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(id);
      const transition = await this.repository.insertTransition(id, 'EXPIRED', dto.notes);
      await this.syncToPropertyTable(id, 'EXPIRED');
      return transition;
    });
  }

  async schedulePublication(id: string, dto: SchedulePublicationDto): Promise<PropertyPublicationEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(id);
      const currentStatus = await this.repository.getCurrentStatus(id);
      
      if (currentStatus !== 'APPROVED') {
        throw new ValidationError("Property must be APPROVED before it can be SCHEDULED.");
      }
      
      const transition = await this.repository.insertTransition(id, 'SCHEDULED', dto.notes, dto.scheduled_at, dto.expires_at);
      await this.syncToPropertyTable(id, 'SCHEDULED');
      return transition;
    });
  }

  async getHistory(query: PublicationHistoryFilterDto): Promise<{ data: any[]; count: number; current_status: PublicationStatus }> {
    return this.executeSafe(async () => {
      await this.validateProperty(query.property_id);
      const current_status = await this.repository.getCurrentStatus(query.property_id);
      const { data, count } = await this.repository.getHistory(query);
      
      return { data, count, current_status };
    });
  }

  async getPropertiesByStatus(query: PublicationStatusQueryDto): Promise<{ data: any[]; count: number }> {
    return this.executeSafe(async () => {
      return await this.repository.getPropertiesByStatus(query);
    });
  }

  // --- Bulk Operations ---

  async bulkPublish(dto: BulkChangePublicationStatusDto): Promise<PropertyPublicationEntity[]> {
    return this.executeSafe(async () => {
      const results: PropertyPublicationEntity[] = [];
      for (const id of dto.property_ids) {
         try {
           const currentStatus = await this.repository.getCurrentStatus(id);
           this.validateWorkflow(currentStatus, 'PUBLISHED');
           
           const transition = await this.repository.insertTransition(id, 'PUBLISHED', dto.notes);
           await this.syncToPropertyTable(id, 'PUBLISHED');
           results.push(transition);
         } catch (e) {
           // Skip failed bulks or log them in a real system
         }
      }
      return results;
    });
  }

  async bulkUnpublish(dto: BulkChangePublicationStatusDto): Promise<PropertyPublicationEntity[]> {
    return this.executeSafe(async () => {
      const results: PropertyPublicationEntity[] = [];
      for (const id of dto.property_ids) {
         const transition = await this.repository.insertTransition(id, 'UNPUBLISHED', dto.notes);
         await this.syncToPropertyTable(id, 'UNPUBLISHED');
         results.push(transition);
      }
      return results;
    });
  }
}
