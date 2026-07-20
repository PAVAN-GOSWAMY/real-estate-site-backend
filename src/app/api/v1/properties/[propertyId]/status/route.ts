import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyService } from "@/modules/properties/service/property.service";
import { createClient } from "@/lib/supabase/server";
import { updatePropertyStatusSchema } from "@/modules/properties/validators/property.validator";
import { PropertyMapper } from "@/modules/properties/mapper/property.mapper";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.UPDATE);

    const body = await req.json();
    const dto = updatePropertyStatusSchema.parse(body);

    const service = new PropertyService(supabase);
    const property = await service.updateStatus(id, dto);

    const mappedData = PropertyMapper.toResponse(property);
    return ApiResponse.success(mappedData, "Property status updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
