import { createClient } from '@/lib/supabase/server';

/**
 * Options for uploading a file to storage.
 */
export interface UploadFileOptions {
  bucket: string;
  folder: string;
  file: File | Blob | ArrayBuffer | Uint8Array;
  fileName?: string;
  upsert?: boolean;
}

/**
 * Result of a successful file upload.
 */
export interface UploadFileResult {
  path: string;
  publicUrl: string;
}

/**
 * Extracts the file extension from a filename.
 * Returns the extension including the dot (e.g., ".png") or an empty string.
 */
function extractExtension(name: string): string {
  const lastDotIndex = name.lastIndexOf('.');
  // If no dot is found, or if the dot is the first character (hidden file without other extension)
  if (lastDotIndex === -1 || lastDotIndex === 0) return '';
  return name.slice(lastDotIndex).toLowerCase();
}

/**
 * Sanitizes a filename by converting to lowercase and replacing non-alphanumeric characters with hyphens.
 */
function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // Replace unsafe characters with hyphens
    .replace(/-+/g, '-')        // Collapse multiple hyphens into a single hyphen
    .replace(/^-|-$/g, '');     // Remove leading and trailing hyphens
}

/**
 * Generates a safe, collision-resistant filename using the original name, a timestamp, and a random string.
 */
function generateFileName(originalName: string): string {
  const ext = extractExtension(originalName);
  const nameWithoutExt = originalName.slice(0, originalName.length - ext.length);
  const sanitized = sanitizeFileName(nameWithoutExt) || 'file';
  const timestamp = Date.now();
  const randomToken = Math.random().toString(36).substring(2, 8);
  
  return `${sanitized}-${timestamp}-${randomToken}${ext}`;
}

/**
 * Uploads a file to the specified Supabase storage bucket.
 * Automatically generates a safe filename if one is not explicitly provided.
 * 
 * @param options Upload configuration including bucket, folder, and file.
 * @returns The path and public URL of the uploaded file.
 */
export async function uploadFile(options: UploadFileOptions): Promise<UploadFileResult> {
  try {
    const supabase = await createClient();
    const { bucket, folder, file, upsert = false } = options;

    let originalName = 'unknown';
    // Duck typing to safely extract original filename if a Web File object is passed
    if (file && typeof file === 'object' && 'name' in file && typeof file.name === 'string') {
      originalName = file.name;
    }

    const fileName = options.fileName || generateFileName(originalName);
    
    // Ensure folder structure is clean (no trailing/leading slashes)
    const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
    const path = cleanFolder ? `${cleanFolder}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert,
      });

    if (error) {
      throw new Error(error.message);
    }

    // Generate the public URL immediately after successful upload
    const publicUrl = await getPublicUrl(data.path, bucket);

    return {
      path: data.path,
      publicUrl,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Storage Error: Failed to upload file. ${msg}`);
  }
}

/**
 * Retrieves the public URL for a file stored in Supabase.
 * 
 * @param path The relative path of the file in the bucket.
 * @param bucket The storage bucket name.
 * @returns The public URL string.
 */
export async function getPublicUrl(path: string, bucket: string): Promise<string> {
  try {
    const supabase = await createClient();
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Storage Error: Failed to get public URL. ${msg}`);
  }
}

/**
 * Deletes a file from Supabase storage.
 * 
 * @param path The relative path of the file to delete.
 * @param bucket The storage bucket name.
 * @returns True if deletion was successful.
 */
export async function deleteFile(path: string, bucket: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.storage.from(bucket).remove([path]);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return true;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Storage Error: Failed to delete file. ${msg}`);
  }
}

/**
 * Moves or renames a file within the same bucket.
 * 
 * @param source The original path.
 * @param destination The new path.
 * @param bucket The storage bucket name.
 */
export async function moveFile(source: string, destination: string, bucket: string): Promise<void> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.storage.from(bucket).move(source, destination);
    
    if (error) {
      throw new Error(error.message);
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Storage Error: Failed to move file. ${msg}`);
  }
}

/**
 * Checks if a file exists in the specified bucket.
 * 
 * @param path The relative path of the file.
 * @param bucket The storage bucket name.
 * @returns True if the file exists, false otherwise.
 */
export async function fileExists(path: string, bucket: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    // Separate the folder and filename to perform a lightweight directory listing
    const lastSlashIndex = path.lastIndexOf('/');
    const folder = lastSlashIndex !== -1 ? path.substring(0, lastSlashIndex) : '';
    const fileName = lastSlashIndex !== -1 ? path.substring(lastSlashIndex + 1) : path;
    
    const { data, error } = await supabase.storage.from(bucket).list(folder, {
      search: fileName,
      limit: 1,
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Validate that the returned file exactly matches the requested filename
    return data && data.length > 0 && data[0].name === fileName;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Storage Error: Failed to check if file exists. ${msg}`);
  }
}
