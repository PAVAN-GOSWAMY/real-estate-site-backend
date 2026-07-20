import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

export const assignmentStrategySchema = z.enum([
  'MANUAL', 'ROUND_ROBIN', 'TERRITORY', 'PROJECT', 'PRIORITY', 'MANAGER_OVERRIDE'
]);

export const createAssignmentSchema = z.object({
  lead_id: z.string().uuid(),
  assigned_to: z.string().uuid(),
  assigned_by: z.string().uuid().optional().nullable(),
  assignment_strategy: assignmentStrategySchema.optional().default('MANUAL'),
  assignment_reason: z.string().optional().nullable(),
  assignment_notes: z.string().optional().nullable(),
  expires_at: z.string().datetime().optional().nullable(),
});

export const updateAssignmentSchema = z.object({
  assignment_notes: z.string().optional().nullable(),
  expires_at: z.string().datetime().optional().nullable(),
  is_active: z.boolean().optional()
});

export const bulkAssignmentSchema = z.object({
  lead_ids: z.array(z.string().uuid()),
  assigned_to: z.string().uuid(),
  assignment_strategy: assignmentStrategySchema.optional().default('MANUAL'),
  assignment_reason: z.string().optional().nullable(),
});

export const roundRobinAssignmentSchema = z.object({
  lead_ids: z.array(z.string().uuid()),
  team_ids: z.array(z.string().uuid()).optional(),
  pool_user_ids: z.array(z.string().uuid()).optional()
});

export const autoAssignmentSchema = z.object({
  lead_id: z.string().uuid()
});

export const reassignSchema = z.object({
  lead_id: z.string().uuid(),
  assigned_to: z.string().uuid(),
  assignment_strategy: assignmentStrategySchema.optional().default('MANAGER_OVERRIDE'),
  assignment_reason: z.string().optional().nullable()
});

export const assignmentFilterSchema = paginationSchema.extend({
  lead_id: z.string().uuid().optional(),
  assigned_to: z.string().uuid().optional(),
  is_active: z.boolean().optional(),
  strategy: assignmentStrategySchema.optional()
});
