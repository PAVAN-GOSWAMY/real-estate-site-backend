import * as repository from '../repository/assets.repository';
import { PropertyFloorPlan, PropertyDocument } from '../types/assets';
import { uploadFile, deleteFile } from '@/lib/storage/storage.service';

const BUCKET_NAME = 'property-assets';

function extractPathFromUrl(url: string, bucketName: string): string | null {
  const marker = `/${bucketName}/`;
  const idx = url.indexOf(marker);
  if (idx !== -1) {
    return url.substring(idx + marker.length);
  }
  return null;
}

// --- Floor Plans ---
export async function getFloorPlans(propertyId: string): Promise<PropertyFloorPlan[]> {
  return await repository.getFloorPlans(propertyId);
}

export async function uploadFloorPlan(propertyId: string, payload: any, file: File): Promise<PropertyFloorPlan> {
  // Upload to storage
  const uploadResult = await uploadFile({
    bucket: BUCKET_NAME,
    folder: `floor-plans/${propertyId}`,
    file,
  });

  // Insert record
  return await repository.insertFloorPlan({
    ...payload,
    property_id: propertyId,
    image_url: uploadResult.publicUrl,
  });
}

export async function updateFloorPlan(id: string, payload: any): Promise<PropertyFloorPlan> {
  return await repository.updateFloorPlan(id, payload);
}

export async function deleteFloorPlan(propertyId: string, id: string): Promise<void> {
  const fp = await repository.getFloorPlanById(id);
  if (!fp || fp.propertyId !== propertyId) throw new Error("Floor plan not found");

  // Delete from DB
  await repository.deleteFloorPlan(id);

  // Delete from storage
  const path = extractPathFromUrl(fp.imageUrl, BUCKET_NAME);
  if (path) {
    try {
      await deleteFile(path, BUCKET_NAME);
    } catch (e) {
      console.error(`Failed to delete floor plan file: ${path}`, e);
    }
  }
}

export async function updateFloorPlanOrders(propertyId: string, updates: { id: string, displayOrder: number }[]): Promise<void> {
  const dbUpdates = updates.map(u => ({ id: u.id, display_order: u.displayOrder }));
  await repository.updateFloorPlanOrders(propertyId, dbUpdates);
}

// --- Documents ---
export async function getDocuments(propertyId: string): Promise<PropertyDocument[]> {
  return await repository.getDocuments(propertyId);
}

export async function uploadDocument(propertyId: string, payload: any, file: File): Promise<PropertyDocument> {
  // Upload to storage
  const uploadResult = await uploadFile({
    bucket: BUCKET_NAME,
    folder: `documents/${propertyId}`,
    file,
  });

  return await repository.insertDocument({
    ...payload,
    property_id: propertyId,
    file_url: uploadResult.publicUrl,
    file_size: file.size,
    version: 1,
  });
}

export async function replaceDocument(propertyId: string, documentId: string, file: File): Promise<PropertyDocument> {
  const doc = await repository.getDocumentById(documentId);
  if (!doc || doc.propertyId !== propertyId) throw new Error("Document not found");

  // Upload new file
  const uploadResult = await uploadFile({
    bucket: BUCKET_NAME,
    folder: `documents/${propertyId}`,
    file,
  });

  // Delete old file from storage (best effort)
  const oldPath = extractPathFromUrl(doc.fileUrl, BUCKET_NAME);
  if (oldPath) {
    try {
      await deleteFile(oldPath, BUCKET_NAME);
    } catch (e) {
      console.error(`Failed to delete old document file: ${oldPath}`, e);
    }
  }

  // Update record (increment version, update url/size)
  return await repository.updateDocument(documentId, {
    file_url: uploadResult.publicUrl,
    file_size: file.size,
    version: doc.version + 1,
  });
}

export async function deleteDocument(propertyId: string, id: string): Promise<void> {
  const doc = await repository.getDocumentById(id);
  if (!doc || doc.propertyId !== propertyId) throw new Error("Document not found");

  // Delete from DB
  await repository.deleteDocument(id);

  // Delete from storage
  const path = extractPathFromUrl(doc.fileUrl, BUCKET_NAME);
  if (path) {
    try {
      await deleteFile(path, BUCKET_NAME);
    } catch (e) {
      console.error(`Failed to delete document file: ${path}`, e);
    }
  }
}
