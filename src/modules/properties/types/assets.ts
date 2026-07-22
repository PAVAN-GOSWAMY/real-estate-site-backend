import { z } from "zod";

// --- Floor Plans ---
export const PropertyFloorPlanSchema = z.object({
  id: z.string().uuid(),
  propertyId: z.string().uuid(),
  name: z.string().min(1),
  floorNumber: z.string().nullable(),
  configuration: z.string().min(1),
  area: z.number().positive(),
  unit: z.string().min(1),
  imageUrl: z.string().url(),
  description: z.string().nullable(),
  displayOrder: z.number().int().default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PropertyFloorPlan = z.infer<typeof PropertyFloorPlanSchema>;

export const CreatePropertyFloorPlanSchema = z.object({
  name: z.string().min(2, "Floor name must be at least 2 characters"),
  floorNumber: z.string().optional().nullable(),
  configuration: z.string().min(1, "Configuration is required (e.g. 2 BHK)"),
  area: z.coerce.number().positive("Area must be greater than 0"),
  unit: z.string().min(1, "Unit is required (e.g. sq.ft)"),
  description: z.string().optional().nullable(),
});

export type CreatePropertyFloorPlanInput = z.infer<typeof CreatePropertyFloorPlanSchema>;

// --- Documents ---
export enum DocumentType {
  BROCHURE = "Brochure",
  PRICE_LIST = "Price List",
  MASTER_PLAN = "Master Plan",
  LEGAL_APPROVAL = "Legal Approval",
  RERA_CERTIFICATE = "RERA Certificate",
  LAYOUT_PLAN = "Layout Plan",
  PAYMENT_PLAN = "Payment Plan",
  OTHER = "Other",
}

export const PropertyDocumentSchema = z.object({
  id: z.string().uuid(),
  propertyId: z.string().uuid(),
  name: z.string().min(1),
  documentType: z.nativeEnum(DocumentType),
  fileUrl: z.string().url(),
  fileSize: z.number().int().positive(),
  version: z.number().int().positive().default(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PropertyDocument = z.infer<typeof PropertyDocumentSchema>;

export const CreatePropertyDocumentSchema = z.object({
  name: z.string().min(2, "Document name must be at least 2 characters"),
  documentType: z.nativeEnum(DocumentType),
});

export type CreatePropertyDocumentInput = z.infer<typeof CreatePropertyDocumentSchema>;
