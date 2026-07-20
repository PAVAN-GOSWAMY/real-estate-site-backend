import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { PreferenceRepository } from "../repository/preference.repository";
import { ProjectRepository } from "../../projects/repository/project.repository";
import { BuilderRepository } from "../../builders/repository/builder.repository";
import { LocationRepository } from "../../locations/repository/location.repository";
import { LeadRepository } from "../../leads/repository/lead.repository";
import { 
  CreateLeadPreferenceDto, 
  UpdateLeadPreferenceDto, 
  LeadPreferenceFilterDto, 
  LeadPreferenceRecommendationDto
} from "../dto/preference.dto";
import { ValidationError, ConflictError, NotFoundError } from "@/lib/errors/domain.error";

export class PreferenceService extends BaseService {
  private repository: PreferenceRepository;
  private leadRepository: LeadRepository;
  private projectRepository: ProjectRepository;
  private builderRepository: BuilderRepository;
  private locationRepository: LocationRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new PreferenceRepository(supabase);
    this.leadRepository = new LeadRepository(supabase);
    this.projectRepository = new ProjectRepository(supabase);
    this.builderRepository = new BuilderRepository(supabase);
    this.locationRepository = new LocationRepository(supabase);
  }

  private async validateRelationships(dto: Partial<CreateLeadPreferenceDto>) {
    if (dto.location_id) {
      const loc = await this.locationRepository.findById(dto.location_id);
      if (!loc || loc.deleted_at) throw new NotFoundError("Location");
    }
    if (dto.preferred_builder) {
      const bdr = await this.builderRepository.findById(dto.preferred_builder);
      if (!bdr || bdr.deleted_at) throw new NotFoundError("Builder");
    }
    if (dto.preferred_project) {
      const proj = await this.projectRepository.findById(dto.preferred_project);
      if (!proj || proj.deleted_at) throw new NotFoundError("Project");
      // Could also check if project.is_active is false depending on schema
    }
  }

  async createPreference(leadId: string, dto: CreateLeadPreferenceDto) {
    return this.executeSafe(async () => {
      // Check Lead
      const lead = await this.leadRepository.findById(leadId);
      if (!lead || lead.deleted_at) throw new NotFoundError("Lead");

      // Validate relationships
      await this.validateRelationships(dto);

      // Check Duplicates
      const isDupe = await this.repository.findDuplicates(leadId, dto);
      if (isDupe) throw new ConflictError("An exact matching preference profile already exists for this lead.");

      // Check if this is the first preference. If so, make it primary.
      const existing = await this.repository.findByLead(leadId, { page: 1, limit: 1 });
      const isFirst = existing.count === 0;
      
      const toCreate = {
        ...dto,
        lead_id: leadId,
        is_current: dto.is_current !== undefined ? dto.is_current : isFirst
      };

      const created = await this.repository.create(toCreate as any);

      if (toCreate.is_current && !isFirst) {
        await this.repository.setPrimary(leadId, created.id);
      }

      return await this.repository.findById(created.id);
    });
  }

  async updatePreference(leadId: string, id: string, dto: UpdateLeadPreferenceDto) {
    return this.executeSafe(async () => {
      const existing = await this.repository.findById(id);
      if (!existing || existing.deleted_at || existing.lead_id !== leadId) {
        throw new NotFoundError("Lead Preference");
      }

      await this.validateRelationships(dto);

      const updated = await this.repository.update(id, dto);

      if (dto.is_current) {
        await this.repository.setPrimary(leadId, id);
      }

      return updated;
    });
  }

  async deletePreference(leadId: string, id: string) {
    return this.executeSafe(async () => {
      const existing = await this.repository.findById(id);
      if (!existing || existing.deleted_at || existing.lead_id !== leadId) {
        throw new NotFoundError("Lead Preference");
      }
      
      await this.repository.update(id, { deleted_at: new Date().toISOString(), is_current: false });
    });
  }

  async setPrimary(leadId: string, id: string) {
    return this.executeSafe(async () => {
      const existing = await this.repository.findById(id);
      if (!existing || existing.deleted_at || existing.lead_id !== leadId) {
        throw new NotFoundError("Lead Preference");
      }
      
      await this.repository.setPrimary(leadId, id);
      return await this.repository.findById(id);
    });
  }

  async getPreferences(leadId: string, query: LeadPreferenceFilterDto) {
    return this.executeSafe(async () => {
      return await this.repository.findByLead(leadId, query);
    });
  }

  async getPreference(leadId: string, id: string) {
    return this.executeSafe(async () => {
      const existing = await this.repository.findById(id);
      if (!existing || existing.deleted_at || existing.lead_id !== leadId) {
        throw new NotFoundError("Lead Preference");
      }
      return existing;
    });
  }

  async getRecommendations(leadId: string): Promise<LeadPreferenceRecommendationDto | null> {
    return this.executeSafe(async () => {
      // Find the primary preference
      const res = await this.repository.findByLead(leadId, { page: 1, limit: 1, is_current: true });
      if (res.count === 0) return null;

      const pref = res.data[0];

      // Build structured payload for the future ML matching engine
      return {
        preference_id: pref.id,
        lead_id: leadId,
        must_haves: {
          location_id: pref.location_id,
          category_id: pref.category_id,
          budget_max: pref.budget_max,
        },
        nice_to_haves: {
          configuration_id: pref.configuration_id,
          minimum_area: pref.minimum_area,
          preferred_builder: pref.preferred_builder,
          parking_required: pref.parking_required
        },
        exclusions: {
          // If they want ready to move, exclude under construction, etc.
          status_exclusion: pref.preferred_possession_status === 'READY_TO_MOVE' ? 'UNDER_CONSTRUCTION' : null
        }
      };
    });
  }
}
