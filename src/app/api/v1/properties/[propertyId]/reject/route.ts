import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyPublicationService } from "@/modules/property-publications/service/property-publication.service";
import { createClient } from "@/lib/supabase/server";
import { changePublicationStatusSchema } from "@/modules/property-publications/validators/property-publication.validator";
import { PropertyPublicationMapper } from "@/modules/property-publications/mapper/property-publication.mapper";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.APPROVE); // Using APPROVE permission for REJECT as well

    const body = await req.json().catch(() => ({}));
    const dto = changePublicationStatusSchema.parse(body);

    const service = new PropertyPublicationService(supabase);
    const transition = await service.rejectProperty(id, dto);

    const mappedData = PropertyPublicationMapper.toResponse(transition);
    return ApiResponse.success(mappedData, "Property rejected successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
