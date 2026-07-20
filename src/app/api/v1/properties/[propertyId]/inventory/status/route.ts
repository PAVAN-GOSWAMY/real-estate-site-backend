import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyInventoryService } from "@/modules/property-inventory/service/property-inventory.service";
import { createClient } from "@/lib/supabase/server";
import { updateInventoryStatusSchema } from "@/modules/property-inventory/validators/property-inventory.validator";
import { PropertyInventoryMapper } from "@/modules/property-inventory/mapper/property-inventory.mapper";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.INVENTORY.UPDATE);

    const body = await req.json();
    const dto = updateInventoryStatusSchema.parse(body);

    const service = new PropertyInventoryService(supabase);
    const state = await service.updateStatus(id, dto);

    const mappedData = PropertyInventoryMapper.toStateResponse(state);
    return ApiResponse.success(mappedData, "Inventory status overridden successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
