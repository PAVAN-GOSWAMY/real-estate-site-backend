import { z } from "zod";

export const AmenitySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Name is required (min 2 characters)"),
  category: z.string().min(2, "Category is required"),
  icon: z.string().min(2, "Icon is required"),
  description: z.string().nullable(),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateAmenitySchema = AmenitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateAmenitySchema = CreateAmenitySchema.partial();

export type Amenity = z.infer<typeof AmenitySchema>;
export type CreateAmenityInput = z.infer<typeof CreateAmenitySchema>;
export type UpdateAmenityInput = z.infer<typeof UpdateAmenitySchema>;
