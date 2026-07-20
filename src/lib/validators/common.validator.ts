import { z } from "zod";
import { PaginationConstants } from "../constants/pagination";

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(PaginationConstants.DEFAULT_PAGE),
  limit: z.coerce.number().int().positive().max(PaginationConstants.MAX_LIMIT).default(PaginationConstants.DEFAULT_LIMIT),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().max(100).optional(),
});

export const uuidSchema = z.string().uuid("Invalid UUID format");
