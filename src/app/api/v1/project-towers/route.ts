import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { ProjectTowerService } from "@/modules/project-towers/service/project-tower.service";
import { createClient } from "@/lib/supabase/server";
import { createProjectTowerSchema, projectTowerFilterSchema } from "@/modules/project-towers/validators/project-tower.validator";
import { ProjectTowerMapper } from "@/modules/project-towers/mapper/project-tower.mapper";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const service = new ProjectTowerService(supabase);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = projectTowerFilterSchema.parse(searchParams);

    const { data, count } = await service.listTowers(query);

    const mappedData = ProjectTowerMapper.toResponseList(data);
    const paginationMeta = calculatePagination(count, query.page, query.limit);

    return ApiResponse.paginated(mappedData, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROJECT_TOWERS.CREATE);

    const body = await req.json();
    const dto = createProjectTowerSchema.parse(body);

    const service = new ProjectTowerService(supabase);
    const tower = await service.createTower(dto);

    const mappedData = ProjectTowerMapper.toResponse(tower);
    return ApiResponse.success(mappedData, "Project tower created successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
