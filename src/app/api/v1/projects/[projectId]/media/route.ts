import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { ProjectMediaService } from "@/modules/project-media/service/project-media.service";
import { createClient } from "@/lib/supabase/server";
import { createProjectMediaSchema, projectMediaFilterSchema } from "@/modules/project-media/validators/project-media.validator";
import { ProjectMediaMapper } from "@/modules/project-media/mapper/project-media.mapper";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const supabase = await createClient();
    const service = new ProjectMediaService(supabase);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = projectMediaFilterSchema.parse({
      ...searchParams,
      project_id: projectId
    });

    const { data, count } = await service.listMedia(query);

    const mappedData = ProjectMediaMapper.toResponseList(data);
    const paginationMeta = calculatePagination(count, query.page, query.limit);

    return ApiResponse.paginated(mappedData, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROJECT_MEDIA.CREATE);

    const body = await req.json();
    const dto = createProjectMediaSchema.parse({
      ...body,
      project_id: projectId
    });

    const service = new ProjectMediaService(supabase);
    const media = await service.createMedia(dto);

    const mappedData = ProjectMediaMapper.toResponse(media);
    return ApiResponse.success(mappedData, "Project media created successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
