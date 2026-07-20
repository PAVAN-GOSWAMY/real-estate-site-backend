import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyFloorPlanService } from "@/modules/property-floor-plans/service/property-floor-plan.service";
import { createClient } from "@/lib/supabase/server";
import { updatePropertyFloorPlanSchema } from "@/modules/property-floor-plans/validators/property-floor-plan.validator";
import { PropertyFloorPlanMapper } from "@/modules/property-floor-plans/mapper/property-floor-plan.mapper";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyFloorPlanId: string }> }
) {
  try {
    const { propertyFloorPlanId: id } = await params;
    const supabase = await createClient();
    const service = new PropertyFloorPlanService(supabase);

    const plan = await service.getFloorPlan(id);
    const mappedData = PropertyFloorPlanMapper.toResponse(plan);

    return ApiResponse.success(mappedData);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ propertyFloorPlanId: string }> }
) {
  try {
    const { propertyFloorPlanId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_FLOOR_PLANS.UPDATE);

    const body = await req.json();
    const dto = updatePropertyFloorPlanSchema.parse(body);

    const service = new PropertyFloorPlanService(supabase);
    const plan = await service.updateFloorPlan(id, dto);

    const mappedData = PropertyFloorPlanMapper.toResponse(plan);
    return ApiResponse.success(mappedData, "Property floor plan updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ propertyFloorPlanId: string }> }
) {
  try {
    const { propertyFloorPlanId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_FLOOR_PLANS.DELETE);

    const service = new PropertyFloorPlanService(supabase);
    await service.deleteFloorPlan(id);

    return ApiResponse.noContent();
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
