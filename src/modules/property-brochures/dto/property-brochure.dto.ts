import { z } from "zod";
import {
  createPropertyBrochureSchema,
  updatePropertyBrochureSchema,
  bulkUploadPropertyBrochuresSchema,
  bulkUpdatePropertyBrochuresSchema,
  bulkDeletePropertyBrochuresSchema,
  reorderPropertyBrochuresSchema,
  updatePrimaryBrochureSchema,
  propertyBrochureFilterSchema
} from "../validators/property-brochure.validator";
import { PropertyBrochureEntity } from "@/types/property-brochure.types";

export type CreatePropertyBrochureDto = z.infer<typeof createPropertyBrochureSchema>;
export type UpdatePropertyBrochureDto = z.infer<typeof updatePropertyBrochureSchema>;
export type BulkUploadPropertyBrochuresDto = z.infer<typeof bulkUploadPropertyBrochuresSchema>;
export type BulkUpdatePropertyBrochuresDto = z.infer<typeof bulkUpdatePropertyBrochuresSchema>;
export type BulkDeletePropertyBrochuresDto = z.infer<typeof bulkDeletePropertyBrochuresSchema>;
export type ReorderPropertyBrochuresDto = z.infer<typeof reorderPropertyBrochuresSchema>;
export type UpdatePrimaryBrochureDto = z.infer<typeof updatePrimaryBrochureSchema>;
export type PropertyBrochureFilterDto = z.infer<typeof propertyBrochureFilterSchema>;

export interface PropertyBrochureResponseDto extends Omit<PropertyBrochureEntity, 'deleted_at' | 'created_by' | 'updated_by'> {
  property?: {
    id: string;
    unit_code: string;
    slug: string;
  };
}

export type PropertyBrochureCardDto = Pick<PropertyBrochureResponseDto, 
  'id' | 'property_id' | 'brochure_name' | 'brochure_code' | 'brochure_type' | 'version' | 'language' | 'public_url' | 'thumbnail_url' | 'file_size' | 'page_count' | 'download_count' | 'is_latest_version' | 'is_downloadable' | 'display_order'>;
