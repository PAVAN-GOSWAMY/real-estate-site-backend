"use server";

import * as buildersService from "../services/builders.service";
import { BuilderFilters, Builder } from "../types/builder";
import { handleActionError } from "@/lib/actions/action-error";

/**
 * Type defining the paginated data structure.
 */
export interface PaginatedBuilders {
  items: Builder[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Type defining the standard response envelope for this action.
 */
export type ListBuildersResult = 
  | { success: true; data: PaginatedBuilders }
  | { success: false; error: string };

/**
 * Server action to fetch a paginated list of builders with optional filters.
 * 
 * @param filters The search, pagination, and status filters.
 * @returns A strictly typed result containing the list of builders.
 */
export async function listBuildersAction(
  filters: BuilderFilters = {}
): Promise<ListBuildersResult> {
  try {
    const data = await buildersService.listBuilders(filters);
    return { success: true, data };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}
