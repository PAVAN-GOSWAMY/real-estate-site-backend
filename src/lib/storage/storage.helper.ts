import { SupabaseClient } from "@supabase/supabase-js";
import { StorageError } from "../errors/domain.error";
import { v4 as uuidv4 } from "uuid";

export class StorageHelper {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Uploads a file to Supabase storage.
   * Enforces the naming standard: [uuid]_[timestamp]_[slug].[ext]
   */
  async uploadFile(
    bucket: string,
    folder: string,
    file: File,
    slug: string
  ): Promise<string> {
    const ext = file.name.split('.').pop();
    const timestamp = Date.now();
    const entityId = uuidv4(); // Generate a new UUID for the file record
    const filename = `${entityId}_${timestamp}_${slug}.${ext}`;
    const filePath = `${folder}/${filename}`;

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "31536000",
        upsert: false,
      });

    if (error) {
      console.error("[StorageHelper] Upload failed:", error);
      throw new StorageError("Failed to upload file");
    }

    return data.path;
  }

  /**
   * Deletes a file from Supabase storage.
   */
  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage.from(bucket).remove([path]);
    
    if (error) {
      console.error("[StorageHelper] Delete failed:", error);
      throw new StorageError("Failed to delete file");
    }
  }

  /**
   * Retrieves a signed URL for private buckets (e.g., secure-documents).
   */
  async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error || !data) {
      console.error("[StorageHelper] Signed URL generation failed:", error);
      throw new StorageError("Failed to generate signed URL");
    }

    return data.signedUrl;
  }

  /**
   * Retrieves the public URL for public buckets.
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
