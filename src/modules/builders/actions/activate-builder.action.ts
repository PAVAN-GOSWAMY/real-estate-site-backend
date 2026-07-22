"use server";

import { revalidatePath } from "next/cache";
import * as buildersService from "../services/builders.service";
import { Builder } from "../types/builder";
import { handleActionError } from "@/lib/actions/action-error";
import { ensureAdminAuth } from "@/lib/auth/utils";

/**
 * Type defining the standard response envelope for this action.
 */
export type ActivateBuilderResult = 
  | { success: true; data: Builder }
  | { success: false; error: string };

/**
 * Server action to reactivate a builder.
 * 
 * @param id The ID of the builder to activate.
 * @returns A strictly typed result indicating success or failure.
 */
export async function activateBuilderAction(
  id: string
): Promise<ActivateBuilderResult> {
  try {
    await ensureAdminAuth();
    const builder = await buildersService.activateBuilder(id);
    
    // Revalidate the builders list page to update status
    revalidatePath("/admin/builders");
    
    return { success: true, data: builder };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}
