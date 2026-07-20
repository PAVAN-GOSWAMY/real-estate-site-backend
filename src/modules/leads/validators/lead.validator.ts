import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

export const leadStatusSchema = z.enum(['NEW', 'QUALIFIED', 'CONTACTED', 'INTERESTED', 'SITE_VISIT_SCHEDULED', 'SITE_VISIT_COMPLETED', 'NEGOTIATION', 'BOOKED', 'WON', 'LOST', 'CLOSED']);
export const leadSourceSchema = z.enum(['WEBSITE', 'LANDING_PAGE', 'PROPERTY_FORM', 'CONTACT_FORM', 'WHATSAPP', 'PHONE_CALL', 'WALK_IN', 'FACEBOOK_ADS', 'GOOGLE_ADS', 'INSTAGRAM', 'MANUAL_ENTRY', 'REFERRAL', 'PARTNER', 'API', 'OTHER']);
export const crmPrioritySchema = z.enum(['HIGH', 'MEDIUM', 'LOW']);

// Base validator for lead info
export const baseLeadSchema = z.object({
  full_name: z.string().min(1).max(255),
  email: z.string().email().optional().nullable(),
  phone_number: z.string().regex(/^\+?[0-9\s\-]{7,20}$/, "Invalid phone number format"),
  alternate_phone: z.string().regex(/^\+?[0-9\s\-]{7,20}$/, "Invalid alternate phone number format").optional().nullable(),
  
  project_id: z.string().uuid().optional().nullable(),
  property_id: z.string().uuid().optional().nullable(),
  
  lead_status: leadStatusSchema.optional().default('NEW'),
  lead_source: leadSourceSchema.optional().default('OTHER'),
  crm_priority: crmPrioritySchema.optional().default('MEDIUM'),
  
  budget_min: z.number().min(0).optional().nullable(),
  budget_max: z.number().min(0).optional().nullable(),
  
  preferred_contact_method: z.enum(['Phone', 'Email', 'WhatsApp', 'SMS']).optional().nullable().default('Phone'),
  preferred_contact_time: z.enum(['Morning', 'Afternoon', 'Evening', 'Any Time']).optional().nullable().default('Any Time'),
  
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable().default('India'),
  
  remarks: z.string().max(5000).optional().nullable(),
  assigned_to: z.string().uuid().optional().nullable(),
  
  last_contacted_at: z.string().datetime().optional().nullable(),
  next_follow_up_at: z.string().datetime().optional().nullable(),
  lost_reason: z.string().max(2000).optional().nullable(),
}).refine(data => {
  if (data.budget_min && data.budget_max) {
    return data.budget_min <= data.budget_max;
  }
  return true;
}, { message: "Minimum budget cannot be greater than maximum budget", path: ["budget_min"] });

export const createLeadSchema = baseLeadSchema;
export const updateLeadSchema = baseLeadSchema.partial();

export const mergeLeadSchema = z.object({
  primary_lead_id: z.string().uuid(),
  secondary_lead_id: z.string().uuid(),
  transfer_notes: z.boolean().default(true),
  transfer_relationships: z.boolean().default(true),
});

export const leadFilterSchema = paginationSchema.extend({
  source: leadSourceSchema.optional(),
  status: leadStatusSchema.optional(),
  priority: crmPrioritySchema.optional(),
  assigned_to: z.string().uuid().optional(),
  project_id: z.string().uuid().optional(),
  property_id: z.string().uuid().optional(),
  city: z.string().optional(),
  search: z.string().optional(),
});

export const duplicateCheckSchema = z.object({
  phone_number: z.string().optional(),
  email: z.string().optional(),
}).refine(data => data.phone_number || data.email, {
  message: "Either phone_number or email must be provided for duplicate check"
});
