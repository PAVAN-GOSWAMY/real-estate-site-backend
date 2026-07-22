import { z } from "zod";

export const AmenitySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  category: z.string().min(2),
  icon: z.string().min(2),
  description: z.string().nullable(),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Amenity = z.infer<typeof AmenitySchema>;
