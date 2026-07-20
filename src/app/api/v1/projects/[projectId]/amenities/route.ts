import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { ProjectAmenityService } from "@/modules/project-amenities/service/project-amenity.service";
import { createClient } from "@/lib/supabase/server";
import { assignProjectAmenitySchema, projectAmenityFilterSchema } from "@/modules/project-amenities/validators/project-amenity.validator";
import { ProjectAmenityMapper } from "@/modules/project-amenities/mapper/project-amenity.mapper";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const supabase = await createClient();
    const service = new ProjectAmenityService(supabase);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = projectAmenityFilterSchema.parse({
      ...searchParams,
      project_id: projectId
    });

    const { data, count } = await service.listAssignments(query);

    const mappedData = ProjectAmenityMapper.toResponseList(data);
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
    PermissionHelper.requirePermission(session, Permissions.PROJECT_AMENITIES.CREATE);

    const body = await req.json();
    const dto = assignProjectAmenitySchema.parse({
      ...body,
      project_id: projectId
    });

    const service = new ProjectAmenityService(supabase);
    const assignment = await service.assignAmenity(dto);

    const mappedData = ProjectAmenityMapper.toResponse(assignment);
    return ApiResponse.success(mappedData, "Amenity assigned to project successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
