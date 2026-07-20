import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { TimelineRepository } from "../repository/timeline.repository";
import { LeadRepository } from "../../leads/repository/lead.repository";
import { 
  LeadTimelineFilterDto,
  LeadTimelineSearchDto
} from "../dto/timeline.dto";
import { ValidationError, NotFoundError } from "@/lib/errors/domain.error";

export class TimelineService extends BaseService {
  private repository: TimelineRepository;
  private leadRepository: LeadRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new TimelineRepository(supabase);
    this.leadRepository = new LeadRepository(supabase);
  }

  async getTimeline(query: LeadTimelineFilterDto) {
    return this.executeSafe(async () => {
      // If lead_id is provided, ensure it exists
      if (query.lead_id) {
        const lead = await this.leadRepository.findById(query.lead_id);
        if (!lead || lead.deleted_at) throw new NotFoundError("Lead");
      }
      return await this.repository.getTimeline(query);
    });
  }

  async searchTimeline(query: LeadTimelineSearchDto) {
    return this.executeSafe(async () => {
      return await this.repository.searchTimeline(query);
    });
  }

  async getLatestEvents(leadId: string, limit: number = 5) {
    return this.executeSafe(async () => {
      const lead = await this.leadRepository.findById(leadId);
      if (!lead || lead.deleted_at) throw new NotFoundError("Lead");

      return await this.repository.findLatest(leadId, limit);
    });
  }

  /**
   * Internal method exposed to other CRM modules to safely publish events into the ledger.
   * This is never exposed via a direct POST route.
   */
  async publishEvent(payload: {
    lead_id: string;
    category: string;
    event_type: string;
    title: string;
    description?: string;
    actor_id?: string;
    actor_role?: string;
    source_module: string;
    reference_entity?: string;
    reference_id?: string;
    metadata?: Record<string, any>;
  }) {
    return this.executeSafe(async () => {
      await this.repository.logEvent(payload);
      return true;
    });
  }

  async getStatistics() {
    return this.executeSafe(async () => {
      // For Phase 7.5.7, return stubbed stats. In production, this would query aggregation views.
      return {
        total_events: 0,
        events_by_category: {}
      };
    });
  }
}
