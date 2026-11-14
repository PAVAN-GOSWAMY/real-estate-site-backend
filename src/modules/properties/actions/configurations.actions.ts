"use server";

import * as service from "../services/configurations.service";
import { PropertyConfiguration, PropertyConfigurationInput } from "../types/configuration";
import { ensureAdminAuth } from "@/lib/auth/utils";
import { revalidatePath } from "next/cache";

export type ActionResponse<T> = { success: true; data: T } | { success: false; error: string };

export async function getPropertyConfigurationsAction(
  propertyId: string
): Promise<ActionResponse<PropertyConfiguration[]>> {
  try {
    const data = await service.getPropertyConfigurations(propertyId);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch property configurations." };
  }
}

export async function savePropertyConfigurationAction(
  propertyId: string,
  input: PropertyConfigurationInput
): Promise<ActionResponse<PropertyConfiguration>> {
  try {
    await ensureAdminAuth();
    const data = await service.upsertPropertyConfiguration(propertyId, input);
    revalidatePath(`/admin/properties/${propertyId}`);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to save configuration." };
  }
}

export async function deletePropertyConfigurationAction(
  id: string,
  propertyId: string
): Promise<ActionResponse<void>> {
  try {
    await ensureAdminAuth();
    await service.deletePropertyConfiguration(id, propertyId);
    revalidatePath(`/admin/properties/${propertyId}`);
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete configuration." };
  }
}

export async function syncPropertyConfigurationsAction(
  propertyId: string,
  configs: PropertyConfigurationInput[]
): Promise<ActionResponse<PropertyConfiguration[]>> {
  try {
    await ensureAdminAuth();
    const data = await service.syncPropertyConfigurations(propertyId, configs);
    revalidatePath(`/admin/properties/${propertyId}`);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to synchronize configurations." };
  }
}
