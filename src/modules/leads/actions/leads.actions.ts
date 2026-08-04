"use server";

import { revalidatePath } from "next/cache";
import { LeadsService } from "../services/leads.service";
import { FollowUpsService } from "../services/follow-ups.service";
import { 
  createLeadSchema, 
  updateLeadSchema,
  createLeadFollowUpSchema, 
  updateLeadFollowUpStatusSchema,
  updateLeadStatusSchema,
  updateLeadAssignmentSchema,
  updateLeadPrioritySchema
} from "../types";

import { ensureAdminAuth } from "@/lib/auth/utils";

export async function createPublicLeadAction(formData: FormData) {
  try {
    const data = {
      fullName: formData.get("fullName") as string || undefined,
      email: formData.get("email") as string || undefined,
      phone: formData.get("phone") as string || undefined,
      source: formData.get("source") as string || undefined,
      propertyId: formData.get("propertyId") as string || undefined,
      builderId: formData.get("builderId") as string || undefined,
      message: formData.get("message") as string || undefined,
      budget: formData.get("budget") as string || undefined,
      preferredVisitDate: formData.get("preferredVisitDate") as string || undefined,
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

export async function updateLeadPriorityAction(id: string, priority: string) {
  try {
    const user = await ensureAdminAuth();
    const parsed = updateLeadPrioritySchema.parse({ id, priority });
    await LeadsService.updateLead(parsed, user.email || "admin@example.com");
    revalidatePath(`/admin/leads/${id}`);
    revalidatePath(`/admin/leads`);
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
    await FollowUpsService.createFollowUp(parsed, user.email || "admin@example.com");
    
    revalidatePath(`/admin/leads/${parsed.leadId}`);
    revalidatePath(`/admin/leads/follow-ups`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateLeadFollowUpStatusAction(id: string, leadId: string, status: string) {
  try {
    const user = await ensureAdminAuth();
    const parsed = updateLeadFollowUpStatusSchema.parse({ id, status });
    await FollowUpsService.updateFollowUpStatus(parsed.id, leadId, parsed.status, user.email || "admin@example.com");
    
    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath(`/admin/leads/follow-ups`);
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

export async function logCommunicationAction(leadId: string, type: "Phone Call Initiated" | "WhatsApp Opened" | "Email Draft Opened", description: string) {
  try {
    const user = await ensureAdminAuth();
    await LeadsService.logCommunication(leadId, type, description, user.email || "admin@example.com");
    revalidatePath(`/admin/leads/${leadId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
