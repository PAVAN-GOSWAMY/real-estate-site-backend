import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { ProjectAmenityService } from "@/modules/project-amenities/service/project-amenity.service";
import { createClient } from "@/lib/supabase/server";
import { 
  bulkAssignProjectAmenitiesSchema,
  bulkUpdateProjectAmenitiesSchema,
  bulkDeleteProjectAmenitiesSchema
} from "@/modules/project-amenities/validators/project-amenity.validator";
import { ProjectAmenityMapper } from "@/modules/project-amenities/mapper/project-amenity.mapper";

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
    const dto = bulkAssignProjectAmenitiesSchema.parse({
      ...body,
      project_id: projectId
    });

    const service = new ProjectAmenityService(supabase);
    const results = await service.bulkAssignAmenities(dto);

    const mappedData = ProjectAmenityMapper.toResponseList(results);
    return ApiResponse.success(mappedData, "Amenities bulk assigned successfully", 201);
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
    PermissionHelper.requirePermission(session, Permissions.PROJECT_AMENITIES.UPDATE);

    const body = await req.json();
    const dto = bulkUpdateProjectAmenitiesSchema.parse({
      ...body,
      project_id: projectId
    });

    const service = new ProjectAmenityService(supabase);
    const results = await service.bulkUpdateAmenities(dto);

    const mappedData = ProjectAmenityMapper.toResponseList(results);
    return ApiResponse.success(mappedData, "Amenities bulk updated successfully");
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
    PermissionHelper.requirePermission(session, Permissions.PROJECT_AMENITIES.DELETE);

    const body = await req.json();
    const dto = bulkDeleteProjectAmenitiesSchema.parse({
      ...body,
      project_id: projectId
    });

    const service = new ProjectAmenityService(supabase);
    await service.bulkRemoveAmenities(dto);

    return ApiResponse.noContent();
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
