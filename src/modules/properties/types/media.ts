import { z } from "zod";

export enum MediaType {
  COVER_IMAGE = "COVER_IMAGE",
  GALLERY_IMAGE = "GALLERY_IMAGE",
  VIDEO = "VIDEO",
  VIRTUAL_TOUR = "VIRTUAL_TOUR"
}

export const PropertyMediaSchema = z.object({
  id: z.string().uuid(),
  propertyId: z.string().uuid(),
  mediaType: z.nativeEnum(MediaType),
  url: z.string().url(),
  fileName: z.string().nullable(),
  fileSize: z.number().nullable(),
  mimeType: z.string().nullable(),
  displayOrder: z.number().int().default(0),
  isFeatured: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PropertyMedia = z.infer<typeof PropertyMediaSchema>;

export interface CreateMediaInput {
  propertyId: string;
  mediaType: MediaType;
  url: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  displayOrder?: number;
  isFeatured?: boolean;
}

export interface UpdateMediaOrderInput {
  id: string;
  displayOrder: number;
}
