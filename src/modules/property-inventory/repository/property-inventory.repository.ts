import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { 
  PropertyInventoryStateEntity, 
  PropertyInventoryTransactionEntity,
  InventoryStatus,
  InventoryTransactionType
} from "@/types/property-inventory.types";
import { InventoryHistoryQueryDto, InventoryDashboardQueryDto } from "../dto/property-inventory.dto";
import { Modules } from "@/lib/constants/modules";
import { ConflictError } from "@/lib/errors/domain.error";

export class PropertyInventoryRepository extends BaseRepository<PropertyInventoryStateEntity, any, any> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.PROPERTY_INVENTORY);
  }

  async getCurrentState(propertyId: string): Promise<PropertyInventoryStateEntity> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('property_id', propertyId)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'getCurrentState');
    }

    // If no state exists, we consider it implicitly AVAILABLE version 0
    if (!data) {
      return {
        property_id: propertyId,
        status: 'AVAILABLE',
        lead_id: null,
        reserved_until: null,
        notes: null,
        version: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    return data;
  }

  async transitionState(
    propertyId: string, 
    expectedVersion: number, 
    newStatus: InventoryStatus,
    payload: { lead_id?: string | null; reserved_until?: string | null; notes?: string | null }
  ): Promise<PropertyInventoryStateEntity> {
    
    const newVersion = expectedVersion + 1;
    
    let result;

    if (expectedVersion === 0) {
      // It's the first time we are creating a state for this property
      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert({
          property_id: propertyId,
          status: newStatus,
          lead_id: payload.lead_id || null,
          reserved_until: payload.reserved_until || null,
          notes: payload.notes || null,
          version: newVersion
        })
        .select()
        .single();
        
      if (error) {
        if (error.code === '23505') { // Unique violation on property_id
          throw new ConflictError("Inventory state was modified by another transaction. Please retry.");
        }
        this.handleError(error, 'transitionState.insert');
      }
      result = data;
    } else {
      // We are updating an existing state with optimistic locking
      const { data, error } = await this.supabase
        .from(this.tableName)
        .update({
          status: newStatus,
          lead_id: payload.lead_id !== undefined ? payload.lead_id : undefined,
          reserved_until: payload.reserved_until !== undefined ? payload.reserved_until : undefined,
          notes: payload.notes !== undefined ? payload.notes : undefined,
          version: newVersion,
          updated_at: new Date().toISOString()
        })
        .eq('property_id', propertyId)
        .eq('version', expectedVersion) // Crucial: Optimistic concurrency lock
        .select()
        .single();

      if (error) {
        this.handleError(error, 'transitionState.update');
      }

      // If data is null but no error, it means the .eq('version') failed to match -> concurrency conflict!
      if (!data) {
        throw new ConflictError("Inventory state was modified by another transaction. Please retry.");
      }
      result = data;
    }

    return result;
  }

  async logTransaction(
    propertyId: string,
    transactionType: InventoryTransactionType,
    previousStatus: InventoryStatus | null,
    newStatus: InventoryStatus,
    payload: { lead_id?: string | null; notes?: string | null }
  ): Promise<PropertyInventoryTransactionEntity> {
    const { data, error } = await this.supabase
      .from(Modules.PROPERTY_INVENTORY_TRANSACTIONS)
      .insert({
        property_id: propertyId,
        transaction_type: transactionType,
        previous_status: previousStatus,
        new_status: newStatus,
        lead_id: payload.lead_id || null,
        notes: payload.notes || null
      })
      .select()
      .single();

    if (error) {
      this.handleError(error, 'logTransaction');
    }

    return data;
  }

  async getHistory(propertyId: string, query: InventoryHistoryQueryDto): Promise<{ data: any[]; count: number }> {
    const { page, limit, transaction_type } = query;
    const offset = (page! - 1) * limit!;

    let q = this.supabase
      .from(Modules.PROPERTY_INVENTORY_TRANSACTIONS)
      .select('*', { count: 'exact' })
      .eq('property_id', propertyId)
      .is('deleted_at', null)
      .range(offset, offset + limit! - 1)
      .order('created_at', { ascending: false });

    if (transaction_type) {
      q = q.eq('transaction_type', transaction_type);
    }

    const { data, count, error } = await q;

    if (error) {
      this.handleError(error, 'getHistory');
    }

    return { data: data || [], count: count || 0 };
  }

  async getDashboard(query: InventoryDashboardQueryDto): Promise<{ data: any[]; count: number }> {
    const { page, limit, status } = query;
    const offset = (page! - 1) * limit!;

    let q = this.supabase
      .from(this.tableName)
      .select('*, properties(id, unit_code, price)', { count: 'exact' })
      .range(offset, offset + limit! - 1)
      .order('updated_at', { ascending: false });

    if (status) {
      q = q.eq('status', status);
    }

    const { data, count, error } = await q;

    if (error) {
      this.handleError(error, 'getDashboard');
    }

    return { data: data || [], count: count || 0 };
  }
}
