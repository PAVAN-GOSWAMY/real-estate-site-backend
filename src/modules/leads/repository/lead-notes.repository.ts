import { createClient } from "@/lib/supabase/server";
import { LeadNote, CreateLeadNoteInput, UpdateLeadNoteInput } from "../types";

function mapRowToNote(row: any): LeadNote {
  return {
    id: row.id,
    leadId: row.lead_id,
    note: row.note,
    userId: row.user_id,
    priority: row.priority,
    followUpDate: row.follow_up_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class LeadNotesRepository {
  static async getLeadNotes(leadId: string): Promise<LeadNote[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lead_notes")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching lead notes:", error);
      throw new Error(`Failed to fetch lead notes: ${error.message}`);
    }

    return (data || []).map(mapRowToNote);
  }

  static async createNote(input: CreateLeadNoteInput, userId: string): Promise<LeadNote> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lead_notes")
      .insert({
        lead_id: input.leadId,
        note: input.note,
        user_id: userId,
        priority: input.priority,
        follow_up_date: input.followUpDate || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating lead note:", error);
      throw new Error(`Failed to create lead note: ${error.message}`);
    }

    return mapRowToNote(data);
  }

  static async updateNote(input: UpdateLeadNoteInput): Promise<LeadNote> {
    const supabase = await createClient();
    const { id, ...updates } = input;

    const dbUpdates: any = {};
    if (updates.note !== undefined) dbUpdates.note = updates.note;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
    if (updates.followUpDate !== undefined) dbUpdates.follow_up_date = updates.followUpDate;

    const { data, error } = await supabase
      .from("lead_notes")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating lead note:", error);
      throw new Error(`Failed to update lead note: ${error.message}`);
    }

    return mapRowToNote(data);
  }

  static async deleteNote(id: string): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("lead_notes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting lead note:", error);
      throw new Error(`Failed to delete lead note: ${error.message}`);
    }

    return true;
  }

  static async searchNotes(query: string): Promise<LeadNote[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lead_notes")
      .select("*")
      .ilike("note", `%${query}%`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error searching lead notes:", error);
      throw new Error(`Failed to search lead notes: ${error.message}`);
    }

    return (data || []).map(mapRowToNote);
  }
}
