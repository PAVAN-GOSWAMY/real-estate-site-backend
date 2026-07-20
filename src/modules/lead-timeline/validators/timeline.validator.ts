import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

export const timelineCategorySchema = z.enum([
  'Lead', 'Assignment', 'Status', 'Preference', 'Follow-up', 
  'Note', 'Site Visit', 'Communication', 'Property', 
  'Notification', 'System', 'Security'
]);

export const timelineFilterSchema = paginationSchema.extend({
  lead_id: z.string().uuid().optional(),
  category: timelineCategorySchema.optional(),
  event_type: z.string().optional(),
  actor_id: z.string().uuid().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional()
});

export const timelineSearchSchema = paginationSchema.extend({
  query: z.string().min(1),
  lead_id: z.string().uuid().optional()
});
