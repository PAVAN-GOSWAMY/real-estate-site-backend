import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyBrochureService } from "@/modules/property-brochures/service/property-brochure.service";
import { createClient } from "@/lib/supabase/server";
import { updatePropertyBrochureSchema } from "@/modules/property-brochures/validators/property-brochure.validator";
import { PropertyBrochureMapper } from "@/modules/property-brochures/mapper/property-brochure.mapper";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyBrochureId: string }> }
) {
  try {
    const { propertyBrochureId: id } = await params;
    const supabase = await createClient();
    const service = new PropertyBrochureService(supabase);

    const brochure = await service.getBrochure(id);
    const mappedData = PropertyBrochureMapper.toResponse(brochure);

    return ApiResponse.success(mappedData);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ propertyBrochureId: string }> }
) {
  try {
    const { propertyBrochureId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_BROCHURES.UPDATE);

    const body = await req.json();
    const dto = updatePropertyBrochureSchema.parse(body);

    const service = new PropertyBrochureService(supabase);
    const brochure = await service.updateBrochure(id, dto);

    const mappedData = PropertyBrochureMapper.toResponse(brochure);
    return ApiResponse.success(mappedData, "Property brochure updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ propertyBrochureId: string }> }
) {
  try {
    const { propertyBrochureId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_BROCHURES.DELETE);

    const service = new PropertyBrochureService(supabase);
    await service.deleteBrochure(id);

    return ApiResponse.noContent();
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
