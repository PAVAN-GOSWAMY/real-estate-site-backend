import { LeadsRepository } from "../repository/leads.repository";
import { CreateLeadInput, UpdateLeadInput, CreateLeadFollowUpInput } from "../types";

export class LeadsService {
  static async getLeads(filters: any = {}, page = 1, pageSize = 20) {
    return await LeadsRepository.getLeads(filters, page, pageSize);
  }

  static async getLeadById(id: string) {
    return await LeadsRepository.getLeadById(id);
  }

  static async createLead(input: CreateLeadInput) {
    const lead = await LeadsRepository.createLead(input);
    
    // Log activity
    await LeadsRepository.createActivity(
      lead.id,
      "Lead Created",
      `Lead generated from source: ${lead.source}`,
      "system" // Since it's usually from public site
    );

    return lead;
  }

  static async updateLead(input: UpdateLeadInput, currentUserEmail: string) {
    const oldLead = await LeadsRepository.getLeadById(input.id!);
    const lead = await LeadsRepository.updateLead(input);

    // Track status change
    if (input.status && input.status !== oldLead.status) {
      await LeadsRepository.createActivity(
        lead.id,
        "Status Changed",
        `Status changed from ${oldLead.status} to ${lead.status}`,
        currentUserEmail
      );
    }

    // Track assignment
    if (input.assignedToEmail !== undefined && input.assignedToEmail !== oldLead.assignedToEmail) {
      const assignedText = input.assignedToEmail ? `Assigned to ${input.assignedToEmail}` : "Unassigned";
      await LeadsRepository.createActivity(
        lead.id,
        "Lead Assigned",
        assignedText,
        currentUserEmail
      );
    }

    return lead;
  }

  static async getLeadActivities(leadId: string) {
    return await LeadsRepository.getLeadActivities(leadId);
  }


  static async getLeadFollowUps(leadId: string) {
    return await LeadsRepository.getLeadFollowUps(leadId);
  }

  static async createFollowUp(input: CreateLeadFollowUpInput, currentUserEmail: string) {
    await LeadsRepository.createFollowUp(input, currentUserEmail);
    await LeadsRepository.createActivity(
      input.leadId,
      "Follow-up Scheduled",
      `Scheduled a ${input.reminderType} follow-up for ${new Date(input.followUpDate).toLocaleString()}`,
      currentUserEmail
    );
  }

  static async updateFollowUpStatus(followUpId: string, leadId: string, status: string, currentUserEmail: string) {
    await LeadsRepository.updateFollowUpStatus(followUpId, status);
    await LeadsRepository.createActivity(
      leadId,
      "Follow-up Updated",
      `Follow-up marked as ${status}`,
      currentUserEmail
    );
  }

  static async getLeadAttachments(leadId: string) {
    return await LeadsRepository.getLeadAttachments(leadId);
  }

  static async createAttachment(leadId: string, fileName: string, fileUrl: string, fileSize: number, currentUserEmail: string) {
    await LeadsRepository.createAttachment(leadId, fileName, fileUrl, fileSize, currentUserEmail);
    await LeadsRepository.createActivity(
      leadId,
      "Attachment Added",
      `Uploaded file: ${fileName}`,
      currentUserEmail
    );
  }

  static async getDashboardMetrics() {
    return await LeadsRepository.getDashboardMetrics();
  }

  static async logCommunication(leadId: string, type: string, description: string, currentUserEmail: string) {
    await LeadsRepository.createActivity(
      leadId,
      type,
      description,
      currentUserEmail
    );
  }
}
