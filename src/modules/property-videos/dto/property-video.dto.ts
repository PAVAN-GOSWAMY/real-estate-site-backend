import { z } from "zod";
import {
  createPropertyVideoSchema,
  updatePropertyVideoSchema,
  bulkUploadPropertyVideosSchema,
  bulkUpdatePropertyVideosSchema,
  bulkDeletePropertyVideosSchema,
  reorderPropertyVideosSchema,
  updatePrimaryVideoSchema,
  propertyVideoFilterSchema
} from "../validators/property-video.validator";
import { PropertyVideoEntity } from "@/types/property-video.types";

export type CreatePropertyVideoDto = z.infer<typeof createPropertyVideoSchema>;
export type UpdatePropertyVideoDto = z.infer<typeof updatePropertyVideoSchema>;
export type BulkUploadPropertyVideosDto = z.infer<typeof bulkUploadPropertyVideosSchema>;
export type BulkUpdatePropertyVideosDto = z.infer<typeof bulkUpdatePropertyVideosSchema>;
export type BulkDeletePropertyVideosDto = z.infer<typeof bulkDeletePropertyVideosSchema>;
export type ReorderPropertyVideosDto = z.infer<typeof reorderPropertyVideosSchema>;
export type UpdatePrimaryVideoDto = z.infer<typeof updatePrimaryVideoSchema>;
export type PropertyVideoFilterDto = z.infer<typeof propertyVideoFilterSchema>;

export interface PropertyVideoResponseDto extends Omit<PropertyVideoEntity, 'deleted_at' | 'created_by' | 'updated_by'> {
  property?: {
    id: string;
    unit_code: string;
    slug: string;
  };
}

export type PropertyVideoCardDto = Pick<PropertyVideoResponseDto, 
  'id' | 'property_id' | 'video_name' | 'title' | 'video_code' | 'video_type' | 'video_provider' | 'provider_video_id' | 'public_url' | 'thumbnail_url' | 'duration_seconds' | 'view_count' | 'is_primary' | 'is_downloadable' | 'display_order'>;

export interface PropertyVideoStreamDto {
  url: string;
  provider: string;
  provider_video_id: string | null;
}
