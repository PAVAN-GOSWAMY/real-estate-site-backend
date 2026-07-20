import { z } from "zod";
import {
  createPropertyImageSchema,
  updatePropertyImageSchema,
  bulkUploadPropertyImagesSchema,
  bulkUpdatePropertyImagesSchema,
  bulkDeletePropertyImagesSchema,
  reorderPropertyImagesSchema,
  updateCoverImageSchema,
  propertyImageFilterSchema
} from "../validators/property-image.validator";
import { PropertyImageEntity } from "@/types/property-image.types";

export type CreatePropertyImageDto = z.infer<typeof createPropertyImageSchema>;
export type UpdatePropertyImageDto = z.infer<typeof updatePropertyImageSchema>;
export type BulkUploadPropertyImagesDto = z.infer<typeof bulkUploadPropertyImagesSchema>;
export type BulkUpdatePropertyImagesDto = z.infer<typeof bulkUpdatePropertyImagesSchema>;
export type BulkDeletePropertyImagesDto = z.infer<typeof bulkDeletePropertyImagesSchema>;
export type ReorderPropertyImagesDto = z.infer<typeof reorderPropertyImagesSchema>;
export type UpdateCoverImageDto = z.infer<typeof updateCoverImageSchema>;
export type PropertyImageFilterDto = z.infer<typeof propertyImageFilterSchema>;

export interface PropertyImageResponseDto extends Omit<PropertyImageEntity, 'deleted_at' | 'created_by' | 'updated_by'> {
  property?: {
    id: string;
    unit_code: string;
    slug: string;
  };
}

export type PropertyImageCardDto = Pick<PropertyImageResponseDto, 
  'id' | 'property_id' | 'image_type' | 'public_url' | 'thumbnail_url' | 'alt_text' | 'is_cover' | 'display_order' | 'room_name'>;
