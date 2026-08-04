import { createClient } from "@/lib/supabase/server";
import { LeadFollowUp, CreateLeadFollowUpInput } from "../types";

export class FollowUpsService {
  static async getFollowUps(
    filters: { status?: string; search?: string; startDate?: string; endDate?: string },
    page = 1,
    pageSize = 20
  ) {
    const supabase = await createClient();
    
    let query = supabase
      .from("lead_follow_ups")
      .select(`
        *,
        leads (
          full_name,
          phone,
          properties (title)
        )
      `, { count: "exact" });

    if (filters.status && filters.status !== 'all') {
      query = query.eq("status", filters.status);
    }
    
    if (filters.startDate) {
      query = query.gte("follow_up_date", filters.startDate);
    }
    
    if (filters.endDate) {
      query = query.lte("follow_up_date", filters.endDate);
    }

    // Notice: search requires a join filter which Supabase postgREST can handle with embedded filtering or a view.
    // For simplicity, we just filter server-side on basic fields, but for robust text search, an RPC or view is ideal.
    
    query = query.order("follow_up_date", { ascending: true });
    
    const offset = (page - 1) * pageSize;
    query = query.range(offset, offset + pageSize - 1);

    const { data, count, error } = await query;
    if (error) throw new Error(`Database error: ${error.message}`);

    return { 
      followUps: data, 
      totalCount: count || 0, 
      totalPages: Math.ceil((count || 0) / pageSize) 
    };
  }

  static async getDashboardMetrics() {
    const supabase = await createClient();
    
    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23,59,59,999);

    const { data: allFollowUps, error } = await supabase
      .from("lead_follow_ups")
      .select("*");

    if (error) throw new Error(`Database error: ${error.message}`);

    const now = new Date();
    
    let todayCount = 0;
    let upcomingCount = 0;
    let overdueCount = 0;
    let completedToday = 0;
    let missedCount = 0;
    let cancelledCount = 0;

    allFollowUps.forEach(f => {
      const date = new Date(f.follow_up_date);
      
      if (f.status === 'Cancelled') cancelledCount++;
      if (f.status === 'Missed') missedCount++;
      
      if (f.status === 'Scheduled') {
        if (date < now && date < todayStart) {
          overdueCount++;
        } else if (date >= todayStart && date <= todayEnd) {
          todayCount++;
        } else if (date > todayEnd) {
          upcomingCount++;
        }
      }
      
      if (f.status === 'Completed' && f.completed_at) {
        const completedAt = new Date(f.completed_at);
        if (completedAt >= todayStart && completedAt <= todayEnd) {
          completedToday++;
        }
      }
    });

    return {
      today: todayCount,
      upcoming: upcomingCount,
      overdue: overdueCount,
      completedToday,
      missed: missedCount,
      cancelled: cancelledCount
    };
  }

  static async createFollowUp(input: CreateLeadFollowUpInput, userEmail: string) {
    const supabase = await createClient();
    
    // Create follow-up
    const { data, error } = await supabase
      .from("lead_follow_ups")
      .insert({
        lead_id: input.leadId,
        follow_up_date: input.followUpDate,
        reminder_type: input.reminderType,
        priority: input.priority || "Medium",
        comment: input.comment || null,
        status: "Scheduled",
        created_by_email: userEmail
      })
      .select()
      .single();

    if (error) throw new Error(`Database error: ${error.message}`);
    
    // Log Activity
    await supabase.from("lead_activities").insert({
      lead_id: input.leadId,
      action_type: "Follow-up Scheduled",
      description: `Scheduled ${input.reminderType} (${input.priority || "Medium"} Priority) for ${new Date(input.followUpDate).toLocaleString()}`,
      created_by_email: userEmail
    });

    return data;
  }

  static async updateFollowUpStatus(id: string, leadId: string, status: string, userEmail: string) {
    const supabase = await createClient();
    
    const updateData: any = { status };
    if (status === 'Completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("lead_follow_ups")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Database error: ${error.message}`);
    
    // Log Activity
    await supabase.from("lead_activities").insert({
      lead_id: leadId,
      action_type: "Follow-up Updated",
      description: `Follow-up marked as ${status}`,
      created_by_email: userEmail
    });

    return data;
  }
}
