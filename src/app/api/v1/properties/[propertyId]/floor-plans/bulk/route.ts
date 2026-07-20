import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyFloorPlanService } from "@/modules/property-floor-plans/service/property-floor-plan.service";
import { createClient } from "@/lib/supabase/server";
import { 
  bulkUploadPropertyFloorPlansSchema,
  bulkUpdatePropertyFloorPlansSchema,
  bulkDeletePropertyFloorPlansSchema
} from "@/modules/property-floor-plans/validators/property-floor-plan.validator";
import { PropertyFloorPlanMapper } from "@/modules/property-floor-plans/mapper/property-floor-plan.mapper";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_FLOOR_PLANS.UPLOAD);

    const body = await req.json();
    const dto = bulkUploadPropertyFloorPlansSchema.parse({
      ...body,
      property_id: propertyId
    });

    const service = new PropertyFloorPlanService(supabase);
    const results = await service.bulkUpload(dto);

    const mappedData = PropertyFloorPlanMapper.toResponseList(results);
    return ApiResponse.success(mappedData, "Floor plans bulk uploaded successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

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
    const dto = bulkUpdatePropertyFloorPlansSchema.parse({
      ...body,
      property_id: propertyId
    });

    const service = new PropertyFloorPlanService(supabase);
    const results = await service.bulkUpdate(dto);

    const mappedData = PropertyFloorPlanMapper.toResponseList(results);
    return ApiResponse.success(mappedData, "Floor plans bulk updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_FLOOR_PLANS.DELETE);

    const body = await req.json();
    const dto = bulkDeletePropertyFloorPlansSchema.parse({
      ...body,
      property_id: propertyId
    });

    const service = new PropertyFloorPlanService(supabase);
    await service.bulkDelete(dto);

    return ApiResponse.noContent();
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
