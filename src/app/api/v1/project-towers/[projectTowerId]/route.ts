import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { ProjectTowerService } from "@/modules/project-towers/service/project-tower.service";
import { createClient } from "@/lib/supabase/server";
import { updateProjectTowerSchema } from "@/modules/project-towers/validators/project-tower.validator";
import { ProjectTowerMapper } from "@/modules/project-towers/mapper/project-tower.mapper";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectTowerId: string }> }
) {
  try {
    const { projectTowerId: id } = await params;
    const supabase = await createClient();
    const service = new ProjectTowerService(supabase);

    const tower = await service.getTower(id);
    const mappedData = ProjectTowerMapper.toResponse(tower);

    return ApiResponse.success(mappedData);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ projectTowerId: string }> }
) {
  try {
    const { projectTowerId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROJECT_TOWERS.UPDATE);

    const body = await req.json();
    const dto = updateProjectTowerSchema.parse(body);

    const service = new ProjectTowerService(supabase);
    const tower = await service.updateTower(id, dto);

    const mappedData = ProjectTowerMapper.toResponse(tower);
    return ApiResponse.success(mappedData, "Project tower updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectTowerId: string }> }
) {
  try {
    const { projectTowerId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROJECT_TOWERS.DELETE);

    const service = new ProjectTowerService(supabase);
    await service.deleteTower(id);

    return ApiResponse.noContent();
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
