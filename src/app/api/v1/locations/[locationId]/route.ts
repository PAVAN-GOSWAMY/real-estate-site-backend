import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { LocationService } from "@/modules/locations/service/location.service";
import { createClient } from "@/lib/supabase/server";
import { updateLocationSchema } from "@/modules/locations/validators/location.validator";
import { LocationMapper } from "@/modules/locations/mapper/location.mapper";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ locationId: string }> }
) {
  try {
    const { locationId: id } = await params;
    const supabase = await createClient();
    const service = new LocationService(supabase);

    const location = await service.getLocation(id);
    const mappedData = LocationMapper.toResponse(location);

    return ApiResponse.success(mappedData);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ locationId: string }> }
) {
  try {
    const { locationId: id } = await params;
    const supabase = await createClient();
    
    // 1. Authentication & Authorization
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LOCATIONS.UPDATE);

    // 2. Validate Body
    const body = await req.json();
    const dto = updateLocationSchema.parse(body);

    // 3. Execute Business Logic
    const service = new LocationService(supabase);
    const location = await service.updateLocation(id, dto);

    // 4. Format Response
    const mappedData = LocationMapper.toResponse(location);
    return ApiResponse.success(mappedData, "Location updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ locationId: string }> }
) {
  try {
    const { locationId: id } = await params;
    const supabase = await createClient();
    
    // 1. Authentication & Authorization
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LOCATIONS.DELETE);

    // 2. Execute Business Logic
    const service = new LocationService(supabase);
    await service.deleteLocation(id);

    // 3. Format Response
    return ApiResponse.noContent();
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
