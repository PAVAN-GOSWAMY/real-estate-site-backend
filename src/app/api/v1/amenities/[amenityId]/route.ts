import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { AmenityService } from "@/modules/amenities/service/amenity.service";
import { createClient } from "@/lib/supabase/server";
import { updateAmenitySchema } from "@/modules/amenities/validators/amenity.validator";
import { AmenityMapper } from "@/modules/amenities/mapper/amenity.mapper";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ amenityId: string }> }
) {
  try {
    const { amenityId: id } = await params;
    const supabase = await createClient();
    const service = new AmenityService(supabase);

    const amenity = await service.getAmenity(id);
    const mappedData = AmenityMapper.toResponse(amenity);

    return ApiResponse.success(mappedData);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ amenityId: string }> }
) {
  try {
    const { amenityId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.AMENITIES.UPDATE);

    const body = await req.json();
    const dto = updateAmenitySchema.parse(body);

    const service = new AmenityService(supabase);
    const amenity = await service.updateAmenity(id, dto);

    const mappedData = AmenityMapper.toResponse(amenity);
    return ApiResponse.success(mappedData, "Amenity updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ amenityId: string }> }
) {
  try {
    const { amenityId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.AMENITIES.DELETE);

    const service = new AmenityService(supabase);
    await service.deleteAmenity(id);

    return ApiResponse.noContent();
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
