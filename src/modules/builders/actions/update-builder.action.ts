"use server";

import { revalidatePath } from "next/cache";
import * as buildersService from "../services/builders.service";
import { UpdateBuilderInput, Builder } from "../types/builder";
import { handleActionError } from "@/lib/actions/action-error";

/**
 * Type defining the standard response envelope for this action.
 */
export type UpdateBuilderResult = 
  | { success: true; data: Builder }
  | { success: false; error: string };

/**
 * Server action to update an existing builder.
 * Acts as the bridge between UI submissions and the domain service layer.
 * 
 * @param id The ID of the builder to update.
 * @param input The payload containing fields to update.
 * @returns A strictly typed result indicating success or failure.
 */
export async function updateBuilderAction(
  id: string,
  formData: FormData
): Promise<UpdateBuilderResult> {
  try {
    const inputString = formData.get("input") as string;
    if (!inputString) throw new Error("Validation Error: Missing input data");
    
    const input = JSON.parse(inputString) as UpdateBuilderInput;
    const logoFile = formData.get("logoFile") as File | null;
    const removeLogo = formData.get("removeLogo") === "true";
    
    const file = logoFile && logoFile.size > 0 ? logoFile : undefined;

    const builder = await buildersService.updateBuilder(id, input, file, removeLogo);
    
    // Revalidate relevant cache paths
    revalidatePath("/admin/builders");
    revalidatePath(`/admin/builders/${id}`);
    
    return { success: true, data: builder };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}
