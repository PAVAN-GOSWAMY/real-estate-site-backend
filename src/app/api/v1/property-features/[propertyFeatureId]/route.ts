import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyFeatureService } from "@/modules/property-features/service/property-feature.service";
import { createClient } from "@/lib/supabase/server";
import { updatePropertyFeatureSchema } from "@/modules/property-features/validators/property-feature.validator";
import { PropertyFeatureMapper } from "@/modules/property-features/mapper/property-feature.mapper";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyFeatureId: string }> }
) {
  try {
    const { propertyFeatureId: id } = await params;
    const supabase = await createClient();
    const service = new PropertyFeatureService(supabase);

    const assignment = await service.getAssignment(id);
    const mappedData = PropertyFeatureMapper.toResponse(assignment);

    return ApiResponse.success(mappedData);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ propertyFeatureId: string }> }
) {
  try {
    const { propertyFeatureId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_FEATURES.UPDATE);

    const body = await req.json();
    const dto = updatePropertyFeatureSchema.parse(body);

    const service = new PropertyFeatureService(supabase);
    const assignment = await service.updateAssignment(id, dto);

    const mappedData = PropertyFeatureMapper.toResponse(assignment);
    return ApiResponse.success(mappedData, "Property feature assignment updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ propertyFeatureId: string }> }
) {
  try {
    const { propertyFeatureId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_FEATURES.DELETE);

    const service = new PropertyFeatureService(supabase);
    await service.removeAssignment(id);

    return ApiResponse.noContent();
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
