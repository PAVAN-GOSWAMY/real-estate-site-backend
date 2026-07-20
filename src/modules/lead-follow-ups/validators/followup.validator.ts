import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

export const followUpTypeSchema = z.enum([
  'Phone Call', 'WhatsApp', 'Email', 'SMS', 'Meeting', 
  'Office Visit', 'Reminder', 'Internal Note', 
  'Negotiation', 'Document Sharing'
]);

export const communicationChannelSchema = z.enum([
  'Phone', 'WhatsApp', 'Email', 'SMS', 'In Person', 
  'Google Meet', 'Zoom', 'Microsoft Teams'
]);

export const communicationDirectionSchema = z.enum(['Incoming', 'Outgoing']);

export const followUpOutcomeSchema = z.enum([
  'Connected', 'No Answer', 'Busy', 'Interested', 
  'Not Interested', 'Callback Requested', 
  'Meeting Scheduled', 'Site Visit Scheduled', 
  'Booked', 'Lost'
]);

export const createFollowUpSchema = z.object({
  lead_id: z.string().uuid(),
  project_id: z.string().uuid().optional().nullable(),
  property_id: z.string().uuid().optional().nullable(),
  
  follow_up_type: followUpTypeSchema,
  subject: z.string().min(1).max(255),
  summary: z.string().optional().nullable(),
  detailed_notes: z.string().optional().nullable(),
  
  communication_channel: communicationChannelSchema.optional().nullable(),
  communication_direction: communicationDirectionSchema.optional().nullable(),
  
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional().default('MEDIUM'),
  scheduled_at: z.string().datetime().optional().nullable(),
  duration_minutes: z.number().int().min(0).optional().nullable(),
  
  assigned_to: z.string().uuid().optional().nullable(),
});

export const updateFollowUpSchema = createFollowUpSchema.partial();

export const completeFollowUpSchema = z.object({
  outcome: followUpOutcomeSchema,
  summary: z.string().optional().nullable(),
  detailed_notes: z.string().optional().nullable(),
  customer_response: z.string().optional().nullable(),
  internal_notes: z.string().optional().nullable(),
  duration_minutes: z.number().int().min(0).optional().nullable(),
  // For recurring / follow-on
  next_follow_up_at: z.string().datetime().optional().nullable(),
  next_follow_up_type: followUpTypeSchema.optional().nullable(),
  // Optionally update lead status
  lead_status_after: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'SITE_VISIT', 'BOOKED', 'LOST']).optional().nullable()
});

export const rescheduleFollowUpSchema = z.object({
  scheduled_at: z.string().datetime(),
  internal_notes: z.string().optional().nullable()
});

export const escalateFollowUpSchema = z.object({
  escalation_reason: z.string().min(1),
  internal_notes: z.string().optional().nullable(),
  priority: z.enum(['HIGH', 'URGENT']).optional().default('URGENT')
});

export const cancelFollowUpSchema = z.object({
  cancellation_reason: z.string().min(1)
});

export const followUpFilterSchema = paginationSchema.extend({
  lead_id: z.string().uuid().optional(),
  is_completed: z.boolean().optional(),
  follow_up_type: followUpTypeSchema.optional(),
  assigned_to: z.string().uuid().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional()
});
