"use server";

import * as service from "../services/media.service";
import { PropertyMedia, MediaType, UpdateMediaOrderInput } from "../types/media";
import { revalidatePath } from "next/cache";
import { ensureAdminAuth } from "@/lib/auth/utils";

export type ActionResponse<T> = { success: true; data: T } | { success: false; error: string };

/**
 * Gets all media for a property.
 */
export async function getPropertyMediaAction(propertyId: string): Promise<ActionResponse<PropertyMedia[]>> {
  try {
    const media = await service.getPropertyMedia(propertyId);
    return { success: true, data: media };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch media." };
  }
}

/**
 * Uploads a single media file.
 */
export async function uploadMediaAction(formData: FormData): Promise<ActionResponse<PropertyMedia>> {
  try {
    await ensureAdminAuth();
    const propertyId = formData.get("propertyId") as string;
    const mediaType = formData.get("mediaType") as MediaType;
    const file = formData.get("file") as File;

    if (!propertyId || !mediaType || !file || !(file instanceof File)) {
      return { success: false, error: "Invalid form data provided." };
    }

    const result = await service.uploadMedia(propertyId, mediaType, file);
    revalidatePath(`/admin/properties/${propertyId}`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to upload media." };
  }
}

/**
 * Deletes a media item.
 */
export async function deleteMediaAction(propertyId: string, id: string): Promise<ActionResponse<PropertyMedia>> {
  try {
    await ensureAdminAuth();
    const result = await service.deleteMedia(id);
    revalidatePath(`/admin/properties/${propertyId}`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete media." };
  }
}

/**
 * Updates the display order for multiple media items.
 */
export async function updateMediaOrderAction(propertyId: string, updates: UpdateMediaOrderInput[]): Promise<ActionResponse<void>> {
  try {
    await ensureAdminAuth();
    await service.updateMediaOrder(updates);
    revalidatePath(`/admin/properties/${propertyId}`);
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update media order." };
  }
}

/**
 * Sets an existing gallery image as the cover image.
 */
export async function setAsCoverAction(propertyId: string, mediaId: string): Promise<ActionResponse<void>> {
  try {
    await ensureAdminAuth();
    await service.setAsCover(propertyId, mediaId);
    revalidatePath(`/admin/properties/${propertyId}`);
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to set cover image." };
  }
}
