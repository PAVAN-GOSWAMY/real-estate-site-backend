import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyVideoService } from "@/modules/property-videos/service/property-video.service";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyVideoId: string }> }
) {
  try {
    const { propertyVideoId: id } = await params;
    const supabase = await createClient();
    
    // Depending on business requirements, streaming might be public or gated.
    // If it's a lead-capture video (e.g. 360 tour), we might require auth.
    // Assuming we validate STREAM permissions here.
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_VIDEOS.STREAM);

    const service = new PropertyVideoService(supabase);
    
    // registerStream increments the DB view counter and returns { url, provider, provider_video_id }
    const streamData = await service.registerStream(id);

    return ApiResponse.success(streamData, "Stream registered");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
