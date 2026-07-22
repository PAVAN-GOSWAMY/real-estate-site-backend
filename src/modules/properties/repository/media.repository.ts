import { createClient } from '@/lib/supabase/server';
import { PropertyMedia, CreateMediaInput, UpdateMediaOrderInput, MediaType } from '../types/media';

/**
 * Maps the database row to the PropertyMedia interface.
 */
function mapMediaRow(row: any): PropertyMedia {
  return {
    id: row.id,
    propertyId: row.property_id,
    mediaType: row.media_type as MediaType,
    url: row.url,
    fileName: row.file_name,
    fileSize: row.file_size,
    mimeType: row.mime_type,
    displayOrder: row.display_order,
    isFeatured: row.is_featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Gets all media for a specific property.
 */
export async function getMediaByProperty(propertyId: string): Promise<PropertyMedia[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('property_media')
    .select('*')
    .eq('property_id', propertyId)
    .order('display_order', { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map(mapMediaRow);
}

/**
 * Creates a new media record.
 */
export async function createMedia(input: CreateMediaInput): Promise<PropertyMedia> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('property_media')
    .insert({
      property_id: input.propertyId,
      media_type: input.mediaType,
      url: input.url,
      file_name: input.fileName,
      file_size: input.fileSize,
      mime_type: input.mimeType,
      display_order: input.displayOrder || 0,
      is_featured: input.isFeatured || false,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapMediaRow(data);
}

/**
 * Retrieves a single media record by ID.
 */
export async function getMediaById(id: string): Promise<PropertyMedia | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('property_media')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(error.message);
  }
  return data ? mapMediaRow(data) : null;
}

/**
 * Deletes a media record.
 */
export async function deleteMedia(id: string): Promise<PropertyMedia> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('property_media')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapMediaRow(data);
}

/**
 * Batch updates the display order of media items.
 */
export async function updateMediaOrder(updates: UpdateMediaOrderInput[]): Promise<void> {
  const supabase = await createClient();
  
  // Use Promise.all to update each one (Supabase currently doesn't have a simple batch upsert for this without risking other fields if not provided)
  const promises = updates.map(update => 
    supabase
      .from('property_media')
      .update({ display_order: update.displayOrder })
      .eq('id', update.id)
  );

  const results = await Promise.all(promises);
  const errors = results.filter(r => r.error);
  
  if (errors.length > 0) {
    throw new Error(`Failed to update some media orders: ${errors[0].error?.message}`);
  }
}

/**
 * Gets the current highest display order for a specific media type and property.
 */
export async function getMaxDisplayOrder(propertyId: string, mediaType: MediaType): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('property_media')
    .select('display_order')
    .eq('property_id', propertyId)
    .eq('media_type', mediaType)
    .order('display_order', { ascending: false })
    .limit(1);

  if (error) throw new Error(error.message);
  return data && data.length > 0 ? data[0].display_order : -1;
}

/**
 * Deletes existing media by type (useful for enforcing a 1-to-1 relationship like COVER_IMAGE).
 */
export async function deleteMediaByType(propertyId: string, mediaType: MediaType): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('property_media')
    .delete()
    .eq('property_id', propertyId)
    .eq('media_type', mediaType);

  if (error) throw new Error(error.message);
}
