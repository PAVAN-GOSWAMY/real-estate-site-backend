import { z } from "zod";

export const CitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  state: z.string().optional().default(""),
  country: z.string().default("India"),
  is_active: z.boolean().default(true),
});

export type CreateCityInput = z.infer<typeof CitySchema>;
export type UpdateCityInput = Partial<CreateCityInput>;
