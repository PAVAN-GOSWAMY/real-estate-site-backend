import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyFeatureService } from "@/modules/property-features/service/property-feature.service";
import { createClient } from "@/lib/supabase/server";
import { 
  bulkAssignPropertyFeaturesSchema,
  bulkUpdatePropertyFeaturesSchema,
  bulkDeletePropertyFeaturesSchema
} from "@/modules/property-features/validators/property-feature.validator";
import { PropertyFeatureMapper } from "@/modules/property-features/mapper/property-feature.mapper";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_FEATURES.CREATE);

    const body = await req.json();
    const dto = bulkAssignPropertyFeaturesSchema.parse({
      ...body,
      property_id: propertyId
    });

    const service = new PropertyFeatureService(supabase);
    const results = await service.bulkAssignFeatures(dto);

    const mappedData = PropertyFeatureMapper.toResponseList(results);
    return ApiResponse.success(mappedData, "Features bulk assigned successfully", 201);
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
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_FEATURES.UPDATE);

    const body = await req.json();
    const dto = bulkUpdatePropertyFeaturesSchema.parse({
      ...body,
      property_id: propertyId
    });

    const service = new PropertyFeatureService(supabase);
    const results = await service.bulkUpdateFeatures(dto);

    const mappedData = PropertyFeatureMapper.toResponseList(results);
    return ApiResponse.success(mappedData, "Features bulk updated successfully");
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
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_FEATURES.DELETE);

    const body = await req.json();
    const dto = bulkDeletePropertyFeaturesSchema.parse({
      ...body,
      property_id: propertyId
    });

    const service = new PropertyFeatureService(supabase);
    await service.bulkRemoveFeatures(dto);

    return ApiResponse.noContent();
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
