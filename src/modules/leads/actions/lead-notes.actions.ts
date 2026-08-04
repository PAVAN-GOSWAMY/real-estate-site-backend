"use server";

import { revalidatePath } from "next/cache";
import { CreateLeadNoteInput, UpdateLeadNoteInput } from "../types";
import { LeadNotesService } from "../services/lead-notes.service";

import { ensureAdminAuth } from "@/lib/auth/utils";

export async function createLeadNoteAction(input: CreateLeadNoteInput) {
  try {
    const user = await ensureAdminAuth();
    const newNote = await LeadNotesService.createNote(input, user.id);
    revalidatePath(`/admin/leads/${input.leadId}`);
    return { success: true, data: newNote };
  } catch (error: any) {
    console.error("Action Error - createLeadNoteAction:", error);
    return { success: false, error: error.message };
  }
}

export async function updateLeadNoteAction(input: UpdateLeadNoteInput, leadId: string) {
  try {
    const user = await ensureAdminAuth();
    const updatedNote = await LeadNotesService.updateNote(input, user.id);
    revalidatePath(`/admin/leads/${leadId}`);
    return { success: true, data: updatedNote };
  } catch (error: any) {
    console.error("Action Error - updateLeadNoteAction:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteLeadNoteAction(id: string, leadId: string) {
  try {
    const user = await ensureAdminAuth();
    await LeadNotesService.deleteNote(id, user.id);
    revalidatePath(`/admin/leads/${leadId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Action Error - deleteLeadNoteAction:", error);
    return { success: false, error: error.message };
  }
}
