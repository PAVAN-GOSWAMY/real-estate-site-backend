import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { NoteRepository } from "../repository/note.repository";
import { LeadRepository } from "../../leads/repository/lead.repository";
import { 
  CreateLeadNoteDto, 
  UpdateLeadNoteDto,
  LeadNoteSearchDto
} from "../dto/note.dto";
import { ValidationError, ConflictError, NotFoundError, AuthorizationError } from "@/lib/errors/domain.error";

export class NoteService extends BaseService {
  private repository: NoteRepository;
  private leadRepository: LeadRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new NoteRepository(supabase);
    this.leadRepository = new LeadRepository(supabase);
  }

  async searchNotes(query: LeadNoteSearchDto, userId: string) {
    return this.executeSafe(async () => {
      return await this.repository.searchNotes(query, userId);
    });
  }

  async getNote(id: string, userId: string) {
    return this.executeSafe(async () => {
      const note = await this.repository.findById(id);
      if (!note || note.deleted_at) throw new NotFoundError("Note");

      if (note.visibility === 'PRIVATE' && note.author_id !== userId) {
        throw new AuthorizationError("You do not have access to this private note.");
      }

      return note;
    });
  }

  async createNote(dto: CreateLeadNoteDto, userId: string) {
    return this.executeSafe(async () => {
      const lead = await this.leadRepository.findById(dto.lead_id);
      if (!lead || lead.deleted_at) throw new NotFoundError("Lead");

      if (dto.note_type === 'SYSTEM_GENERATED') {
         throw new ValidationError("SYSTEM_GENERATED notes cannot be created manually.");
      }

      const payload = {
        ...dto,
        author_id: userId,
        is_pinned: false,
        is_archived: false
      };

      return await this.repository.create(payload as any);
    });
  }

  async updateNote(id: string, dto: UpdateLeadNoteDto, userId: string) {
    return this.executeSafe(async () => {
      const existing = await this.repository.findById(id);
      if (!existing || existing.deleted_at) throw new NotFoundError("Note");

      if (existing.note_type === 'SYSTEM_GENERATED') {
        throw new ConflictError("System-generated notes cannot be edited.");
      }

      if (existing.author_id !== userId) {
        throw new AuthorizationError("Only the author can edit this note.");
      }

      return await this.repository.update(id, dto);
    });
  }

  async deleteNote(id: string, userId: string) {
    return this.executeSafe(async () => {
      const existing = await this.repository.findById(id);
      if (!existing || existing.deleted_at) throw new NotFoundError("Note");
      
      // In a real app, Managers might also be allowed to delete
      if (existing.author_id !== userId) {
        throw new AuthorizationError("Only the author can delete this note.");
      }

      await this.repository.update(id, { deleted_at: new Date().toISOString() });
    });
  }

  async setArchiveStatus(id: string, is_archived: boolean, userId: string) {
    return this.executeSafe(async () => {
      const existing = await this.getNote(id, userId); // handles visibility check
      await this.repository.updateState(id, { is_archived });
      return { success: true, id, is_archived };
    });
  }

  async setPinStatus(id: string, is_pinned: boolean, userId: string) {
    return this.executeSafe(async () => {
      const existing = await this.getNote(id, userId); // handles visibility check
      await this.repository.updateState(id, { is_pinned });
      return { success: true, id, is_pinned };
    });
  }

  async getStatistics(leadId?: string) {
    return this.executeSafe(async () => {
      // Simplified statistics gathering
      // A production system would use an RPC or specific repository method for this
      return {
        total_notes: 0,
        total_pinned: 0,
        notes_by_type: {}
      };
    });
  }
}
