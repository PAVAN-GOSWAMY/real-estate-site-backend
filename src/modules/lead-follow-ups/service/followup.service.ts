import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { FollowUpRepository } from "../repository/followup.repository";
import { LeadRepository } from "../../leads/repository/lead.repository";
import { 
  CreateLeadFollowUpDto, 
  UpdateLeadFollowUpDto,
  CompleteFollowUpDto,
  RescheduleFollowUpDto,
  EscalateFollowUpDto,
  CancelFollowUpDto,
  LeadFollowUpFilterDto
} from "../dto/followup.dto";
import { ValidationError, ConflictError, NotFoundError } from "@/lib/errors/domain.error";

export class FollowUpService extends BaseService {
  private repository: FollowUpRepository;
  private leadRepository: LeadRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new FollowUpRepository(supabase);
    this.leadRepository = new LeadRepository(supabase);
  }

  async getFollowUps(query: LeadFollowUpFilterDto) {
    return this.executeSafe(async () => {
      return await this.repository.getFollowUps(query);
    });
  }

  async getFollowUp(id: string) {
    return this.executeSafe(async () => {
      const existing = await this.repository.findById(id);
      if (!existing || existing.deleted_at) throw new NotFoundError("Follow Up");
      return existing;
    });
  }

  async createFollowUp(dto: CreateLeadFollowUpDto, userId: string) {
    return this.executeSafe(async () => {
      const lead = await this.leadRepository.findById(dto.lead_id);
      if (!lead || lead.deleted_at) throw new NotFoundError("Lead");

      const payload = {
        ...dto,
        assigned_to: dto.assigned_to || lead.assigned_to || userId, // default to lead assignee or current user
        is_completed: false,
        lead_status_before: lead.lead_status,
      };

      return await this.repository.create(payload as any);
    });
  }

  async updateFollowUp(id: string, dto: UpdateLeadFollowUpDto) {
    return this.executeSafe(async () => {
      const existing = await this.repository.findById(id);
      if (!existing || existing.deleted_at) throw new NotFoundError("Follow Up");
      
      if (existing.is_completed) {
        throw new ConflictError("Cannot edit a completed follow-up.");
      }

      return await this.repository.update(id, dto);
    });
  }

  async deleteFollowUp(id: string) {
    return this.executeSafe(async () => {
      const existing = await this.repository.findById(id);
      if (!existing || existing.deleted_at) throw new NotFoundError("Follow Up");
      
      await this.repository.update(id, { deleted_at: new Date().toISOString() });
    });
  }

  async completeFollowUp(id: string, dto: CompleteFollowUpDto, userId: string) {
    return this.executeSafe(async () => {
      const existing = await this.repository.findById(id);
      if (!existing || existing.deleted_at) throw new NotFoundError("Follow Up");
      if (existing.is_completed) throw new ConflictError("Follow-up is already completed.");

      const payload: any = {
        is_completed: true,
        completed_at: new Date().toISOString(),
        outcome: dto.outcome,
        summary: dto.summary,
        detailed_notes: dto.detailed_notes,
        customer_response: dto.customer_response,
        internal_notes: dto.internal_notes,
        duration_minutes: dto.duration_minutes,
        lead_status_after: dto.lead_status_after
      };

      const updated = await this.repository.update(id, payload);

      // If next follow-up is scheduled, create it
      if (dto.next_follow_up_at) {
        await this.createFollowUp({
          lead_id: existing.lead_id,
          project_id: existing.project_id,
          property_id: existing.property_id,
          follow_up_type: dto.next_follow_up_type || existing.follow_up_type,
          subject: `Follow-up to: ${existing.subject}`,
          scheduled_at: dto.next_follow_up_at,
          priority: existing.priority,
          assigned_to: existing.assigned_to
        } as any, userId);
      }

      // If lead status changed, update lead
      if (dto.lead_status_after && dto.lead_status_after !== existing.lead_status_before) {
        await this.leadRepository.update(existing.lead_id, { lead_status: dto.lead_status_after });
      }

      return updated;
    });
  }

  async cancelFollowUp(id: string, dto: CancelFollowUpDto) {
    return this.executeSafe(async () => {
      const existing = await this.repository.findById(id);
      if (!existing || existing.deleted_at) throw new NotFoundError("Follow Up");
      if (existing.is_completed) throw new ConflictError("Follow-up is already completed.");

      return await this.repository.update(id, {
        is_completed: true, // effectively closing it
        completed_at: new Date().toISOString(),
        outcome: 'Cancelled',
        internal_notes: existing.internal_notes 
          ? `${existing.internal_notes}\n[Cancelled]: ${dto.cancellation_reason}`
          : `[Cancelled]: ${dto.cancellation_reason}`
      });
    });
  }

  async rescheduleFollowUp(id: string, dto: RescheduleFollowUpDto) {
    return this.executeSafe(async () => {
      const existing = await this.repository.findById(id);
      if (!existing || existing.deleted_at) throw new NotFoundError("Follow Up");
      if (existing.is_completed) throw new ConflictError("Follow-up is already completed.");

      const payload: any = { scheduled_at: dto.scheduled_at };
      if (dto.internal_notes) {
        payload.internal_notes = existing.internal_notes 
          ? `${existing.internal_notes}\n[Rescheduled]: ${dto.internal_notes}`
          : `[Rescheduled]: ${dto.internal_notes}`;
      }

      return await this.repository.update(id, payload);
    });
  }

  async escalateFollowUp(id: string, dto: EscalateFollowUpDto) {
    return this.executeSafe(async () => {
      const existing = await this.repository.findById(id);
      if (!existing || existing.deleted_at) throw new NotFoundError("Follow Up");

      const internalNotes = existing.internal_notes 
        ? `${existing.internal_notes}\n[ESCALATED]: ${dto.escalation_reason}`
        : `[ESCALATED]: ${dto.escalation_reason}`;

      return await this.repository.update(id, {
        priority: dto.priority,
        internal_notes: internalNotes
      });
    });
  }

  async getTemporalFollowUps(state: 'overdue' | 'today' | 'upcoming', assignedTo?: string) {
    return this.executeSafe(async () => {
      return await this.repository.getByTemporalState(state, assignedTo);
    });
  }

  async getStatistics() {
    return this.executeSafe(async () => {
      return await this.repository.getStatistics();
    });
  }
}
