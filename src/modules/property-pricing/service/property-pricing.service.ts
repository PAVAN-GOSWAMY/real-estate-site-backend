import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { PropertyPricingRepository } from "../repository/property-pricing.repository";
import { PropertyRepository } from "../../properties/repository/property.repository";
import { 
  CreatePricingRevisionDto,
  UpdatePricingDto,
  ReviewPricingRevisionDto,
  BulkPricingUpdateDto,
  BulkCreatePricingRevisionDto,
  BulkReviewPricingRevisionDto,
  PricingHistoryQueryDto,
  PendingRevisionsQueryDto,
  BulkPricingResponseDto
} from "../dto/property-pricing.dto";
import { PropertyPricingRevisionEntity, PricingRevisionStatus } from "@/types/property-pricing.types";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/errors/domain.error";

export class PropertyPricingService extends BaseService {
  private repository: PropertyPricingRepository;
  private propertyRepository: PropertyRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new PropertyPricingRepository(supabase);
    this.propertyRepository = new PropertyRepository(supabase);
  }

  private async validateProperty(propertyId: string): Promise<void> {
    const exists = await this.propertyRepository.exists({ id: propertyId });
    if (!exists) throw new NotFoundError("Property Unit");
  }

  private async syncToPropertyTable(propertyId: string, revision: PropertyPricingRevisionEntity): Promise<void> {
    // Determine if this should be synced based on effective date
    const now = new Date();
    const effectiveDate = revision.effective_date ? new Date(revision.effective_date) : now;
    
    if (effectiveDate <= now) {
      await this.propertyRepository.update(propertyId, {
        price: revision.final_payable_amount,
        maintenance_charge: revision.maintenance_charges,
        booking_amount: revision.booking_amount
      });
    }
  }

  // Gets the current active pricing data (from the latest approved revision)
  async getCurrentPricing(propertyId: string): Promise<PropertyPricingRevisionEntity | null> {
    return this.executeSafe(async () => {
      await this.validateProperty(propertyId);
      return await this.repository.getLatestApproved(propertyId);
    });
  }

  // Direct Update - bypassing workflow (e.g., for Admins). Creates an APPROVED revision and syncs immediately.
  async directUpdatePricing(propertyId: string, dto: UpdatePricingDto): Promise<PropertyPricingRevisionEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(propertyId);
      
      const payload = {
        property_id: propertyId,
        ...dto,
        status: 'APPROVED' as PricingRevisionStatus
      };

      const revision = await this.repository.create(payload as any);
      await this.syncToPropertyTable(propertyId, revision);
      return revision;
    });
  }

  // Create a Draft/Pending Revision
  async revisePricing(propertyId: string, dto: CreatePricingRevisionDto): Promise<PropertyPricingRevisionEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(propertyId);
      
      // Optional constraint: Can only have one PENDING revision at a time
      const { data: pending } = await this.repository.getHistory(propertyId, { status: 'PENDING_APPROVAL' });
      if (pending.length > 0) {
        throw new ConflictError("There is already a pending pricing revision for this property.");
      }

      const payload = {
        property_id: propertyId,
        ...dto,
        status: 'PENDING_APPROVAL' as PricingRevisionStatus
      };

      return await this.repository.create(payload as any);
    });
  }

  async approveRevision(id: string, propertyId: string, dto: ReviewPricingRevisionDto): Promise<PropertyPricingRevisionEntity> {
    return this.executeSafe(async () => {
      const revision = await this.repository.findById(id);
      if (!revision || revision.property_id !== propertyId) throw new NotFoundError("Pricing Revision");
      if (revision.status !== 'PENDING_APPROVAL' && revision.status !== 'DRAFT') {
        throw new ValidationError("Only pending or draft revisions can be approved.");
      }

      const updated = await this.repository.update(id, { status: 'APPROVED', notes: dto.notes });
      await this.syncToPropertyTable(propertyId, updated);
      return updated;
    });
  }

  async rejectRevision(id: string, propertyId: string, dto: ReviewPricingRevisionDto): Promise<PropertyPricingRevisionEntity> {
    return this.executeSafe(async () => {
      const revision = await this.repository.findById(id);
      if (!revision || revision.property_id !== propertyId) throw new NotFoundError("Pricing Revision");
      if (revision.status !== 'PENDING_APPROVAL' && revision.status !== 'DRAFT') {
        throw new ValidationError("Only pending or draft revisions can be rejected.");
      }

      return await this.repository.update(id, { status: 'REJECTED', notes: dto.notes });
    });
  }

  async getPricingHistory(propertyId: string, query: PricingHistoryQueryDto): Promise<{ data: any[]; count: number }> {
    return this.executeSafe(async () => {
      await this.validateProperty(propertyId);
      return await this.repository.getHistory(propertyId, query);
    });
  }

  async getPendingRevisions(query: PendingRevisionsQueryDto): Promise<{ data: any[]; count: number }> {
    return this.executeSafe(async () => {
      return await this.repository.getPendingRevisions(query);
    });
  }

  // --- Bulk Operations ---

  async bulkDirectUpdate(dto: BulkPricingUpdateDto): Promise<BulkPricingResponseDto> {
    return this.executeSafe(async () => {
      const success: PropertyPricingRevisionEntity[] = [];
      const failed: { id: string; error: string }[] = [];

      for (const update of dto.updates) {
        try {
          await this.validateProperty(update.property_id);
          const payload = { ...update, status: 'APPROVED' as PricingRevisionStatus };
          const revision = await this.repository.create(payload as any);
          await this.syncToPropertyTable(update.property_id, revision);
          success.push(revision);
        } catch (error: any) {
          failed.push({ id: update.property_id, error: error.message });
        }
      }

      return { success, failed };
    });
  }

  async bulkRevise(dto: BulkCreatePricingRevisionDto): Promise<BulkPricingResponseDto> {
    return this.executeSafe(async () => {
      const success: PropertyPricingRevisionEntity[] = [];
      const failed: { id: string; error: string }[] = [];

      for (const update of dto.revisions) {
        try {
          await this.validateProperty(update.property_id);
          
          const { data: pending } = await this.repository.getHistory(update.property_id, { status: 'PENDING_APPROVAL' });
          if (pending.length > 0) {
            throw new ConflictError("Pending pricing revision already exists.");
          }

          const payload = { ...update, status: 'PENDING_APPROVAL' as PricingRevisionStatus };
          const revision = await this.repository.create(payload as any);
          success.push(revision);
        } catch (error: any) {
          failed.push({ id: update.property_id, error: error.message });
        }
      }

      return { success, failed };
    });
  }
}
