import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyInventoryService } from "@/modules/property-inventory/service/property-inventory.service";
import { createClient } from "@/lib/supabase/server";
import { bulkReleaseInventorySchema } from "@/modules/property-inventory/validators/property-inventory.validator";

export async function POST(
  req: NextRequest
) {
  try {
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.INVENTORY.RELEASE);

    const body = await req.json();
    const dto = bulkReleaseInventorySchema.parse(body);

    const service = new PropertyInventoryService(supabase);
    const response = await service.bulkRelease(dto);

    return ApiResponse.success(response, "Bulk inventory release processed");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
