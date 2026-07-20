import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyFloorPlanService } from "@/modules/property-floor-plans/service/property-floor-plan.service";
import { createClient } from "@/lib/supabase/server";
import { updatePrimaryFloorPlanSchema } from "@/modules/property-floor-plans/validators/property-floor-plan.validator";
import { PropertyFloorPlanMapper } from "@/modules/property-floor-plans/mapper/property-floor-plan.mapper";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_FLOOR_PLANS.UPDATE);

    const body = await req.json();
    const dto = updatePrimaryFloorPlanSchema.parse({
      ...body,
      property_id: propertyId
    });

    const service = new PropertyFloorPlanService(supabase);
    const propertyFloorPlan = await service.setPrimaryFloorPlan(dto);

    const mappedData = PropertyFloorPlanMapper.toResponse(propertyFloorPlan);
    return ApiResponse.success(mappedData, "Primary floor plan updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
