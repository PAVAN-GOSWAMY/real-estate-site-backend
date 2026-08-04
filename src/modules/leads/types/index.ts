import { z } from "zod";

// ============================================================================
// Enums & Constants
// ============================================================================

export const LEAD_SOURCES = [
  "Property Inquiry",
  "General Contact",
  "Site Visit Request",
  "Phone Call",
  "Walk-in",
  "Referral",
  "WhatsApp",
  "Email"
] as const;

export const LEAD_PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;

export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Site Visit Scheduled",
  "Negotiation",
  "Booked",
  "Won",
  "Lost",
  "Archived"
] as const;

export const FOLLOW_UP_TYPES = [
  "Phone Call",
  "WhatsApp",
  "Email",
  "Site Visit",
  "Office Meeting",
  "Document Collection",
  "Loan Discussion",
  "Other"
] as const;

export const FOLLOW_UP_STATUSES = ["Scheduled", "Completed", "Missed", "Cancelled"] as const;

export const FOLLOW_UP_PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;

// ============================================================================
// Database Entity Types (Matches DB schema)
// ============================================================================

export interface Lead {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  source: string;
  propertyId: string | null;
  builderId: string | null;
  message: string | null;
  assignedToEmail: string | null;
  priority: typeof LEAD_PRIORITIES[number];
  status: typeof LEAD_STATUSES[number];
  nextFollowUp: string | null; // ISO Date String
  tags: string[];
  preferredVisitDate: string | null; // ISO Date String
  budget: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Joined fields for UI
  propertyName?: string;
  builderName?: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  actionType: string;
  description: string;
  createdByEmail: string;
  createdAt: string;
}

export interface LeadNote {
  id: string;
  leadId: string;
  note: string;
  userId: string;
  priority: typeof LEAD_PRIORITIES[number];
  followUpDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFollowUp {
  id: string;
  leadId: string;
  followUpDate: string; // ISO Date string
  reminderType: typeof FOLLOW_UP_TYPES[number];
  comment: string | null;
  status: typeof FOLLOW_UP_STATUSES[number];
  priority: typeof FOLLOW_UP_PRIORITIES[number];
  createdByEmail: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface LeadAttachment {
  id: string;
  leadId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedByEmail: string;
  createdAt: string;
}

// ============================================================================
// Zod Validation Schemas for Forms/Actions
// ============================================================================

export const createLeadSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number is required").optional().or(z.literal("")),
  source: z.enum(LEAD_SOURCES),
  propertyId: z.string().uuid().optional().or(z.literal("")),
  builderId: z.string().uuid().optional().or(z.literal("")),
  message: z.string().optional().or(z.literal("")),
  assignedToEmail: z.string().email().optional().or(z.literal("")),
  priority: z.enum(LEAD_PRIORITIES).default("Medium"),
  status: z.enum(LEAD_STATUSES).default("New"),
  preferredVisitDate: z.string().optional().or(z.literal("")),
  budget: z.string().optional().or(z.literal("")),
});
export type CreateLeadInput = z.infer<typeof createLeadSchema>;

export const updateLeadSchema = createLeadSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;

export const createLeadNoteSchema = z.object({
  leadId: z.string().uuid(),
  note: z.string().min(10, "Note must be at least 10 characters").max(2000, "Note cannot exceed 2000 characters"),
  priority: z.enum(LEAD_PRIORITIES).default("Medium"),
  followUpDate: z.string().datetime().optional().nullable(),
});
export type CreateLeadNoteInput = z.infer<typeof createLeadNoteSchema>;

export const updateLeadNoteSchema = createLeadNoteSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateLeadNoteInput = z.infer<typeof updateLeadNoteSchema>;

export const deleteLeadNoteSchema = z.object({
  id: z.string().uuid(),
});

export const createLeadFollowUpSchema = z.object({
  leadId: z.string().uuid(),
  followUpDate: z.string().datetime(), // Requires full ISO string
  reminderType: z.enum(FOLLOW_UP_TYPES),
  priority: z.enum(FOLLOW_UP_PRIORITIES).default("Medium"),
  comment: z.string().optional().or(z.literal("")),
});
export type CreateLeadFollowUpInput = z.infer<typeof createLeadFollowUpSchema>;

export const updateLeadFollowUpStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(FOLLOW_UP_STATUSES),
});

export const updateLeadStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(LEAD_STATUSES),
});

export const updateLeadAssignmentSchema = z.object({
  id: z.string().uuid(),
  assignedToEmail: z.string().email().or(z.literal("")),
});

export const updateLeadPrioritySchema = z.object({
  id: z.string().uuid(),
  priority: z.enum(LEAD_PRIORITIES),
});
