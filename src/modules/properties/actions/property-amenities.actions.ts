"use server";

import * as service from "../services/property-amenities.service";
import { revalidatePath } from "next/cache";
import { ensureAdminAuth } from "@/lib/auth/utils";

export type ActionResponse<T> = { success: true; data: T } | { success: false; error: string };

export async function getAmenitiesForPropertyAction(propertyId: string): Promise<ActionResponse<string[]>> {
  try {
    const data = await service.getAmenitiesForProperty(propertyId);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch property amenities." };
  }
}

export async function savePropertyAmenitiesAction(propertyId: string, amenityIds: string[]): Promise<ActionResponse<void>> {
  try {
    await ensureAdminAuth();
    await service.savePropertyAmenities(propertyId, amenityIds);
    revalidatePath(`/admin/properties/${propertyId}`);
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to save property amenities." };
  }
}
