"use server";

import { revalidatePath } from "next/cache";
import * as buildersService from "../services/builders.service";
import { Builder } from "../types/builder";
import { handleActionError } from "@/lib/actions/action-error";

/**
 * Type defining the standard response envelope for this action.
 */
export type DeactivateBuilderResult = 
  | { success: true; data: Builder }
  | { success: false; error: string };

/**
 * Server action to soft-delete (deactivate) a builder.
 * 
 * @param id The ID of the builder to deactivate.
 * @returns A strictly typed result indicating success or failure.
 */
export async function deactivateBuilderAction(
  id: string
): Promise<DeactivateBuilderResult> {
  try {
    const builder = await buildersService.deactivateBuilder(id);
    
    // Revalidate the builders list page to update status
    revalidatePath("/admin/builders");
    
    return { success: true, data: builder };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}
