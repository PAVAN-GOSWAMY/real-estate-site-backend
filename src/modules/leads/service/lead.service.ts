import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { LeadRepository } from "../repository/lead.repository";
import { PropertyRepository } from "../../properties/repository/property.repository";
import { ProjectRepository } from "../../projects/repository/project.repository";
import { 
  CreateLeadDto, 
  UpdateLeadDto, 
  MergeLeadDto, 
  LeadFilterDto, 
  DuplicateCheckDto 
} from "../dto/lead.dto";
import { ValidationError, ConflictError, NotFoundError } from "@/lib/errors/domain.error";

export class LeadService extends BaseService {
  private repository: LeadRepository;
  private propertyRepository: PropertyRepository;
  private projectRepository: ProjectRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new LeadRepository(supabase);
    this.propertyRepository = new PropertyRepository(supabase);
    this.projectRepository = new ProjectRepository(supabase);
  }

  private async validateRelationships(projectId?: string | null, propertyId?: string | null) {
    if (projectId) {
      const project = await this.projectRepository.findById(projectId);
      if (!project) throw new NotFoundError(`Project ID ${projectId} not found`);
    }
    if (propertyId) {
      const property = await this.propertyRepository.findById(propertyId);
      if (!property) throw new NotFoundError(`Property ID ${propertyId} not found`);
    }
  }

  async createLead(dto: CreateLeadDto) {
    return this.executeSafe(async () => {
      // 1. Duplicate Check: Strict Reject (Conflict) on Exact Match
      const existing = await this.repository.findByPhoneOrEmail(
        dto.phone_number, 
        dto.email ? dto.email : undefined
      );

      if (existing) {
        throw new ConflictError(`A lead already exists with this phone number or email (Lead ID: ${existing.id}). Use merge or update.`);
      }

      // 2. Validate Relationships
      await this.validateRelationships(dto.project_id, dto.property_id);

      // 3. Create
      return await this.repository.create(dto as any);
    });
  }

  async updateLead(id: string, dto: UpdateLeadDto) {
    return this.executeSafe(async () => {
      const lead = await this.repository.findById(id);
      if (!lead || lead.deleted_at) throw new NotFoundError("Lead");

      if (dto.phone_number || dto.email) {
        const existing = await this.repository.findByPhoneOrEmail(
          dto.phone_number || undefined, 
          dto.email || undefined,
          id
        );
        if (existing) {
          throw new ConflictError("Another lead already exists with this phone number or email.");
        }
      }

      await this.validateRelationships(dto.project_id, dto.property_id);

      // Simple Qualification Hook
      let finalDto = { ...dto };
      if (lead.lead_status === 'NEW' && dto.lead_status === 'QUALIFIED') {
        // e.g., enforce rules if qualifying
        if (!finalDto.budget_max && !lead.budget_max) {
           // Maybe budget isn't strictly required, but we can set priority here
           finalDto.crm_priority = 'HIGH';
        }
      }

      return await this.repository.update(id, finalDto);
    });
  }

  async deleteLead(id: string) {
    return this.executeSafe(async () => {
      const lead = await this.repository.findById(id);
      if (!lead || lead.deleted_at) throw new NotFoundError("Lead");
      
      // Soft delete
      return await this.repository.update(id, { deleted_at: new Date().toISOString() });
    });
  }

  async getLeads(query: LeadFilterDto) {
    return this.executeSafe(async () => {
      return await this.repository.getLeads(query);
    });
  }

  async getLead(id: string) {
    return this.executeSafe(async () => {
      const lead = await this.repository.findById(id);
      if (!lead || lead.deleted_at) throw new NotFoundError("Lead");
      return lead;
    });
  }

  async checkDuplicates(dto: DuplicateCheckDto) {
    return this.executeSafe(async () => {
      const duplicates = await this.repository.findDuplicates(
        dto.phone_number, 
        dto.email
      );
      
      return {
        has_duplicates: duplicates.length > 0,
        duplicates
      };
    });
  }

  async mergeLeads(dto: MergeLeadDto) {
    return this.executeSafe(async () => {
      const primary = await this.repository.findById(dto.primary_lead_id);
      const secondary = await this.repository.findById(dto.secondary_lead_id);

      if (!primary || primary.deleted_at) throw new NotFoundError("Primary Lead");
      if (!secondary || secondary.deleted_at) throw new NotFoundError("Secondary Lead");

      // We implement a "soft merge" - updating primary with secondary's fields if primary lacks them
      const updates: any = {};
      
      if (!primary.email && secondary.email) updates.email = secondary.email;
      if (!primary.alternate_phone && secondary.phone_number) updates.alternate_phone = secondary.phone_number;
      if (!primary.city && secondary.city) updates.city = secondary.city;
      
      if (dto.transfer_relationships) {
        if (!primary.project_id && secondary.project_id) updates.project_id = secondary.project_id;
        if (!primary.property_id && secondary.property_id) updates.property_id = secondary.property_id;
      }

      if (dto.transfer_notes && secondary.remarks) {
        updates.remarks = primary.remarks 
          ? `${primary.remarks}\n\n[Merged from Secondary]: ${secondary.remarks}` 
          : `[Merged from Secondary]: ${secondary.remarks}`;
      }

      // Update Primary
      if (Object.keys(updates).length > 0) {
        await this.repository.update(primary.id, updates);
      }

      // Soft delete secondary and mark as closed/lost
      await this.repository.update(secondary.id, { 
        deleted_at: new Date().toISOString(),
        lead_status: 'CLOSED',
        lost_reason: `Merged into ${primary.id}`
      });

      return await this.repository.findById(primary.id);
    });
  }

  async getStatistics() {
    return this.executeSafe(async () => {
      return await this.repository.getStatistics();
    });
  }
  async bulkCreateLeads(leads: any[], userId: string) {
    return this.executeSafe(async () => {
      // Very simple bulk orchestrator. In a robust system, you'd iterate and skip dupes, or mark them failed.
      const mapped = leads.map(l => ({ ...l, created_by: userId }));
      return await this.repository.bulkCreate(mapped);
    });
  }

  async bulkUpdateLeads(leads: any[]) {
    return this.executeSafe(async () => {
      return await this.repository.bulkUpdate(leads);
    });
  }

  async bulkDeleteLeads(ids: string[]) {
    return this.executeSafe(async () => {
      await this.repository.bulkDelete(ids);
    });
  }
}
