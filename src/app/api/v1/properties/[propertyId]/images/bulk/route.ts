import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyImageService } from "@/modules/property-images/service/property-image.service";
import { createClient } from "@/lib/supabase/server";
import { 
  bulkUploadPropertyImagesSchema,
  bulkUpdatePropertyImagesSchema,
  bulkDeletePropertyImagesSchema
} from "@/modules/property-images/validators/property-image.validator";
import { PropertyImageMapper } from "@/modules/property-images/mapper/property-image.mapper";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_IMAGES.UPLOAD);

    const body = await req.json();
    const dto = bulkUploadPropertyImagesSchema.parse({
      ...body,
      property_id: propertyId
    });

    const service = new PropertyImageService(supabase);
    const results = await service.bulkUpload(dto);

    const mappedData = PropertyImageMapper.toResponseList(results);
    return ApiResponse.success(mappedData, "Images bulk uploaded successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_IMAGES.UPDATE);

    const body = await req.json();
    const dto = bulkUpdatePropertyImagesSchema.parse({
      ...body,
      property_id: propertyId
    });

    const service = new PropertyImageService(supabase);
    const results = await service.bulkUpdate(dto);

    const mappedData = PropertyImageMapper.toResponseList(results);
    return ApiResponse.success(mappedData, "Images bulk updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_IMAGES.DELETE);

    const body = await req.json();
    const dto = bulkDeletePropertyImagesSchema.parse({
      ...body,
      property_id: propertyId
    });

    const service = new PropertyImageService(supabase);
    await service.bulkDelete(dto);

    return ApiResponse.noContent();
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
