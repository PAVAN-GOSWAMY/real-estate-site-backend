import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyPublicationService } from "@/modules/property-publications/service/property-publication.service";
import { createClient } from "@/lib/supabase/server";
import { bulkChangePublicationStatusSchema } from "@/modules/property-publications/validators/property-publication.validator";
import { PropertyPublicationMapper } from "@/modules/property-publications/mapper/property-publication.mapper";

export async function POST(
  req: NextRequest
) {
  try {
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.PUBLISH);

    const body = await req.json();
    const dto = bulkChangePublicationStatusSchema.parse(body);

    const service = new PropertyPublicationService(supabase);
    const results = await service.bulkPublish(dto);

    const mappedData = PropertyPublicationMapper.toResponseList(results);
    return ApiResponse.success(mappedData, "Properties bulk published successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
