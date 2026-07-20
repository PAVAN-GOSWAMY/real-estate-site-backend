import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyInventoryService } from "@/modules/property-inventory/service/property-inventory.service";
import { createClient } from "@/lib/supabase/server";
import { PropertyInventoryMapper } from "@/modules/property-inventory/mapper/property-inventory.mapper";

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

    const service = new PropertyInventoryService(supabase);
    const state = await service.getInventory(id);

    const mappedData = PropertyInventoryMapper.toStateResponse(state);
    return ApiResponse.success(mappedData);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
