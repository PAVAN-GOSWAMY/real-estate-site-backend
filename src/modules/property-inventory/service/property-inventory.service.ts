import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { PropertyInventoryRepository } from "../repository/property-inventory.repository";
import { PropertyRepository } from "../../properties/repository/property.repository";
import { 
  UpdateInventoryStatusDto,
  ReserveInventoryDto,
  BookInventoryDto,
  ReleaseInventoryDto,
  CancelInventoryDto,
  SoldInventoryDto,
  BlockInventoryDto,
  BulkUpdateInventoryStatusDto,
  BulkReleaseInventoryDto,
  InventoryHistoryQueryDto,
  InventoryDashboardQueryDto,
  BulkInventoryResponseDto
} from "../dto/property-inventory.dto";
import { PropertyInventoryStateEntity, InventoryStatus, InventoryTransactionType } from "@/types/property-inventory.types";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/errors/domain.error";

export class PropertyInventoryService extends BaseService {
  private repository: PropertyInventoryRepository;
  private propertyRepository: PropertyRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new PropertyInventoryRepository(supabase);
    this.propertyRepository = new PropertyRepository(supabase);
  }

  private async validateProperty(propertyId: string): Promise<void> {
    const exists = await this.propertyRepository.exists({ id: propertyId });
    if (!exists) throw new NotFoundError("Property Unit");
  }

  private async syncMacroStatusToProperties(propertyId: string, status: InventoryStatus): Promise<void> {
    // Map granular inventory states back to the original `properties` table schema enum
    let availability_status = 'AVAILABLE';
    
    switch (status) {
      case 'AVAILABLE':
      case 'RELEASED':
      case 'CANCELLED':
        availability_status = 'AVAILABLE';
        break;
      case 'RESERVED':
      case 'BLOCKED':
      case 'BOOKED':
      case 'AGREEMENT_PENDING':
      case 'MAINTENANCE_HOLD':
      case 'LEGAL_HOLD':
        availability_status = 'LIMITED';
        break;
      case 'SOLD':
        availability_status = 'SOLD';
        break;
    }

    await this.propertyRepository.update(propertyId, { availability_status });
  }

  private validateStateTransition(current: InventoryStatus, requested: InventoryStatus, txType: InventoryTransactionType): void {
    if (current === requested) {
      throw new ValidationError(`Property is already ${current}`);
    }

    if (current === 'SOLD') {
      throw new ValidationError("Property is already SOLD and is immutable.");
    }

    if (txType === 'RESERVE' && current !== 'AVAILABLE' && current !== 'RELEASED') {
      throw new ValidationError(`Cannot reserve property that is currently ${current}.`);
    }

    if (txType === 'BOOK' && current !== 'RESERVED' && current !== 'AVAILABLE') {
      throw new ValidationError(`Cannot book property that is currently ${current}.`);
    }

    if (txType === 'SELL' && current !== 'BOOKED' && current !== 'AGREEMENT_PENDING') {
      throw new ValidationError(`Cannot sell property that is currently ${current}. Must be booked first.`);
    }
  }

  private async executeStateTransition(
    propertyId: string,
    expectedVersion: number,
    newStatus: InventoryStatus,
    txType: InventoryTransactionType,
    payload: { lead_id?: string | null; reserved_until?: string | null; notes?: string | null }
  ): Promise<PropertyInventoryStateEntity> {
    
    const currentState = await this.repository.getCurrentState(propertyId);
    
    this.validateStateTransition(currentState.status, newStatus, txType);

    // 1. Optimistic Locking Update
    const newState = await this.repository.transitionState(propertyId, expectedVersion, newStatus, payload);

    // 2. Ledger Transaction
    await this.repository.logTransaction(
      propertyId,
      txType,
      currentState.status === 'AVAILABLE' && currentState.version === 0 ? null : currentState.status,
      newStatus,
      payload
    );

    // 3. Macro Sync
    await this.syncMacroStatusToProperties(propertyId, newStatus);

    return newState;
  }

  async getInventory(propertyId: string): Promise<PropertyInventoryStateEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(propertyId);
      return await this.repository.getCurrentState(propertyId);
    });
  }

  async updateStatus(id: string, dto: UpdateInventoryStatusDto): Promise<PropertyInventoryStateEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(id);
      return await this.executeStateTransition(id, dto.version, dto.status, 'HOLD', {
        lead_id: dto.lead_id,
        reserved_until: dto.reserved_until,
        notes: dto.notes
      });
    });
  }

  async reserveInventory(id: string, dto: ReserveInventoryDto): Promise<PropertyInventoryStateEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(id);
      return await this.executeStateTransition(id, dto.version, 'RESERVED', 'RESERVE', {
        lead_id: dto.lead_id,
        reserved_until: dto.reserved_until,
        notes: dto.notes
      });
    });
  }

  async blockInventory(id: string, dto: BlockInventoryDto): Promise<PropertyInventoryStateEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(id);
      return await this.executeStateTransition(id, dto.version, 'BLOCKED', 'BLOCK', {
        reserved_until: dto.reserved_until,
        notes: dto.notes
      });
    });
  }

  async bookInventory(id: string, dto: BookInventoryDto): Promise<PropertyInventoryStateEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(id);
      return await this.executeStateTransition(id, dto.version, 'BOOKED', 'BOOK', {
        lead_id: dto.lead_id,
        notes: dto.notes
      });
    });
  }

  async releaseInventory(id: string, dto: ReleaseInventoryDto): Promise<PropertyInventoryStateEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(id);
      return await this.executeStateTransition(id, dto.version, 'AVAILABLE', 'RELEASE', {
        lead_id: null,
        reserved_until: null,
        notes: dto.notes
      });
    });
  }

  async cancelInventory(id: string, dto: CancelInventoryDto): Promise<PropertyInventoryStateEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(id);
      return await this.executeStateTransition(id, dto.version, 'AVAILABLE', 'CANCEL', {
        lead_id: null,
        reserved_until: null,
        notes: dto.notes
      });
    });
  }

  async sellInventory(id: string, dto: SoldInventoryDto): Promise<PropertyInventoryStateEntity> {
    return this.executeSafe(async () => {
      await this.validateProperty(id);
      return await this.executeStateTransition(id, dto.version, 'SOLD', 'SELL', {
        lead_id: dto.lead_id,
        notes: dto.notes
      });
    });
  }

  async getHistory(propertyId: string, query: InventoryHistoryQueryDto): Promise<{ data: any[]; count: number }> {
    return this.executeSafe(async () => {
      await this.validateProperty(propertyId);
      return await this.repository.getHistory(propertyId, query);
    });
  }

  async getDashboard(query: InventoryDashboardQueryDto): Promise<{ data: any[]; count: number }> {
    return this.executeSafe(async () => {
      return await this.repository.getDashboard(query);
    });
  }

  // --- Bulk Operations ---

  async bulkUpdateStatus(dto: BulkUpdateInventoryStatusDto): Promise<BulkInventoryResponseDto> {
    return this.executeSafe(async () => {
      const success: PropertyInventoryStateEntity[] = [];
      const failed: { id: string; error: string }[] = [];

      for (const update of dto.updates) {
        try {
          await this.validateProperty(update.property_id);
          const state = await this.executeStateTransition(update.property_id, update.version, update.status, 'HOLD', {
            lead_id: update.lead_id,
            reserved_until: update.reserved_until,
            notes: update.notes
          });
          success.push(state);
        } catch (error: any) {
          failed.push({ id: update.property_id, error: error.message });
        }
      }

      return { success, failed };
    });
  }

  async bulkRelease(dto: BulkReleaseInventoryDto): Promise<BulkInventoryResponseDto> {
    return this.executeSafe(async () => {
      const success: PropertyInventoryStateEntity[] = [];
      const failed: { id: string; error: string }[] = [];

      for (const id of dto.property_ids) {
        try {
          await this.validateProperty(id);
          // For bulk operations where frontend might not have exact version, 
          // we fetch the current state first, then attempt release.
          // In a high contention environment this could fail, but it's safe.
          const currentState = await this.repository.getCurrentState(id);
          const state = await this.executeStateTransition(id, currentState.version, 'AVAILABLE', 'RELEASE', {
            lead_id: null,
            reserved_until: null,
            notes: dto.notes
          });
          success.push(state);
        } catch (error: any) {
          failed.push({ id, error: error.message });
        }
      }

      return { success, failed };
    });
  }
}
