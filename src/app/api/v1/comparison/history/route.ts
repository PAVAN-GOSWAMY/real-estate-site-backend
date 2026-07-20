import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyComparisonService } from "@/modules/property-comparisons/service/property-comparisons.service";
import { createClient } from "@/lib/supabase/server";
import { comparisonHistoryQuerySchema } from "@/modules/property-comparisons/validators/property-comparisons.validator";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.COMPARISON.VIEW);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = comparisonHistoryQuerySchema.parse(searchParams);

    const service = new PropertyComparisonService(supabase);
    const { data, count } = await service.getHistory(query);

    const paginationMeta = calculatePagination(count, query.page, query.limit);
    return ApiResponse.paginated(data, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
