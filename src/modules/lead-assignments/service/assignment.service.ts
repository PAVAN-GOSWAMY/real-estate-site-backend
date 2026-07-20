import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { AssignmentRepository } from "../repository/assignment.repository";
import { LeadRepository } from "../../leads/repository/lead.repository";
import { 
  CreateLeadAssignmentDto, 
  UpdateLeadAssignmentDto, 
  BulkLeadAssignmentDto,
  ReassignLeadDto,
  RoundRobinAssignmentDto,
  LeadAssignmentFilterDto
} from "../dto/assignment.dto";
import { ValidationError, ConflictError, NotFoundError } from "@/lib/errors/domain.error";

export class AssignmentService extends BaseService {
  private repository: AssignmentRepository;
  private leadRepository: LeadRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new AssignmentRepository(supabase);
    this.leadRepository = new LeadRepository(supabase);
  }

  async getAssignments(query: LeadAssignmentFilterDto) {
    return this.executeSafe(async () => {
      return await this.repository.getAssignments(query);
    });
  }

  async getAssignmentHistory(leadId: string) {
    return this.executeSafe(async () => {
      return await this.repository.findHistory(leadId);
    });
  }

  async assignLead(dto: CreateLeadAssignmentDto) {
    return this.executeSafe(async () => {
      const lead = await this.leadRepository.findById(dto.lead_id);
      if (!lead || lead.deleted_at) throw new NotFoundError("Lead");

      // Check if already active
      const history = await this.repository.findHistory(dto.lead_id);
      const active = history.find(h => h.is_active);
      if (active && active.assigned_to === dto.assigned_to) {
        throw new ConflictError("Lead is already assigned to this user.");
      }

      return await this.repository.assign(dto);
    });
  }

  async reassignLead(dto: ReassignLeadDto, managerId: string) {
    return this.executeSafe(async () => {
      const lead = await this.leadRepository.findById(dto.lead_id);
      if (!lead || lead.deleted_at) throw new NotFoundError("Lead");

      const payload = {
        lead_id: dto.lead_id,
        assigned_to: dto.assigned_to,
        assigned_by: managerId,
        assignment_strategy: dto.assignment_strategy,
        assignment_reason: dto.assignment_reason
      };

      return await this.repository.assign(payload);
    });
  }

  async bulkAssign(dto: BulkLeadAssignmentDto, assignedBy: string) {
    return this.executeSafe(async () => {
      // Very simple loop for now. In real prod, we'd use a bulk RPC transaction.
      const results = [];
      for (const leadId of dto.lead_ids) {
        const payload = {
          lead_id: leadId,
          assigned_to: dto.assigned_to,
          assigned_by: assignedBy,
          assignment_strategy: dto.assignment_strategy,
          assignment_reason: dto.assignment_reason
        };
        try {
          const res = await this.repository.assign(payload);
          results.push(res);
        } catch (e) {
          // ignore or log individual failures
        }
      }
      return { success_count: results.length, total: dto.lead_ids.length };
    });
  }

  async roundRobinAssign(dto: RoundRobinAssignmentDto, assignedBy: string) {
    return this.executeSafe(async () => {
      if (!dto.pool_user_ids || dto.pool_user_ids.length === 0) {
        throw new ValidationError("Must provide a pool of user IDs for round robin.");
      }

      // Fetch workloads to sort pool
      const workloads = await this.repository.getWorkload(dto.pool_user_ids);
      
      // Sort users by workload ascending
      const sortedUsers = workloads.sort((a, b) => a.active_leads - b.active_leads).map(w => w.user_id);
      
      // Also add anyone in the pool who had 0 workload and didn't appear in the query
      for (const uid of dto.pool_user_ids) {
        if (!sortedUsers.includes(uid)) {
          sortedUsers.unshift(uid); // put 0 workload at front
        }
      }

      const results = [];
      let userIndex = 0;

      for (const leadId of dto.lead_ids) {
        const targetUserId = sortedUsers[userIndex % sortedUsers.length];
        const payload = {
          lead_id: leadId,
          assigned_to: targetUserId,
          assigned_by: assignedBy,
          assignment_strategy: 'ROUND_ROBIN',
          assignment_reason: "Automated Round Robin Distribution"
        };

        try {
          const res = await this.repository.assign(payload);
          results.push(res);
          userIndex++;
        } catch (e) {}
      }

      return { success_count: results.length, total: dto.lead_ids.length };
    });
  }

  async getWorkloadStatistics() {
    return this.executeSafe(async () => {
      return await this.repository.getWorkload();
    });
  }
}
