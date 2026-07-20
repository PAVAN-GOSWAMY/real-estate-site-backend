import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

export const noteTypeSchema = z.enum([
  'GENERAL', 'CALL_SUMMARY', 'MEETING_SUMMARY', 'SITE_VISIT', 
  'NEGOTIATION', 'CUSTOMER_FEEDBACK', 'INTERNAL_DISCUSSION', 
  'REMINDER', 'SYSTEM_GENERATED', 'OTHER'
]);

export const visibilitySchema = z.enum(['PRIVATE', 'SHARED']);

export const createNoteSchema = z.object({
  lead_id: z.string().uuid(),
  note_type: noteTypeSchema.optional().default('GENERAL'),
  content: z.string().min(1, "Content cannot be empty"),
  visibility: visibilitySchema.optional().default('SHARED'),
  tags: z.array(z.string()).optional().nullable(),
  mentions: z.array(z.string().uuid()).optional().nullable(),
});

export const updateNoteSchema = z.object({
  note_type: noteTypeSchema.optional(),
  content: z.string().min(1, "Content cannot be empty").optional(),
  visibility: visibilitySchema.optional(),
  tags: z.array(z.string()).optional().nullable(),
  mentions: z.array(z.string().uuid()).optional().nullable(),
});

export const searchNoteSchema = paginationSchema.extend({
  query: z.string().optional(),
  lead_id: z.string().uuid().optional(),
  author_id: z.string().uuid().optional(),
  note_type: noteTypeSchema.optional(),
  visibility: visibilitySchema.optional(),
  is_pinned: z.boolean().optional(),
  is_archived: z.boolean().optional(),
  tags: z.array(z.string()).optional()
});
