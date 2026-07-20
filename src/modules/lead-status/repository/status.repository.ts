import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { LeadStatusHistoryEntity } from "@/types/status.types";
import { Modules } from "@/lib/constants/modules";

export class StatusRepository extends BaseRepository<LeadStatusHistoryEntity, any, any> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.LEAD_STATUS); // using lead_status_history table
  }

  async getHistory(leadId: string): Promise<LeadStatusHistoryEntity[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('lead_id', leadId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) this.handleError(error, 'getHistory');
    return data || [];
  }

  async changeStatus(
    leadId: string, 
    newStatus: string, 
    previousStatus: string | null,
    changedBy: string,
    reason: string | null,
    winReason: string | null,
    lostReason: string | null,
    closeReason: string | null
  ): Promise<void> {
    // 1. Calculate duration since last change
    let durationMinutes = null;
    const { data: lastHistory } = await this.supabase
      .from(this.tableName)
      .select('created_at')
      .eq('lead_id', leadId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (lastHistory) {
      const ms = new Date().getTime() - new Date(lastHistory.created_at).getTime();
      durationMinutes = Math.floor(ms / 60000);
    }

    // 2. Insert into history
    const { error: error1 } = await this.supabase
      .from(this.tableName)
      .insert([{
        lead_id: leadId,
        previous_status: previousStatus,
        new_status: newStatus,
        changed_by: changedBy,
        reason: reason,
        duration_minutes: durationMinutes
      }]);

    if (error1) this.handleError(error1, 'changeStatus.insert_history');

    // 3. Update Leads table
    const leadUpdate: any = { lead_status: newStatus };
    if (winReason) leadUpdate.win_reason = winReason;
    if (lostReason) leadUpdate.lost_reason = lostReason;
    if (closeReason) leadUpdate.close_reason = closeReason;

    const { error: error2 } = await this.supabase
      .from('leads')
      .update(leadUpdate)
      .eq('id', leadId)
      .is('deleted_at', null);

    if (error2) this.handleError(error2, 'changeStatus.update_lead');
  }

  async getPipeline(): Promise<any[]> {
    // Group leads by lead_status
    // Supabase RPC or direct select if RPC not available. We'll query and group in memory if needed or use aggregation if we can.
    // For simplicity, we fetch all active leads' status.
    const { data, error } = await this.supabase
      .from('leads')
      .select('lead_status, budget_max')
      .is('deleted_at', null);

    if (error) this.handleError(error, 'getPipeline');

    const pipeline: Record<string, { count: number; value: number }> = {};
    (data || []).forEach(lead => {
      const status = lead.lead_status;
      if (!pipeline[status]) pipeline[status] = { count: 0, value: 0 };
      pipeline[status].count++;
      if (lead.budget_max) pipeline[status].value += Number(lead.budget_max);
    });

    return Object.entries(pipeline).map(([status, stats]) => ({
      status,
      count: stats.count,
      value: stats.value
    }));
  }
}
