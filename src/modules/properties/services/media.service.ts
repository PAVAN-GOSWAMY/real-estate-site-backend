import * as repository from '../repository/media.repository';
import * as storageService from '@/lib/storage/storage.service';
import { PropertyMedia, MediaType, UpdateMediaOrderInput } from '../types/media';

const PROPERTY_MEDIA_BUCKET = 'property-media';

/**
 * Gets all media for a property.
 */
export async function getPropertyMedia(propertyId: string): Promise<PropertyMedia[]> {
  try {
    return await repository.getMediaByProperty(propertyId);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Service Error: Failed to fetch property media. ${msg}`);
  }
}

/**
 * Uploads a new media file for a property.
 * If mediaType is COVER_IMAGE, replaces any existing cover image.
 */
export async function uploadMedia(propertyId: string, mediaType: MediaType, file: File): Promise<PropertyMedia> {
  try {
    // 1. If COVER_IMAGE, clean up existing cover image first
    if (mediaType === MediaType.COVER_IMAGE) {
      const allMedia = await repository.getMediaByProperty(propertyId);
      const existingCovers = allMedia.filter(m => m.mediaType === MediaType.COVER_IMAGE);
      
      for (const cover of existingCovers) {
        // Delete from storage
        const relativePath = `${propertyId}/${cover.fileName}`;
        try {
          await storageService.deleteFile(relativePath, PROPERTY_MEDIA_BUCKET);
        } catch (e) {
          console.error("Failed to delete old cover image from storage:", e);
        }
      }
      
      // Delete from DB
      await repository.deleteMediaByType(propertyId, MediaType.COVER_IMAGE);
    }

    // 2. Upload to storage
    const uploadResult = await storageService.uploadFile({
      bucket: PROPERTY_MEDIA_BUCKET,
      folder: propertyId,
      file,
      upsert: true
    });

    const fileName = uploadResult.path.split('/').pop() || 'unknown';

    // 3. Determine display order
    const currentMax = await repository.getMaxDisplayOrder(propertyId, mediaType);
    const displayOrder = currentMax + 1;

    // 4. Save to database
    return await repository.createMedia({
      propertyId,
      mediaType,
      url: uploadResult.publicUrl,
      fileName,
      fileSize: file.size,
      mimeType: file.type,
      displayOrder,
      isFeatured: mediaType === MediaType.COVER_IMAGE, // Cover image is always featured
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Service Error: Failed to upload media. ${msg}`);
  }
}

/**
 * Deletes a media item by ID.
 */
export async function deleteMedia(id: string): Promise<PropertyMedia> {
  try {
    const existing = await repository.getMediaById(id);
    if (!existing) {
      throw new Error(`Not Found: Media with ID ${id} does not exist.`);
    }

    // 1. Delete from storage
    if (existing.fileName) {
      const relativePath = `${existing.propertyId}/${existing.fileName}`;
      try {
        await storageService.deleteFile(relativePath, PROPERTY_MEDIA_BUCKET);
      } catch (e) {
        console.error("Failed to delete file from storage:", e);
      }
    }

    // 2. Delete from DB
    return await repository.deleteMedia(id);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Service Error: Failed to delete media. ${msg}`);
  }
}

/**
 * Updates the display order for multiple media items.
 */
export async function updateMediaOrder(updates: UpdateMediaOrderInput[]): Promise<void> {
  try {
    await repository.updateMediaOrder(updates);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Service Error: Failed to update media order. ${msg}`);
  }
}

/**
 * Sets an existing gallery image as the cover image.
 */
export async function setAsCover(propertyId: string, mediaId: string): Promise<void> {
  try {
    const targetMedia = await repository.getMediaById(mediaId);
    if (!targetMedia || targetMedia.propertyId !== propertyId) {
      throw new Error(`Not Found: Valid media with ID ${mediaId} not found for this property.`);
    }

    // Since we're essentially replacing the cover image but using an existing file,
    // this requires either downloading/re-uploading, duplicating in storage, or
    // we can simply change its mediaType in the database.
    // Let's do a simple DB update approach for now:
    // 1. Delete existing cover DB records (leaving storage intact if they are just converted? Actually we should delete them fully)
    
    const allMedia = await repository.getMediaByProperty(propertyId);
    const existingCovers = allMedia.filter(m => m.mediaType === MediaType.COVER_IMAGE);
    
    // We will convert existing cover to a gallery image, and the target gallery image to cover
    // To keep it simple, let's just make target COVER_IMAGE, and all others GALLERY_IMAGE
    
    const updates = allMedia.map(m => {
      let newType = m.mediaType;
      if (m.id === mediaId) {
        newType = MediaType.COVER_IMAGE;
      } else if (m.mediaType === MediaType.COVER_IMAGE) {
        newType = MediaType.GALLERY_IMAGE;
      }
      return { id: m.id, mediaType: newType };
    });

    // We don't have a batch update for everything, so let's just use createClient directly here for simplicity
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    
    for (const update of updates) {
      if (update.mediaType === MediaType.COVER_IMAGE) {
        await supabase.from('property_media').update({ media_type: MediaType.COVER_IMAGE, is_featured: true }).eq('id', update.id);
      } else if (update.mediaType === MediaType.GALLERY_IMAGE && update.id !== mediaId) {
        // Find existing covers and revert them to gallery image
        const orig = existingCovers.find(c => c.id === update.id);
        if (orig) {
          await supabase.from('property_media').update({ media_type: MediaType.GALLERY_IMAGE, is_featured: false }).eq('id', update.id);
        }
      }
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Service Error: Failed to set cover image. ${msg}`);
  }
}
