import { z } from "zod";
import {
  createNoteSchema,
  updateNoteSchema,
  searchNoteSchema
} from "../validators/note.validator";
import { LeadNoteEntity } from "@/types/note.types";

export type CreateLeadNoteDto = z.infer<typeof createNoteSchema>;
export type UpdateLeadNoteDto = z.infer<typeof updateNoteSchema>;
export type LeadNoteSearchDto = z.infer<typeof searchNoteSchema>;

export interface LeadNoteResponseDto extends Omit<LeadNoteEntity, 'deleted_at'> {
  author?: any;
}

export interface LeadNoteStatisticsDto {
  total_notes: number;
  total_pinned: number;
  notes_by_type: Record<string, number>;
}
