"use server";

import { revalidatePath } from "next/cache";
import { LeadsService } from "../services/leads.service";
import { 
  createLeadSchema, 
  updateLeadSchema, 
  createLeadNoteSchema, 
  createLeadFollowUpSchema, 
  updateLeadFollowUpStatusSchema,
  updateLeadStatusSchema,
  updateLeadAssignmentSchema
} from "../types";

import { ensureAdminAuth } from "@/lib/auth/utils";

export async function createPublicLeadAction(formData: FormData) {
  try {
    const data = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      source: formData.get("source"),
      propertyId: formData.get("propertyId"),
      builderId: formData.get("builderId"),
      message: formData.get("message"),
      budget: formData.get("budget"),
      preferredVisitDate: formData.get("preferredVisitDate") || undefined,
    };

    const parsed = createLeadSchema.parse(data);
    await LeadsService.createLead(parsed);
    
    // Do not revalidate admin paths from public action to save overhead, 
    // it will be fetched dynamically anyway if using SSR.
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create public lead:", error);
    return { success: false, error: error.message };
  }
}

export async function updateLeadStatusAction(id: string, status: string) {
  try {
    const user = await ensureAdminAuth();
    const parsed = updateLeadStatusSchema.parse({ id, status });
    await LeadsService.updateLead(parsed, user.email || "admin@example.com");
    revalidatePath(`/admin/leads/${id}`);
    revalidatePath(`/admin/leads`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateLeadAssignmentAction(id: string, assignedToEmail: string) {
  try {
    const user = await ensureAdminAuth();
    const parsed = updateLeadAssignmentSchema.parse({ id, assignedToEmail: assignedToEmail || "" });
    await LeadsService.updateLead(parsed, user.email || "admin@example.com");
    revalidatePath(`/admin/leads/${id}`);
    revalidatePath(`/admin/leads`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createLeadNoteAction(formData: FormData) {
  try {
    const user = await ensureAdminAuth();
    const data = {
      leadId: formData.get("leadId"),
      content: formData.get("content"),
    };

    const parsed = createLeadNoteSchema.parse(data);
    await LeadsService.createNote(parsed, user.email || "admin@example.com");
    
    revalidatePath(`/admin/leads/${parsed.leadId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createLeadFollowUpAction(formData: FormData) {
  try {
    const user = await ensureAdminAuth();
    const data = {
      leadId: formData.get("leadId"),
      followUpDate: formData.get("followUpDate"), // Expects full ISO string
      reminderType: formData.get("reminderType"),
      comment: formData.get("comment"),
    };

    const parsed = createLeadFollowUpSchema.parse(data);
    await LeadsService.createFollowUp(parsed, user.email || "admin@example.com");
    
    revalidatePath(`/admin/leads/${parsed.leadId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateLeadFollowUpStatusAction(id: string, leadId: string, status: string) {
  try {
    const user = await ensureAdminAuth();
    const parsed = updateLeadFollowUpStatusSchema.parse({ id, status });
    await LeadsService.updateFollowUpStatus(parsed.id, leadId, parsed.status, user.email || "admin@example.com");
    
    revalidatePath(`/admin/leads/${leadId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function registerLeadAttachmentAction(leadId: string, fileName: string, fileUrl: string, fileSize: number) {
  try {
    const user = await ensureAdminAuth();
    await LeadsService.createAttachment(leadId, fileName, fileUrl, fileSize, user.email || "admin@example.com");
    revalidatePath(`/admin/leads/${leadId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
