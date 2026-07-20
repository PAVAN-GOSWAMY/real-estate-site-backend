import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

export const visitTypeSchema = z.enum([
  'Project Visit', 'Property Visit', 'Sample Flat', 
  'Virtual Tour', 'Builder Office Visit', 'Revisit'
]);

export const visitStatusSchema = z.enum([
  'SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'RESCHEDULED', 'NO_SHOW'
]);

export const visitOutcomeSchema = z.enum([
  'INTERESTED', 'NEEDS_FOLLOW_UP', 'NEGOTIATION_STARTED', 
  'BOOKED', 'NOT_INTERESTED', 'POSTPONED', 'OTHER'
]);

export const createVisitSchema = z.object({
  lead_id: z.string().uuid(),
  project_id: z.string().uuid().optional().nullable(),
  tower_id: z.string().uuid().optional().nullable(),
  property_id: z.string().uuid().optional().nullable(),
  visit_title: z.string().min(1),
  visit_type: visitTypeSchema,
  scheduled_date: z.string(), // YYYY-MM-DD
  scheduled_start_time: z.string(), // HH:MM:SS
  scheduled_end_time: z.string().optional().nullable(),
  meeting_location: z.string().optional().nullable(),
  is_virtual: z.boolean().optional().default(false),
  meeting_link: z.string().url().optional().nullable(),
  assigned_sales_executive: z.string().uuid(),
}).refine(data => data.project_id || data.property_id, {
  message: "A visit must reference at least one property or project."
});

export const updateVisitSchema = createVisitSchema.partial().omit({ lead_id: true });

export const checkInSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

export const checkOutSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  customer_attended: z.boolean(),
  sales_executive_attended: z.boolean()
});

export const rescheduleSchema = z.object({
  scheduled_date: z.string(),
  scheduled_start_time: z.string(),
  scheduled_end_time: z.string().optional().nullable(),
  reason: z.string().optional()
});

export const cancelSchema = z.object({
  reason: z.string().min(1, "Reason is required to cancel a visit")
});

export const feedbackSchema = z.object({
  feedback_rating: z.number().min(1).max(5).optional().nullable(),
  customer_feedback: z.string().optional().nullable(),
  sales_notes: z.string().optional().nullable(),
  visit_outcome: visitOutcomeSchema.optional().nullable(),
  documents_shared: z.boolean().optional(),
  brochures_shared: z.boolean().optional(),
  price_discussed: z.boolean().optional(),
  negotiation_started: z.boolean().optional(),
  booking_interest: z.boolean().optional(),
  follow_up_required: z.boolean().optional(),
  follow_up_date: z.string().datetime().optional().nullable()
});

export const searchVisitSchema = paginationSchema.extend({
  lead_id: z.string().uuid().optional(),
  project_id: z.string().uuid().optional(),
  visit_status: visitStatusSchema.optional(),
  assigned_sales_executive: z.string().uuid().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional()
});
