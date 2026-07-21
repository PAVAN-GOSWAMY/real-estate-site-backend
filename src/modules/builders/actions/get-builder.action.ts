"use server";

import * as buildersService from "../services/builders.service";
import { Builder } from "../types/builder";
import { handleActionError } from "@/lib/actions/action-error";

/**
 * Type defining the standard response envelope for this action.
 */
export type GetBuilderResult = 
  | { success: true; data: Builder | null }
  | { success: false; error: string };

/**
 * Server action to fetch a single builder by ID.
 * 
 * @param id The ID of the builder to fetch.
 * @returns A strictly typed result containing the builder or an error message.
 */
export async function getBuilderAction(
  id: string
): Promise<GetBuilderResult> {
  try {
    const builder = await buildersService.getBuilder(id);
    return { success: true, data: builder };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}
