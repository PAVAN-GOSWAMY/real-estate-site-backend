import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyRecommendationService } from "@/modules/property-recommendations/service/property-recommendations.service";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.FEATURE.MANAGE);

    const service = new PropertyRecommendationService(supabase);
    await service.unfeatureProperty(id);

    return ApiResponse.success(null, "Property unfeatured successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
