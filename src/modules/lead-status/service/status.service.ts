import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { StatusRepository } from "../repository/status.repository";
import { LeadRepository } from "../../leads/repository/lead.repository";
import { 
  ChangeLeadStatusDto, 
  BulkLeadStatusDto,
  ReopenLeadDto
} from "../dto/status.dto";
import { ValidationError, ConflictError, NotFoundError } from "@/lib/errors/domain.error";

export class StatusService extends BaseService {
  private repository: StatusRepository;
  private leadRepository: LeadRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new StatusRepository(supabase);
    this.leadRepository = new LeadRepository(supabase);
  }

  async getHistory(leadId: string) {
    return this.executeSafe(async () => {
      return await this.repository.getHistory(leadId);
    });
  }

  async getPipeline() {
    return this.executeSafe(async () => {
      return await this.repository.getPipeline();
    });
  }

  async changeStatus(leadId: string, dto: ChangeLeadStatusDto, userId: string) {
    return this.executeSafe(async () => {
      const lead = await this.leadRepository.findById(leadId);
      if (!lead || lead.deleted_at) throw new NotFoundError("Lead");

      if (['WON', 'LOST', 'CLOSED'].includes(lead.lead_status)) {
        throw new ConflictError("Lead is in a terminal state. Use the /reopen endpoint to modify it.");
      }

      await this.repository.changeStatus(
        leadId,
        dto.new_status,
        lead.lead_status,
        userId,
        dto.reason || null,
        dto.win_reason || null,
        dto.lost_reason || null,
        dto.close_reason || null
      );
      return { success: true, lead_id: leadId, new_status: dto.new_status };
    });
  }

  async reopenLead(leadId: string, dto: ReopenLeadDto, userId: string) {
    return this.executeSafe(async () => {
      const lead = await this.leadRepository.findById(leadId);
      if (!lead || lead.deleted_at) throw new NotFoundError("Lead");

      if (!['WON', 'LOST', 'CLOSED'].includes(lead.lead_status)) {
        throw new ConflictError("Lead is not in a terminal state, cannot reopen.");
      }

      await this.repository.changeStatus(
        leadId,
        'NEW', // Resetting back to start, or could be 'NEGOTIATION' based on business rules. We'll use NEW.
        lead.lead_status,
        userId,
        `[REOPENED] ${dto.reason}`,
        null,
        null,
        null
      );
      return { success: true, lead_id: leadId, new_status: 'NEW' };
    });
  }

  async bulkChangeStatus(dto: BulkLeadStatusDto, userId: string) {
    return this.executeSafe(async () => {
      if (['WON', 'LOST', 'CLOSED'].includes(dto.new_status)) {
         throw new ValidationError("Cannot bulk update leads into terminal states due to missing mandatory reasons.");
      }

      const results = [];
      for (const leadId of dto.lead_ids) {
        try {
          const lead = await this.leadRepository.findById(leadId);
          if (lead && !lead.deleted_at && !['WON', 'LOST', 'CLOSED'].includes(lead.lead_status)) {
            await this.repository.changeStatus(
              leadId,
              dto.new_status,
              lead.lead_status,
              userId,
              dto.reason || null,
              null, null, null
            );
            results.push(leadId);
          }
        } catch (e) {
          // ignore individual failures in bulk
        }
      }
      return { success_count: results.length, total: dto.lead_ids.length };
    });
  }

  async getStatistics() {
    return this.executeSafe(async () => {
      const pipeline = await this.repository.getPipeline();
      const totals = pipeline.reduce((acc, stage) => {
        if (stage.status === 'WON') acc.won += stage.count;
        else if (stage.status === 'LOST') acc.lost += stage.count;
        acc.total += stage.count;
        return acc;
      }, { won: 0, lost: 0, total: 0 });

      const win_rate = totals.total > 0 ? (totals.won / totals.total) * 100 : 0;
      const loss_rate = totals.total > 0 ? (totals.lost / totals.total) * 100 : 0;
      const conversion_rate = win_rate; 

      // Stage duration is complex to avg without a dedicated RPC, stubbed for phase.
      const average_stage_duration_minutes = 1440; // placeholder 1 day

      return {
        win_rate: parseFloat(win_rate.toFixed(2)),
        loss_rate: parseFloat(loss_rate.toFixed(2)),
        conversion_rate: parseFloat(conversion_rate.toFixed(2)),
        average_stage_duration_minutes
      };
    });
  }
}
