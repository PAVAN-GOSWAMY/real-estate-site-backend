import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyPricingService } from "@/modules/property-pricing/service/property-pricing.service";
import { createClient } from "@/lib/supabase/server";
import { pendingRevisionsQuerySchema } from "@/modules/property-pricing/validators/property-pricing.validator";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(
  req: NextRequest
) {
  try {
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.PRICING.APPROVE);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = pendingRevisionsQuerySchema.parse(searchParams);

    const service = new PropertyPricingService(supabase);
    const { data, count } = await service.getPendingRevisions(query);

    const paginationMeta = calculatePagination(count, query.page, query.limit);
    return ApiResponse.paginated(data, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
