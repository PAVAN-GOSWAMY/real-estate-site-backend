import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { ProjectMediaService } from "@/modules/project-media/service/project-media.service";
import { createClient } from "@/lib/supabase/server";
import { reorderProjectMediaSchema } from "@/modules/project-media/validators/project-media.validator";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROJECT_MEDIA.REORDER);

    const body = await req.json();
    const dto = reorderProjectMediaSchema.parse({
      ...body,
      project_id: projectId
    });

    const service = new ProjectMediaService(supabase);
    await service.reorderMedia(dto);

    return ApiResponse.success(null, "Media reordered successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
