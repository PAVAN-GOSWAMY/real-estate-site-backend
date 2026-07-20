import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyVideoService } from "@/modules/property-videos/service/property-video.service";
import { createClient } from "@/lib/supabase/server";
import { updatePropertyVideoSchema } from "@/modules/property-videos/validators/property-video.validator";
import { PropertyVideoMapper } from "@/modules/property-videos/mapper/property-video.mapper";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyVideoId: string }> }
) {
  try {
    const { propertyVideoId: id } = await params;
    const supabase = await createClient();
    const service = new PropertyVideoService(supabase);

    const video = await service.getVideo(id);
    const mappedData = PropertyVideoMapper.toResponse(video);

    return ApiResponse.success(mappedData);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ propertyVideoId: string }> }
) {
  try {
    const { propertyVideoId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_VIDEOS.UPDATE);

    const body = await req.json();
    const dto = updatePropertyVideoSchema.parse(body);

    const service = new PropertyVideoService(supabase);
    const video = await service.updateVideo(id, dto);

    const mappedData = PropertyVideoMapper.toResponse(video);
    return ApiResponse.success(mappedData, "Property video updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ propertyVideoId: string }> }
) {
  try {
    const { propertyVideoId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_VIDEOS.DELETE);

    const service = new PropertyVideoService(supabase);
    await service.deleteVideo(id);

    return ApiResponse.noContent();
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
