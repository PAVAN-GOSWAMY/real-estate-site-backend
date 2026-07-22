"use server";

import * as service from "../services/amenity.service";
import { Amenity } from "../types/amenity";

export type ActionResponse<T> = { success: true; data: T } | { success: false; error: string };

export async function getActiveAmenitiesAction(): Promise<ActionResponse<Amenity[]>> {
  try {
    const data = await service.getActiveAmenities();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch amenities." };
  }
}
