"use server";

import * as service from "../services/assets.service";
import { PropertyFloorPlan, PropertyDocument } from "../types/assets";
import { ensureAdminAuth } from "@/lib/auth/utils";
import { revalidatePath } from "next/cache";

export type ActionResponse<T> = { success: true; data: T } | { success: false; error: string };

// --- Floor Plans ---
export async function getFloorPlansAction(propertyId: string): Promise<ActionResponse<PropertyFloorPlan[]>> {
  try {
    const data = await service.getFloorPlans(propertyId);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch floor plans." };
  }
}

export async function uploadFloorPlanAction(formData: FormData): Promise<ActionResponse<PropertyFloorPlan>> {
  try {
    await ensureAdminAuth();
    const propertyId = formData.get("propertyId") as string;
    const name = formData.get("name") as string;
    const floorNumber = formData.get("floorNumber") as string;
    const configuration = formData.get("configuration") as string;
    const area = Number(formData.get("area"));
    const unit = formData.get("unit") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File;

    if (!propertyId || !file || !name || !configuration || !area || !unit) {
      return { success: false, error: "Missing required fields" };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: "File size exceeds 10MB limit." };
    }

    const payload = {
      name,
      floor_number: floorNumber || null,
      configuration,
      area,
      unit,
      description: description || null,
    };

    const data = await service.uploadFloorPlan(propertyId, payload, file);
    revalidatePath(`/admin/properties/${propertyId}`);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to upload floor plan." };
  }
}

export async function updateFloorPlanAction(propertyId: string, id: string, payload: any): Promise<ActionResponse<PropertyFloorPlan>> {
  try {
    await ensureAdminAuth();
    const dbPayload = {
      name: payload.name,
      floor_number: payload.floorNumber,
      configuration: payload.configuration,
      area: payload.area,
      unit: payload.unit,
      description: payload.description,
    };
    const data = await service.updateFloorPlan(id, dbPayload);
    revalidatePath(`/admin/properties/${propertyId}`);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update floor plan." };
  }
}

export async function updateFloorPlanOrderAction(propertyId: string, updates: { id: string; displayOrder: number }[]): Promise<ActionResponse<void>> {
  try {
    await ensureAdminAuth();
    await service.updateFloorPlanOrders(propertyId, updates);
    revalidatePath(`/admin/properties/${propertyId}`);
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update order." };
  }
}

export async function deleteFloorPlanAction(propertyId: string, id: string): Promise<ActionResponse<void>> {
  try {
    await ensureAdminAuth();
    await service.deleteFloorPlan(propertyId, id);
    revalidatePath(`/admin/properties/${propertyId}`);
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete floor plan." };
  }
}


// --- Documents ---
export async function getDocumentsAction(propertyId: string): Promise<ActionResponse<PropertyDocument[]>> {
  try {
    const data = await service.getDocuments(propertyId);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch documents." };
  }
}

export async function uploadDocumentAction(formData: FormData): Promise<ActionResponse<PropertyDocument>> {
  try {
    await ensureAdminAuth();
    const propertyId = formData.get("propertyId") as string;
    const name = formData.get("name") as string;
    const documentType = formData.get("documentType") as string;
    const file = formData.get("file") as File;

    if (!propertyId || !file || !name || !documentType) {
      return { success: false, error: "Missing required fields" };
    }

    if (file.size > 25 * 1024 * 1024) {
      return { success: false, error: "File size exceeds 25MB limit." };
    }

    const payload = {
      name,
      document_type: documentType,
    };

    const data = await service.uploadDocument(propertyId, payload, file);
    revalidatePath(`/admin/properties/${propertyId}`);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to upload document." };
  }
}

export async function replaceDocumentAction(formData: FormData): Promise<ActionResponse<PropertyDocument>> {
  try {
    await ensureAdminAuth();
    const propertyId = formData.get("propertyId") as string;
    const documentId = formData.get("documentId") as string;
    const file = formData.get("file") as File;

    if (!propertyId || !documentId || !file) {
      return { success: false, error: "Missing required fields" };
    }

    if (file.size > 25 * 1024 * 1024) {
      return { success: false, error: "File size exceeds 25MB limit." };
    }

    const data = await service.replaceDocument(propertyId, documentId, file);
    revalidatePath(`/admin/properties/${propertyId}`);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to replace document." };
  }
}

export async function deleteDocumentAction(propertyId: string, id: string): Promise<ActionResponse<void>> {
  try {
    await ensureAdminAuth();
    await service.deleteDocument(propertyId, id);
    revalidatePath(`/admin/properties/${propertyId}`);
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete document." };
  }
}
