import { z } from "zod";

export const dashboardFilterSchema = z.object({
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  sales_executive_id: z.string().uuid().optional(),
  team_id: z.string().uuid().optional(),
  builder_id: z.string().uuid().optional(),
  project_id: z.string().uuid().optional(),
  location_id: z.string().uuid().optional(),
  lead_source: z.string().optional(),
  lead_status: z.string().optional()
});

export const dashboardRoleSchema = z.enum([
  'admin', 'manager', 'sales', 'executive'
]);
