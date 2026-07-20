import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

export const pricingRevisionStatusSchema = z.enum(['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED']);

const financialFields = {
  base_price: z.number().min(0, "Base price cannot be negative").default(0),
  offer_price: z.number().min(0, "Offer price cannot be negative").optional().nullable(),
  discount_percentage: z.number().min(0).max(100, "Discount percentage cannot exceed 100").default(0),
  discount_amount: z.number().min(0).default(0),
  booking_amount: z.number().min(0).default(0),
  plc_charges: z.number().min(0).default(0),
  floor_rise_charges: z.number().min(0).default(0),
  maintenance_charges: z.number().min(0).default(0),
  parking_charges: z.number().min(0).default(0),
  club_membership_charges: z.number().min(0).default(0),
  gst: z.number().min(0).default(0),
  registration_charges: z.number().min(0).default(0),
  other_charges: z.number().min(0).default(0),
  final_payable_amount: z.number().min(0),
};

const validatePricingConsistency = (data: any, ctx: z.RefinementCtx) => {
  // Simple check: final_payable_amount should equal the sum of charges minus discounts
  // In a real system, the formula might be highly specific.
  // We'll enforce a strict check:
  const charges = data.base_price + 
                  data.plc_charges + 
                  data.floor_rise_charges + 
                  data.maintenance_charges + 
                  data.parking_charges + 
                  data.club_membership_charges + 
                  data.gst + 
                  data.registration_charges + 
                  data.other_charges;
                  
  const expectedFinal = charges - data.discount_amount;

  if (Math.abs(expectedFinal - data.final_payable_amount) > 0.01) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Pricing consistency failed. Expected final payable amount to be ${expectedFinal}, but got ${data.final_payable_amount}.`,
      path: ["final_payable_amount"]
    });
  }
};

export const createPricingRevisionSchema = z.object({
  ...financialFields,
  effective_date: z.string().datetime().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
}).strict().superRefine(validatePricingConsistency);

export const updatePricingSchema = z.object({
  ...financialFields,
  effective_date: z.string().datetime().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
}).strict().superRefine(validatePricingConsistency);

export const reviewPricingRevisionSchema = z.object({
  notes: z.string().max(1000).optional().nullable(),
}).strict();

// Bulk Schemas
export const bulkPricingUpdateSchema = z.object({
  updates: z.array(z.object({
    property_id: z.string().uuid(),
    ...financialFields,
    effective_date: z.string().datetime().optional().nullable(),
    notes: z.string().max(1000).optional().nullable(),
  }).strict().superRefine(validatePricingConsistency)).min(1).max(50),
}).strict();

export const bulkCreatePricingRevisionSchema = z.object({
  revisions: z.array(z.object({
    property_id: z.string().uuid(),
    ...financialFields,
    effective_date: z.string().datetime().optional().nullable(),
    notes: z.string().max(1000).optional().nullable(),
  }).strict().superRefine(validatePricingConsistency)).min(1).max(50),
}).strict();

export const bulkReviewPricingRevisionSchema = z.object({
  revision_ids: z.array(z.string().uuid()).min(1).max(50),
  notes: z.string().max(1000).optional().nullable(),
}).strict();

// Query Filters
export const pricingHistoryQuerySchema = paginationSchema.extend({
  status: pricingRevisionStatusSchema.optional(),
}).strict();

export const pendingRevisionsQuerySchema = paginationSchema.extend({
}).strict();
