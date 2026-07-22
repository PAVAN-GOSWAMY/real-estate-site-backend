"use server";

import { revalidatePath } from 'next/cache';
import * as propertiesService from '../services/properties.service';
import { CreatePropertyInput, UpdatePropertyInput, PropertyFilters } from '../types/property';
import { PropertyStatus } from '../types/enums';
import { ensureAdminAuth } from "@/lib/auth/utils";

/**
 * Standardized response format for Server Actions.
 */
export type ActionResponse<T = undefined> = 
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: string };

/**
 * Creates a new property.
 */
export async function createPropertyAction(
  input: Partial<CreatePropertyInput>
): Promise<ActionResponse<{ id: string }>> {
  try {
    await ensureAdminAuth();
    const property = await propertiesService.createProperty(input);
    revalidatePath('/admin/properties');
    return { success: true, data: { id: property.id } };
  } catch (error: unknown) {
    console.error("Action Error - createPropertyAction:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

/**
 * Updates an existing property.
 */
export async function updatePropertyAction(
  id: string,
  input: UpdatePropertyInput
): Promise<ActionResponse<{ id: string }>> {
  try {
    await ensureAdminAuth();
    const property = await propertiesService.updateProperty(id, input);
    revalidatePath('/admin/properties');
    revalidatePath(`/admin/properties/${id}`);
    return { success: true, data: { id: property.id } };
  } catch (error: unknown) {
    console.error("Action Error - updatePropertyAction:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

/**
 * Toggles a property status.
 */
export async function togglePropertyStatusAction(
  id: string,
  status: PropertyStatus
): Promise<ActionResponse<{ id: string; status: PropertyStatus }>> {
  try {
    await ensureAdminAuth();
    const property = await propertiesService.togglePropertyStatus(id, status);
    revalidatePath('/admin/properties');
    revalidatePath(`/admin/properties/${id}`);
    return { success: true, data: { id: property.id, status: property.status } };
  } catch (error: unknown) {
    console.error("Action Error - togglePropertyStatusAction:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

/**
 * Hard deletes a property.
 */
export async function deletePropertyAction(
  id: string
): Promise<ActionResponse> {
  try {
    await ensureAdminAuth();
    await propertiesService.deleteProperty(id);
    revalidatePath('/admin/properties');
    return { success: true, data: undefined };
  } catch (error: unknown) {
    console.error("Action Error - deletePropertyAction:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

/**
 * Lists properties based on filters.
 */
export async function listPropertiesAction(filters: PropertyFilters = {}) {
  try {
    const data = await propertiesService.listProperties(filters);
    return { success: true as const, data };
  } catch (error: unknown) {
    console.error("Action Error - listPropertiesAction:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false as const, error: message };
  }
}

/**
 * Gets a single property by ID.
 */
export async function getPropertyAction(id: string) {
  try {
    const data = await propertiesService.getProperty(id);
    if (!data) {
      return { success: false as const, error: "Property not found" };
    }
    return { success: true as const, data };
  } catch (error: unknown) {
    console.error("Action Error - getPropertyAction:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false as const, error: message };
  }
}

/**
 * Gets the next property code.
 */
export async function getNextPropertyCodeAction() {
  try {
    const data = await propertiesService.generateNextPropertyCode();
    return { success: true as const, data };
  } catch (error: unknown) {
    console.error("Action Error - getNextPropertyCodeAction:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false as const, error: message };
  }
}
