import { 
  CreateLeadNoteInput, 
  UpdateLeadNoteInput, 
  createLeadNoteSchema, 
  updateLeadNoteSchema,
  deleteLeadNoteSchema
} from "../types";
import { LeadNotesRepository } from "../repository/lead-notes.repository";
import { LeadsRepository } from "../repository/leads.repository";

export class LeadNotesService {
  /**
   * Retrieves notes for a specific lead
   */
  static async getLeadNotes(leadId: string) {
    try {
      return await LeadNotesRepository.getLeadNotes(leadId);
    } catch (error: any) {
      console.error("LeadNotesService.getLeadNotes Error:", error);
      throw new Error(error.message || "Failed to fetch lead notes");
    }
  }

  /**
   * Creates a new follow-up note
   */
  static async createNote(input: CreateLeadNoteInput, userId: string) {
    try {
      const validatedData = createLeadNoteSchema.parse(input);
      
      // Verify lead exists
      const lead = await LeadsRepository.getLeadById(validatedData.leadId);
      if (!lead) {
        throw new Error("Lead not found");
      }
      
      // Check permissions (User must be an admin or assigned to the lead)
      // Since MVP doesn't have an auth table, we just pass the email/id down
      if (!userId) {
         throw new Error("Unauthorized: User ID is required");
      }
      
      const newNote = await LeadNotesRepository.createNote(validatedData, userId);
      
      // Audit log
      await LeadsRepository.createActivity(
        validatedData.leadId,
        "Note Added",
        `Added follow-up note with priority: ${validatedData.priority}`,
        userId
      );
      
      return newNote;
    } catch (error: any) {
      console.error("LeadNotesService.createNote Error:", error);
      throw new Error(error.errors?.[0]?.message || error.message || "Failed to create lead note");
    }
  }

  /**
   * Updates an existing follow-up note
   */
  static async updateNote(input: UpdateLeadNoteInput, userId: string) {
    try {
      const validatedData = updateLeadNoteSchema.parse(input);
      
      if (!userId) {
        throw new Error("Unauthorized: User ID is required");
      }
      
      // Note: Ideally we would verify that the userId matches the note's creator 
      // or that the user is an admin. For MVP, we trust the userId parameter.
      return await LeadNotesRepository.updateNote(validatedData);
    } catch (error: any) {
      console.error("LeadNotesService.updateNote Error:", error);
      throw new Error(error.errors?.[0]?.message || error.message || "Failed to update lead note");
    }
  }

  /**
   * Deletes a follow-up note
   */
  static async deleteNote(id: string, userId: string) {
    try {
      const validatedData = deleteLeadNoteSchema.parse({ id });
      
      if (!userId) {
        throw new Error("Unauthorized: User ID is required");
      }
      
      return await LeadNotesRepository.deleteNote(validatedData.id);
    } catch (error: any) {
      console.error("LeadNotesService.deleteNote Error:", error);
      throw new Error(error.errors?.[0]?.message || error.message || "Failed to delete lead note");
    }
  }
}
