import { z } from "zod";

export const LocationSchema = z.object({
  city_id: z.string().uuid("City is required"),
  name: z.string().min(1, "Name is required"),
  type: z.enum(['LOCALITY', 'SECTOR', 'AREA', 'ZONE', 'VILLAGE', 'TOWNSHIP']),
  pincode: z.string().optional().or(z.literal("")),
  is_active: z.boolean().default(true),
});

export type CreateLocationInput = z.infer<typeof LocationSchema>;
export type UpdateLocationInput = Partial<CreateLocationInput>;
