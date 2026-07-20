import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyPricingService } from "@/modules/property-pricing/service/property-pricing.service";
import { createClient } from "@/lib/supabase/server";
import { pricingHistoryQuerySchema } from "@/modules/property-pricing/validators/property-pricing.validator";
import { PropertyPricingMapper } from "@/modules/property-pricing/mapper/property-pricing.mapper";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.PRICING.VIEW);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = pricingHistoryQuerySchema.parse(searchParams);

    const service = new PropertyPricingService(supabase);
    const { data, count } = await service.getPricingHistory(id, query);

    const mappedData = PropertyPricingMapper.toResponseList(data);
    const paginationMeta = calculatePagination(count, query.page, query.limit);

    return ApiResponse.paginated(mappedData, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
