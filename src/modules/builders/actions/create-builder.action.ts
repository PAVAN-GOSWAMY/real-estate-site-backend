"use server";

import { revalidatePath } from "next/cache";
import * as buildersService from "../services/builders.service";
import { CreateBuilderInput, Builder } from "../types/builder";
import { handleActionError } from "@/lib/actions/action-error";
import { ensureAdminAuth } from "@/lib/auth/utils";

/**
 * Type defining the standard response envelope for this action.
 */
export type CreateBuilderResult = 
  | { success: true; data: Builder }
  | { success: false; error: string };

/**
 * Server action to create a new builder.
 * Acts as the bridge between UI submissions and the domain service layer.
 * 
 * @param input The payload to create a builder.
 * @returns A strictly typed result indicating success or failure.
 */
export async function createBuilderAction(
  formData: FormData
): Promise<CreateBuilderResult> {
  try {
    await ensureAdminAuth();
    const inputString = formData.get("input") as string;
    if (!inputString) throw new Error("Validation Error: Missing input data");
    
    const input = JSON.parse(inputString) as Partial<CreateBuilderInput>;
    const logoFile = formData.get("logoFile") as File | null;
    
    // We only pass a valid File object
    const file = logoFile && logoFile.size > 0 ? logoFile : undefined;

    const builder = await buildersService.createBuilder(input, file);
    
    // Revalidate the builders list page to reflect the new addition
    revalidatePath("/admin/builders");
    
    return { success: true, data: builder };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}
