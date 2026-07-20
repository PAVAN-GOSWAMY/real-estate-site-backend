import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { ProjectMediaService } from "@/modules/project-media/service/project-media.service";
import { createClient } from "@/lib/supabase/server";
import { projectMediaStatusSchema } from "@/modules/project-media/validators/project-media.validator";
import { ProjectMediaMapper } from "@/modules/project-media/mapper/project-media.mapper";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ projectMediaId: string }> }
) {
  try {
    const { projectMediaId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROJECT_MEDIA.UPDATE);

    const body = await req.json();
    const dto = projectMediaStatusSchema.parse(body);

    const service = new ProjectMediaService(supabase);
    const media = await service.updateStatus(id, dto);

    const mappedData = ProjectMediaMapper.toResponse(media);
    return ApiResponse.success(mappedData, "Media status updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
