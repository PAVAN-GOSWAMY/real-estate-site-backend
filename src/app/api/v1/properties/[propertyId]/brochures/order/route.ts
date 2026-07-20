import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyBrochureService } from "@/modules/property-brochures/service/property-brochure.service";
import { createClient } from "@/lib/supabase/server";
import { reorderPropertyBrochuresSchema } from "@/modules/property-brochures/validators/property-brochure.validator";
import { PropertyBrochureMapper } from "@/modules/property-brochures/mapper/property-brochure.mapper";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_BROCHURES.REORDER);

    const body = await req.json();
    const dto = reorderPropertyBrochuresSchema.parse({
      ...body,
      property_id: propertyId
    });

    const service = new PropertyBrochureService(supabase);
    const results = await service.reorderBrochures(dto);

    const mappedData = PropertyBrochureMapper.toResponseList(results);
    return ApiResponse.success(mappedData, "Brochures reordered successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
