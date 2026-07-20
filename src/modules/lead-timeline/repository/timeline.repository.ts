import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { LeadTimelineEntity } from "@/types/timeline.types";
import { Modules } from "@/lib/constants/modules";
import { LeadTimelineFilterDto, LeadTimelineSearchDto } from "../dto/timeline.dto";

export class TimelineRepository extends BaseRepository<LeadTimelineEntity, any, any> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.LEAD_TIMELINE);
  }

  async getTimeline(query: LeadTimelineFilterDto): Promise<{ data: any[]; count: number }> {
    const { page, limit, lead_id, category, event_type, actor_id, date_from, date_to } = query;
    const offset = (page! - 1) * limit!;

    let q = this.supabase
      .from(this.tableName)
      .select('*, actor:actor_id(id)', { count: 'exact' })
      .range(offset, offset + limit! - 1)
      .order('occurred_at', { ascending: false }); // Chronological reverse

    if (lead_id) q = q.eq('lead_id', lead_id);
    if (category) q = q.eq('category', category);
    if (event_type) q = q.eq('event_type', event_type);
    if (actor_id) q = q.eq('actor_id', actor_id);
    if (date_from) q = q.gte('occurred_at', date_from);
    if (date_to) q = q.lte('occurred_at', date_to);

    const { data, count, error } = await q;
    if (error) this.handleError(error, 'getTimeline');

    return { data: data || [], count: count || 0 };
  }

  async searchTimeline(query: LeadTimelineSearchDto): Promise<{ data: any[]; count: number }> {
    const { page, limit, query: textQuery, lead_id } = query;
    const offset = (page! - 1) * limit!;

    let q = this.supabase
      .from(this.tableName)
      .select('*, actor:actor_id(id)', { count: 'exact' })
      .range(offset, offset + limit! - 1)
      .order('occurred_at', { ascending: false });

    if (lead_id) q = q.eq('lead_id', lead_id);

    // Simplistic full text search over title and description. Real PG would use proper fts vector.
    if (textQuery) {
      q = q.or(`title.ilike.%${textQuery}%,description.ilike.%${textQuery}%`);
    }

    const { data, count, error } = await q;
    if (error) this.handleError(error, 'searchTimeline');

    return { data: data || [], count: count || 0 };
  }

  async findLatest(leadId: string, limit: number = 5): Promise<LeadTimelineEntity[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('lead_id', leadId)
      .order('occurred_at', { ascending: false })
      .limit(limit);

    if (error) this.handleError(error, 'findLatest');
    return data || [];
  }

  async logEvent(payload: Partial<LeadTimelineEntity>): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .insert([payload]);

    if (error) this.handleError(error, 'logEvent');
  }
}
