import { z } from "zod";

export const leadStatusEnum = z.enum([
  'NEW', 'QUALIFIED', 'ASSIGNED', 'CONTACTED', 'INTERESTED', 'FOLLOW_UP', 
  'SITE_VISIT_SCHEDULED', 'SITE_VISIT_COMPLETED', 'NEGOTIATION', 
  'BOOKED', 'WON', 'LOST', 'CLOSED'
]);

export const changeStatusSchema = z.object({
  new_status: leadStatusEnum,
  reason: z.string().optional().nullable(),
  win_reason: z.string().optional().nullable(),
  lost_reason: z.string().optional().nullable(),
  close_reason: z.string().optional().nullable(),
}).refine((data) => {
  if (data.new_status === 'WON' && !data.win_reason) return false;
  return true;
}, { message: "Win reason is mandatory when marking a lead as WON." })
.refine((data) => {
  if (data.new_status === 'LOST' && !data.lost_reason) return false;
  return true;
}, { message: "Loss reason is mandatory when marking a lead as LOST." })
.refine((data) => {
  if (data.new_status === 'CLOSED' && !data.close_reason) return false;
  return true;
}, { message: "Close reason is mandatory when marking a lead as CLOSED." });

export const bulkStatusSchema = z.object({
  lead_ids: z.array(z.string().uuid()),
  new_status: leadStatusEnum,
  reason: z.string().optional().nullable(),
});

export const reopenLeadSchema = z.object({
  reason: z.string().min(1, "Reason is required to reopen a lead")
});
