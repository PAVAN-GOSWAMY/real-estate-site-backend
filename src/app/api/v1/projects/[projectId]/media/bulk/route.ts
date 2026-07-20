import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { ProjectMediaService } from "@/modules/project-media/service/project-media.service";
import { createClient } from "@/lib/supabase/server";
import { 
  bulkUploadProjectMediaSchema,
  bulkUpdateProjectMediaSchema,
  bulkDeleteProjectMediaSchema
} from "@/modules/project-media/validators/project-media.validator";
import { ProjectMediaMapper } from "@/modules/project-media/mapper/project-media.mapper";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROJECT_MEDIA.UPLOAD);

    const body = await req.json();
    const dto = bulkUploadProjectMediaSchema.parse({
      ...body,
      project_id: projectId
    });

    const service = new ProjectMediaService(supabase);
    const results = await service.bulkCreateMedia(dto);

    const mappedData = ProjectMediaMapper.toResponseList(results);
    return ApiResponse.success(mappedData, "Media metadata bulk uploaded successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROJECT_MEDIA.UPDATE);

    const body = await req.json();
    const dto = bulkUpdateProjectMediaSchema.parse({
      ...body,
      project_id: projectId
    });

    const service = new ProjectMediaService(supabase);
    const results = await service.bulkUpdateMedia(dto);

    const mappedData = ProjectMediaMapper.toResponseList(results);
    return ApiResponse.success(mappedData, "Media metadata bulk updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROJECT_MEDIA.DELETE);

    const body = await req.json();
    const dto = bulkDeleteProjectMediaSchema.parse({
      ...body,
      project_id: projectId
    });

    const service = new ProjectMediaService(supabase);
    await service.bulkDeleteMedia(dto);

    return ApiResponse.noContent();
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
