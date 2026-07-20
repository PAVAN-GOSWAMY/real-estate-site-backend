import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyInventoryService } from "@/modules/property-inventory/service/property-inventory.service";
import { createClient } from "@/lib/supabase/server";
import { bulkUpdateInventoryStatusSchema } from "@/modules/property-inventory/validators/property-inventory.validator";

export async function PATCH(
  req: NextRequest
) {
  try {
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.INVENTORY.UPDATE);

    const body = await req.json();
    const dto = bulkUpdateInventoryStatusSchema.parse(body);

    const service = new PropertyInventoryService(supabase);
    const response = await service.bulkUpdateStatus(dto);

    return ApiResponse.success(response, "Bulk inventory status updated");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
