import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyRecommendationService } from "@/modules/property-recommendations/service/property-recommendations.service";
import { createClient } from "@/lib/supabase/server";
import { dashboardQuerySchema } from "@/modules/property-recommendations/validators/property-recommendations.validator";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.RECOMMEND.MANAGE);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = dashboardQuerySchema.parse(searchParams);

    const service = new PropertyRecommendationService(supabase);
    const { data, count } = await service.getDashboard(query);

    const paginationMeta = calculatePagination(count, query.page, query.limit);
    return ApiResponse.paginated(data, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
