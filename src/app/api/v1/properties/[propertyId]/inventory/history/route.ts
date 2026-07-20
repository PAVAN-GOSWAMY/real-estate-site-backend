import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyInventoryService } from "@/modules/property-inventory/service/property-inventory.service";
import { createClient } from "@/lib/supabase/server";
import { inventoryHistoryQuerySchema } from "@/modules/property-inventory/validators/property-inventory.validator";
import { PropertyInventoryMapper } from "@/modules/property-inventory/mapper/property-inventory.mapper";
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
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.INVENTORY.VIEW);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = inventoryHistoryQuerySchema.parse(searchParams);

    const service = new PropertyInventoryService(supabase);
    const { data, count } = await service.getHistory(id, query);

    const mappedData = PropertyInventoryMapper.toTransactionResponseList(data);
    const paginationMeta = calculatePagination(count, query.page, query.limit);

    return ApiResponse.paginated(mappedData, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
