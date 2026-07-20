import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyVideoService } from "@/modules/property-videos/service/property-video.service";
import { createClient } from "@/lib/supabase/server";
import { reorderPropertyVideosSchema } from "@/modules/property-videos/validators/property-video.validator";
import { PropertyVideoMapper } from "@/modules/property-videos/mapper/property-video.mapper";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_VIDEOS.REORDER);

    const body = await req.json();
    const dto = reorderPropertyVideosSchema.parse({
      ...body,
      property_id: propertyId
    });

    const service = new PropertyVideoService(supabase);
    const results = await service.reorderVideos(dto);

    const mappedData = PropertyVideoMapper.toResponseList(results);
    return ApiResponse.success(mappedData, "Videos reordered successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
