"use server";

import * as service from "../services/amenity.service";
import { Amenity, CreateAmenityInput, UpdateAmenityInput, CreateAmenitySchema, UpdateAmenitySchema } from "../types/amenity";
import { revalidatePath } from "next/cache";

export type ActionResponse<T> = { success: true; data: T } | { success: false; error: string };

export async function getActiveAmenitiesAction(): Promise<ActionResponse<Amenity[]>> {
  try {
    const data = await service.getActiveAmenities();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch amenities." };
  }
}

export async function getAllAmenitiesAction(): Promise<ActionResponse<Amenity[]>> {
  try {
    const data = await service.getAllAmenities();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch all amenities." };
  }
}

export async function createAmenityAction(input: CreateAmenityInput): Promise<ActionResponse<Amenity>> {
  try {
    const parsed = CreateAmenitySchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues.map(e => e.message).join(", ") };
    }
    const data = await service.createAmenity(parsed.data);
    revalidatePath("/admin/amenities");
    revalidatePath("/admin/properties/[id]", "page");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create amenity." };
  }
}

export async function updateAmenityAction(id: string, input: UpdateAmenityInput): Promise<ActionResponse<Amenity>> {
  try {
    const parsed = UpdateAmenitySchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues.map(e => e.message).join(", ") };
    }
    const data = await service.updateAmenity(id, parsed.data);
    revalidatePath("/admin/amenities");
    revalidatePath("/admin/properties/[id]", "page");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update amenity." };
  }
}

export async function deactivateAmenityAction(id: string): Promise<ActionResponse<Amenity>> {
  try {
    const data = await service.deactivateAmenity(id);
    revalidatePath("/admin/amenities");
    revalidatePath("/admin/properties/[id]", "page");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to deactivate amenity." };
  }
}
