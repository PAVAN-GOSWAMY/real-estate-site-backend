import { createClient } from "@/lib/supabase/server";
import { Lead, LeadActivity, LeadNote, LeadFollowUp, LeadAttachment, CreateLeadInput, UpdateLeadInput, CreateLeadNoteInput, CreateLeadFollowUpInput } from "../types";

export class LeadsRepository {
  static async getLeads(filters: { status?: string; source?: string; priority?: string; assignedTo?: string; search?: string }, page = 1, pageSize = 20) {
    const supabase = await createClient();
    
    let query = supabase
      .from("leads")
      .select(`
        *,
        properties (title),
        builders (name)
      `, { count: "exact" });

    if (filters.status && filters.status !== 'all') query = query.eq("status", filters.status);
    if (filters.source && filters.source !== 'all') query = query.eq("source", filters.source);
    if (filters.priority && filters.priority !== 'all') query = query.eq("priority", filters.priority);
    if (filters.assignedTo && filters.assignedTo !== 'all') query = query.eq("assigned_to_email", filters.assignedTo);
    
    if (filters.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
    }

    query = query.order("created_at", { ascending: false });
    
    const offset = (page - 1) * pageSize;
    query = query.range(offset, offset + pageSize - 1);

    const { data, count, error } = await query;
    if (error) throw new Error(`Database error: ${error.message}`);

    const mapped = (data || []).map((row: any) => this.mapLeadRow(row));
    return { leads: mapped, totalCount: count || 0, totalPages: Math.ceil((count || 0) / pageSize) };
  }

  static async getLeadById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("leads")
      .select(`
        *,
        properties (title),
        builders (name)
      `)
      .eq("id", id)
      .single();

    if (error) throw new Error(`Database error: ${error.message}`);
    return this.mapLeadRow(data);
  }

  static async createLead(input: CreateLeadInput) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        full_name: input.fullName,
        email: input.email || null,
        phone: input.phone || null,
        source: input.source,
        property_id: input.propertyId || null,
        builder_id: input.builderId || null,
        message: input.message || null,
        assigned_to_email: input.assignedToEmail || null,
        priority: input.priority,
        status: input.status,
        preferred_visit_date: input.preferredVisitDate || null,
        budget: input.budget || null,
      })
      .select()
      .single();

    if (error) throw new Error(`Database error: ${error.message}`);
    return this.mapLeadRow(data);
  }

  static async updateLead(input: UpdateLeadInput) {
    const supabase = await createClient();
    const updateData: any = {};
    if (input.fullName !== undefined) updateData.full_name = input.fullName;
    if (input.email !== undefined) updateData.email = input.email || null;
    if (input.phone !== undefined) updateData.phone = input.phone || null;
    if (input.propertyId !== undefined) updateData.property_id = input.propertyId || null;
    if (input.builderId !== undefined) updateData.builder_id = input.builderId || null;
    if (input.message !== undefined) updateData.message = input.message || null;
    if (input.assignedToEmail !== undefined) updateData.assigned_to_email = input.assignedToEmail || null;
    if (input.priority !== undefined) updateData.priority = input.priority;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.preferredVisitDate !== undefined) updateData.preferred_visit_date = input.preferredVisitDate || null;
    if (input.budget !== undefined) updateData.budget = input.budget || null;

    const { data, error } = await supabase
      .from("leads")
      .update(updateData)
      .eq("id", input.id)
      .select()
      .single();

    if (error) throw new Error(`Database error: ${error.message}`);
    return this.mapLeadRow(data);
  }

  // Activities
  static async getLeadActivities(leadId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lead_activities")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Database error: ${error.message}`);
    return data.map((row: any) => ({
      id: row.id,
      leadId: row.lead_id,
      actionType: row.action_type,
      description: row.description,
      createdByEmail: row.created_by_email,
      createdAt: row.created_at,
    })) as LeadActivity[];
  }

  static async createActivity(leadId: string, actionType: string, description: string, createdByEmail: string) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("lead_activities")
      .insert({
        lead_id: leadId,
        action_type: actionType,
        description,
        created_by_email: createdByEmail,
      });

    if (error) throw new Error(`Database error: ${error.message}`);
  }

  // Notes
  static async getLeadNotes(leadId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lead_notes")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Database error: ${error.message}`);
    return data.map((row: any) => ({
      id: row.id,
      leadId: row.lead_id,
      content: row.content,
      createdByEmail: row.created_by_email,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })) as LeadNote[];
  }

  static async createNote(input: CreateLeadNoteInput, createdByEmail: string) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("lead_notes")
      .insert({
        lead_id: input.leadId,
        content: input.content,
        created_by_email: createdByEmail,
      });

    if (error) throw new Error(`Database error: ${error.message}`);
  }

  // Follow-ups
  static async getLeadFollowUps(leadId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lead_follow_ups")
      .select("*")
      .eq("lead_id", leadId)
      .order("follow_up_date", { ascending: true });

    if (error) throw new Error(`Database error: ${error.message}`);
    return data.map((row: any) => ({
      id: row.id,
      leadId: row.lead_id,
      followUpDate: row.follow_up_date,
      reminderType: row.reminder_type,
      comment: row.comment,
      status: row.status,
      createdByEmail: row.created_by_email,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })) as LeadFollowUp[];
  }

  static async createFollowUp(input: CreateLeadFollowUpInput, createdByEmail: string) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("lead_follow_ups")
      .insert({
        lead_id: input.leadId,
        follow_up_date: input.followUpDate,
        reminder_type: input.reminderType,
        comment: input.comment || null,
        created_by_email: createdByEmail,
      });

    if (error) throw new Error(`Database error: ${error.message}`);
  }

  static async updateFollowUpStatus(id: string, status: string) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("lead_follow_ups")
      .update({ status })
      .eq("id", id);

    if (error) throw new Error(`Database error: ${error.message}`);
  }

  // Attachments
  static async getLeadAttachments(leadId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lead_attachments")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Database error: ${error.message}`);
    return data.map((row: any) => ({
      id: row.id,
      leadId: row.lead_id,
      fileName: row.file_name,
      fileUrl: row.file_url,
      fileSize: Number(row.file_size),
      uploadedByEmail: row.uploaded_by_email,
      createdAt: row.created_at,
    })) as LeadAttachment[];
  }

  static async createAttachment(leadId: string, fileName: string, fileUrl: string, fileSize: number, uploadedByEmail: string) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("lead_attachments")
      .insert({
        lead_id: leadId,
        file_name: fileName,
        file_url: fileUrl,
        file_size: fileSize,
        uploaded_by_email: uploadedByEmail,
      });

    if (error) throw new Error(`Database error: ${error.message}`);
  }

  // Dashboard Aggregations
  static async getDashboardMetrics() {
    const supabase = await createClient();
    
    const [totalRes, newRes, contactedRes, siteVisitRes, negotiationRes, wonRes, lostRes] = await Promise.all([
      supabase.from("leads").select("*", { count: 'exact', head: true }),
      supabase.from("leads").select("*", { count: 'exact', head: true }).eq('status', 'New'),
      supabase.from("leads").select("*", { count: 'exact', head: true }).eq('status', 'Contacted'),
      supabase.from("leads").select("*", { count: 'exact', head: true }).eq('status', 'Site Visit Scheduled'),
      supabase.from("leads").select("*", { count: 'exact', head: true }).eq('status', 'Negotiation'),
      supabase.from("leads").select("*", { count: 'exact', head: true }).eq('status', 'Won'),
      supabase.from("leads").select("*", { count: 'exact', head: true }).eq('status', 'Lost'),
    ]);

    // For follow-ups today
    const todayStr = new Date().toISOString().split('T')[0];
    const { count: followUpCount } = await supabase
      .from("lead_follow_ups")
      .select("*", { count: 'exact', head: true })
      .eq('status', 'Pending')
      .gte('follow_up_date', `${todayStr}T00:00:00Z`)
      .lte('follow_up_date', `${todayStr}T23:59:59Z`);

    return {
      totalLeads: totalRes.count || 0,
      newLeads: newRes.count || 0,
      contactedLeads: contactedRes.count || 0,
      siteVisitLeads: siteVisitRes.count || 0,
      negotiationLeads: negotiationRes.count || 0,
      wonLeads: wonRes.count || 0,
      lostLeads: lostRes.count || 0,
      todaysFollowUps: followUpCount || 0,
    };
  }

  private static mapLeadRow(row: any): Lead {
    return {
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone,
      source: row.source,
      propertyId: row.property_id,
      builderId: row.builder_id,
      message: row.message,
      assignedToEmail: row.assigned_to_email,
      priority: row.priority,
      status: row.status,
      nextFollowUp: row.next_follow_up,
      tags: row.tags || [],
      preferredVisitDate: row.preferred_visit_date,
      budget: row.budget,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      propertyName: row.properties?.title,
      builderName: row.builders?.name,
    };
  }
}
