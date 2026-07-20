import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyRecommendationService } from "@/modules/property-recommendations/service/property-recommendations.service";
import { createClient } from "@/lib/supabase/server";
import { bulkRecommendSchema } from "@/modules/property-recommendations/validators/property-recommendations.validator";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.RECOMMEND.MANAGE);

    const body = await req.json();
    const dto = bulkRecommendSchema.parse(body);

    const service = new PropertyRecommendationService(supabase);
    const response = await service.bulkRecommend(dto);

    return ApiResponse.success(response, "Bulk recommend operation processed");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
