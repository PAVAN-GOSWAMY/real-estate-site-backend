import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { LeadAssignmentEntity } from "@/types/assignment.types";
import { Modules } from "@/lib/constants/modules";
import { LeadAssignmentFilterDto, WorkloadStatisticsDto } from "../dto/assignment.dto";

export class AssignmentRepository extends BaseRepository<LeadAssignmentEntity, any, any> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.LEAD_ASSIGNMENTS);
  }

  async getAssignments(query: LeadAssignmentFilterDto): Promise<{ data: any[]; count: number }> {
    const { page, limit, lead_id, assigned_to, is_active, strategy } = query;
    const offset = (page! - 1) * limit!;

    let q = this.supabase
      .from(this.tableName)
      .select(`*`, { count: 'exact' })
      .is('deleted_at', null)
      .range(offset, offset + limit! - 1)
      .order('created_at', { ascending: false });

    if (lead_id) q = q.eq('lead_id', lead_id);
    if (assigned_to) q = q.eq('assigned_to', assigned_to);
    if (is_active !== undefined) q = q.eq('is_active', is_active);
    if (strategy) q = q.eq('assignment_strategy', strategy);

    const { data, count, error } = await q;
    if (error) this.handleError(error, 'getAssignments');

    return { data: data || [], count: count || 0 };
  }

  async assign(payload: any): Promise<LeadAssignmentEntity> {
    // Transactional logic:
    // 1. Mark previous active assignment as inactive for this lead
    const { error: error1 } = await this.supabase
      .from(this.tableName)
      .update({ is_active: false })
      .eq('lead_id', payload.lead_id)
      .eq('is_active', true)
      .is('deleted_at', null);

    if (error1) this.handleError(error1, 'assign.deactivate_old');

    // 2. Insert new assignment
    const { data: data2, error: error2 } = await this.supabase
      .from(this.tableName)
      .insert([{ ...payload, is_active: true }])
      .select()
      .single();

    if (error2) this.handleError(error2, 'assign.insert_new');

    // 3. Update the leads table current cache
    const { error: error3 } = await this.supabase
      .from('leads')
      .update({ assigned_to: payload.assigned_to })
      .eq('id', payload.lead_id)
      .is('deleted_at', null);

    if (error3) this.handleError(error3, 'assign.update_lead');

    return data2;
  }

  async getWorkload(userIds?: string[]): Promise<WorkloadStatisticsDto[]> {
    // Since we don't have a direct GroupBy count RPC, we query active leads
    let q = this.supabase
      .from('leads')
      .select('assigned_to')
      .is('deleted_at', null)
      .not('assigned_to', 'is', null)
      .not('lead_status', 'in', '("CLOSED", "LOST")');

    if (userIds && userIds.length > 0) {
      q = q.in('assigned_to', userIds);
    }

    const { data, error } = await q;
    if (error) this.handleError(error, 'getWorkload');

    const workloadMap: Record<string, number> = {};
    if (userIds) {
      userIds.forEach(id => workloadMap[id] = 0);
    }
    
    (data || []).forEach(row => {
      const u = row.assigned_to;
      if (u) {
        workloadMap[u] = (workloadMap[u] || 0) + 1;
      }
    });

    return Object.entries(workloadMap).map(([user_id, active_leads]) => ({
      user_id,
      active_leads
    }));
  }

  async findHistory(leadId: string): Promise<LeadAssignmentEntity[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('lead_id', leadId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) this.handleError(error, 'findHistory');
    return data || [];
  }
}
