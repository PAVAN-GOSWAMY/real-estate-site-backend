import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyImageService } from "@/modules/property-images/service/property-image.service";
import { createClient } from "@/lib/supabase/server";
import { updateCoverImageSchema } from "@/modules/property-images/validators/property-image.validator";
import { PropertyImageMapper } from "@/modules/property-images/mapper/property-image.mapper";

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
    const dto = updateCoverImageSchema.parse({
      ...body,
      property_id: propertyId
    });

    const service = new PropertyImageService(supabase);
    const propertyImage = await service.setCoverImage(dto);

    const mappedData = PropertyImageMapper.toResponse(propertyImage);
    return ApiResponse.success(mappedData, "Cover image updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
