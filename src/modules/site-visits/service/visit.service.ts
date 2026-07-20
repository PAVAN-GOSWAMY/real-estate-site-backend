import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { VisitRepository } from "../repository/visit.repository";
import { LeadRepository } from "../../leads/repository/lead.repository";
import { TimelineService } from "../../lead-timeline/service/timeline.service";
import { 
  CreateSiteVisitDto, 
  UpdateSiteVisitDto,
  CheckInSiteVisitDto,
  CheckOutSiteVisitDto,
  RescheduleSiteVisitDto,
  CancelSiteVisitDto,
  SiteVisitFeedbackDto,
  SiteVisitSearchDto
} from "../dto/visit.dto";
import { ValidationError, ConflictError, NotFoundError } from "@/lib/errors/domain.error";

export class VisitService extends BaseService {
  private repository: VisitRepository;
  private leadRepository: LeadRepository;
  private timelineService: TimelineService;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new VisitRepository(supabase);
    this.leadRepository = new LeadRepository(supabase);
    this.timelineService = new TimelineService(supabase);
  }

  async searchVisits(query: SiteVisitSearchDto) {
    return this.executeSafe(async () => {
      return await this.repository.searchVisits(query);
    });
  }

  async getVisit(id: string) {
    return this.executeSafe(async () => {
      const visit = await this.repository.findById(id);
      if (!visit || visit.deleted_at) throw new NotFoundError("Site Visit");
      return visit;
    });
  }

  async getToday() {
    return this.executeSafe(async () => this.repository.findToday());
  }

  async getUpcoming() {
    return this.executeSafe(async () => this.repository.findUpcoming());
  }

  async createVisit(dto: CreateSiteVisitDto, userId: string) {
    return this.executeSafe(async () => {
      const lead = await this.leadRepository.findById(dto.lead_id);
      if (!lead || lead.deleted_at) throw new NotFoundError("Lead");

      const payload = { ...dto, visit_status: 'SCHEDULED' };
      const created = await this.repository.create(payload as any);

      // Publish to Timeline
      await this.timelineService.publishEvent({
        lead_id: lead.id,
        category: 'Site Visit',
        event_type: 'VISIT_SCHEDULED',
        title: `Site Visit Scheduled: ${dto.visit_title}`,
        actor_id: userId,
        source_module: 'site_visits',
        reference_entity: 'site_visits',
        reference_id: created.id,
        metadata: { date: dto.scheduled_date, time: dto.scheduled_start_time }
      });

      return created;
    });
  }

  async updateVisit(id: string, dto: UpdateSiteVisitDto, userId: string) {
    return this.executeSafe(async () => {
      const visit = await this.getVisit(id);
      if (['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(visit.visit_status)) {
        throw new ConflictError("Cannot update a completed or cancelled visit.");
      }

      return await this.repository.update(id, dto);
    });
  }

  async confirmVisit(id: string, userId: string) {
    return this.executeSafe(async () => {
      const visit = await this.getVisit(id);
      if (visit.visit_status !== 'SCHEDULED' && visit.visit_status !== 'RESCHEDULED') {
        throw new ConflictError(`Cannot confirm visit in ${visit.visit_status} status.`);
      }

      await this.repository.updateState(id, { visit_status: 'CONFIRMED' });
      
      await this.timelineService.publishEvent({
        lead_id: visit.lead_id,
        category: 'Site Visit',
        event_type: 'VISIT_CONFIRMED',
        title: `Site Visit Confirmed: ${visit.visit_title}`,
        actor_id: userId,
        source_module: 'site_visits',
        reference_entity: 'site_visits',
        reference_id: id
      });

      return { success: true, id, visit_status: 'CONFIRMED' };
    });
  }

  async checkIn(id: string, dto: CheckInSiteVisitDto, userId: string) {
    return this.executeSafe(async () => {
      const visit = await this.getVisit(id);
      if (visit.visit_status !== 'CONFIRMED') {
        throw new ConflictError("Visit must be CONFIRMED before checking in.");
      }

      const updates: any = { 
        visit_status: 'IN_PROGRESS',
        actual_start_time: new Date().toISOString()
      };
      if (dto.latitude) updates.meeting_latitude = dto.latitude;
      if (dto.longitude) updates.meeting_longitude = dto.longitude;

      await this.repository.updateState(id, updates);

      await this.timelineService.publishEvent({
        lead_id: visit.lead_id,
        category: 'Site Visit',
        event_type: 'VISIT_CHECKED_IN',
        title: `Customer Checked-in: ${visit.visit_title}`,
        actor_id: userId,
        source_module: 'site_visits',
        reference_entity: 'site_visits',
        reference_id: id,
        metadata: { lat: dto.latitude, lng: dto.longitude }
      });

      return { success: true, id, visit_status: 'IN_PROGRESS' };
    });
  }

  async checkOut(id: string, dto: CheckOutSiteVisitDto, userId: string) {
    return this.executeSafe(async () => {
      const visit = await this.getVisit(id);
      if (visit.visit_status !== 'IN_PROGRESS') {
        throw new ConflictError("Visit must be IN_PROGRESS to check out.");
      }

      const updates: any = { 
        visit_status: 'COMPLETED',
        actual_end_time: new Date().toISOString(),
        customer_attended: dto.customer_attended,
        sales_executive_attended: dto.sales_executive_attended
      };
      
      if (!dto.customer_attended) {
        updates.visit_status = 'NO_SHOW';
      }

      await this.repository.updateState(id, updates);

      await this.timelineService.publishEvent({
        lead_id: visit.lead_id,
        category: 'Site Visit',
        event_type: updates.visit_status === 'COMPLETED' ? 'VISIT_COMPLETED' : 'VISIT_NO_SHOW',
        title: `Visit ${updates.visit_status === 'COMPLETED' ? 'Completed' : 'No-Show'}`,
        actor_id: userId,
        source_module: 'site_visits',
        reference_entity: 'site_visits',
        reference_id: id,
        metadata: { customer_attended: dto.customer_attended }
      });

      return { success: true, id, visit_status: updates.visit_status };
    });
  }

  async reschedule(id: string, dto: RescheduleSiteVisitDto, userId: string) {
    return this.executeSafe(async () => {
      const visit = await this.getVisit(id);
      if (['COMPLETED', 'CANCELLED'].includes(visit.visit_status)) {
        throw new ConflictError("Cannot reschedule a completed or cancelled visit.");
      }

      await this.repository.updateState(id, { 
        visit_status: 'RESCHEDULED',
        scheduled_date: dto.scheduled_date,
        scheduled_start_time: dto.scheduled_start_time,
        scheduled_end_time: dto.scheduled_end_time || null
      });

      await this.timelineService.publishEvent({
        lead_id: visit.lead_id,
        category: 'Site Visit',
        event_type: 'VISIT_RESCHEDULED',
        title: `Visit Rescheduled`,
        actor_id: userId,
        source_module: 'site_visits',
        reference_entity: 'site_visits',
        reference_id: id,
        metadata: { reason: dto.reason, new_date: dto.scheduled_date }
      });

      return { success: true, id, visit_status: 'RESCHEDULED' };
    });
  }

  async cancel(id: string, dto: CancelSiteVisitDto, userId: string) {
    return this.executeSafe(async () => {
      const visit = await this.getVisit(id);
      if (['COMPLETED', 'CANCELLED', 'IN_PROGRESS'].includes(visit.visit_status)) {
        throw new ConflictError("Cannot cancel this visit in its current state.");
      }

      await this.repository.updateState(id, { visit_status: 'CANCELLED' });

      await this.timelineService.publishEvent({
        lead_id: visit.lead_id,
        category: 'Site Visit',
        event_type: 'VISIT_CANCELLED',
        title: `Visit Cancelled`,
        description: dto.reason,
        actor_id: userId,
        source_module: 'site_visits',
        reference_entity: 'site_visits',
        reference_id: id
      });

      return { success: true, id, visit_status: 'CANCELLED' };
    });
  }

  async saveFeedback(id: string, dto: SiteVisitFeedbackDto, userId: string) {
    return this.executeSafe(async () => {
      const visit = await this.getVisit(id);
      if (visit.visit_status !== 'COMPLETED') {
        throw new ConflictError("Feedback can only be submitted for COMPLETED visits.");
      }

      await this.repository.updateState(id, dto as any);

      await this.timelineService.publishEvent({
        lead_id: visit.lead_id,
        category: 'Site Visit',
        event_type: 'VISIT_FEEDBACK_SUBMITTED',
        title: `Visit Feedback Submitted`,
        actor_id: userId,
        source_module: 'site_visits',
        reference_entity: 'site_visits',
        reference_id: id,
        metadata: { outcome: dto.visit_outcome, rating: dto.feedback_rating }
      });

      return { success: true, id };
    });
  }

  async deleteVisit(id: string, userId: string) {
    return this.executeSafe(async () => {
      const visit = await this.getVisit(id);
      await this.repository.update(id, { deleted_at: new Date().toISOString() });
    });
  }
}
