import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyImageService } from "@/modules/property-images/service/property-image.service";
import { createClient } from "@/lib/supabase/server";
import { updatePropertyImageSchema } from "@/modules/property-images/validators/property-image.validator";
import { PropertyImageMapper } from "@/modules/property-images/mapper/property-image.mapper";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyImageId: string }> }
) {
  try {
    const { propertyImageId: id } = await params;
    const supabase = await createClient();
    const service = new PropertyImageService(supabase);

    const propertyImage = await service.getImage(id);
    const mappedData = PropertyImageMapper.toResponse(propertyImage);

    return ApiResponse.success(mappedData);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ propertyImageId: string }> }
) {
  try {
    const { propertyImageId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_IMAGES.UPDATE);

    const body = await req.json();
    const dto = updatePropertyImageSchema.parse(body);

    const service = new PropertyImageService(supabase);
    const propertyImage = await service.updateImage(id, dto);

    const mappedData = PropertyImageMapper.toResponse(propertyImage);
    return ApiResponse.success(mappedData, "Property image updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ propertyImageId: string }> }
) {
  try {
    const { propertyImageId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_IMAGES.DELETE);

    const service = new PropertyImageService(supabase);
    await service.deleteImage(id);

    return ApiResponse.noContent();
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
