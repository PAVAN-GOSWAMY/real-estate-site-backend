import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { ProjectAmenityService } from "@/modules/project-amenities/service/project-amenity.service";
import { createClient } from "@/lib/supabase/server";
import { updateProjectAmenitySchema } from "@/modules/project-amenities/validators/project-amenity.validator";
import { ProjectAmenityMapper } from "@/modules/project-amenities/mapper/project-amenity.mapper";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectAmenityId: string }> }
) {
  try {
    const { projectAmenityId: id } = await params;
    const supabase = await createClient();
    const service = new ProjectAmenityService(supabase);

    const assignment = await service.getAssignment(id);
    const mappedData = ProjectAmenityMapper.toResponse(assignment);

    return ApiResponse.success(mappedData);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ projectAmenityId: string }> }
) {
  try {
    const { projectAmenityId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROJECT_AMENITIES.UPDATE);

    const body = await req.json();
    const dto = updateProjectAmenitySchema.parse(body);

    const service = new ProjectAmenityService(supabase);
    const assignment = await service.updateAssignment(id, dto);

    const mappedData = ProjectAmenityMapper.toResponse(assignment);
    return ApiResponse.success(mappedData, "Project amenity assignment updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectAmenityId: string }> }
) {
  try {
    const { projectAmenityId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROJECT_AMENITIES.DELETE);

    const service = new ProjectAmenityService(supabase);
    await service.removeAssignment(id);

    return ApiResponse.noContent();
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
