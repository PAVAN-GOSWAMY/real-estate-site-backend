import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { LeadEntity } from "@/types/lead.types";
import { Modules } from "@/lib/constants/modules";
import { LeadFilterDto } from "../dto/lead.dto";

export class LeadRepository extends BaseRepository<LeadEntity, any, any> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.LEADS);
  }

  async findByPhoneOrEmail(phone: string | undefined, email: string | undefined, excludeId?: string): Promise<LeadEntity | null> {
    if (!phone && !email) return null;

    let q = this.supabase
      .from(this.tableName)
      .select('*')
      .is('deleted_at', null);

    if (phone && email) {
      q = q.or(`phone_number.eq.${phone},email.eq.${email}`);
    } else if (phone) {
      q = q.eq('phone_number', phone);
    } else if (email) {
      q = q.eq('email', email);
    }

    if (excludeId) {
      q = q.neq('id', excludeId);
    }

    const { data, error } = await q.limit(1).maybeSingle();
    if (error) this.handleError(error, 'findByPhoneOrEmail');
    
    return data;
  }

  async findDuplicates(phone: string | undefined, email: string | undefined, excludeId?: string): Promise<LeadEntity[]> {
    if (!phone && !email) return [];

    let q = this.supabase
      .from(this.tableName)
      .select('*')
      .is('deleted_at', null);

    if (phone && email) {
      q = q.or(`phone_number.eq.${phone},email.eq.${email}`);
    } else if (phone) {
      q = q.eq('phone_number', phone);
    } else if (email) {
      q = q.eq('email', email);
    }

    if (excludeId) {
      q = q.neq('id', excludeId);
    }

    const { data, error } = await q;
    if (error) this.handleError(error, 'findDuplicates');
    
    return data || [];
  }

  async getLeads(query: LeadFilterDto): Promise<{ data: any[]; count: number }> {
    const { page, limit, search, source, status, priority, assigned_to, project_id, property_id, city } = query;
    const offset = (page! - 1) * limit!;

    let q = this.supabase
      .from(this.tableName)
      .select('*, projects(id, project_name), properties(id, unit_code)', { count: 'exact' })
      .is('deleted_at', null)
      .range(offset, offset + limit! - 1)
      .order('created_at', { ascending: false });

    if (source) q = q.eq('lead_source', source);
    if (status) q = q.eq('lead_status', status);
    if (priority) q = q.eq('crm_priority', priority);
    if (assigned_to) q = q.eq('assigned_to', assigned_to);
    if (project_id) q = q.eq('project_id', project_id);
    if (property_id) q = q.eq('property_id', property_id);
    if (city) q = q.ilike('city', `%${city}%`);

    if (search) {
      q = q.or(`full_name.ilike.%${search}%,phone_number.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, count, error } = await q;

    if (error) this.handleError(error, 'getLeads');
    return { data: data || [], count: count || 0 };
  }

  async getStatistics(): Promise<any> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('lead_status, lead_source')
      .is('deleted_at', null);

    if (error) this.handleError(error, 'getStatistics');

    const stats = {
      total_leads: 0,
      new_leads: 0,
      qualified_leads: 0,
      converted_leads: 0,
      sources_breakdown: {} as Record<string, number>,
      status_breakdown: {} as Record<string, number>,
    };

    if (data) {
      stats.total_leads = data.length;
      data.forEach(lead => {
        // Status counts
        if (lead.lead_status === 'NEW') stats.new_leads++;
        if (lead.lead_status === 'QUALIFIED') stats.qualified_leads++;
        if (lead.lead_status === 'BOOKED' || lead.lead_status === 'WON') stats.converted_leads++;

        // Breakdowns
        stats.status_breakdown[lead.lead_status] = (stats.status_breakdown[lead.lead_status] || 0) + 1;
        stats.lead_source = lead.lead_source;
        stats.sources_breakdown[lead.lead_source] = (stats.sources_breakdown[lead.lead_source] || 0) + 1;
      });
    }

    return stats;
  }
  async bulkCreate(leads: any[]): Promise<any[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(leads)
      .select();
      
    if (error) this.handleError(error, 'bulkCreate');
    return data || [];
  }

  async bulkUpdate(leads: any[]): Promise<any[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .upsert(leads, { onConflict: 'id' })
      .select();
      
    if (error) this.handleError(error, 'bulkUpdate');
    return data || [];
  }

  async bulkDelete(ids: string[]): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ deleted_at: new Date().toISOString() })
      .in('id', ids);
      
    if (error) this.handleError(error, 'bulkDelete');
  }
}
