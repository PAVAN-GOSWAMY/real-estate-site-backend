import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { AmenityService } from "@/modules/amenities/service/amenity.service";
import { createClient } from "@/lib/supabase/server";
import { createAmenitySchema, amenityFilterSchema } from "@/modules/amenities/validators/amenity.validator";
import { AmenityMapper } from "@/modules/amenities/mapper/amenity.mapper";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const service = new AmenityService(supabase);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = amenityFilterSchema.parse(searchParams);

    const { data, count } = await service.listAmenities(query);

    const mappedData = AmenityMapper.toResponseList(data);
    const paginationMeta = calculatePagination(count, query.page, query.limit);

    return ApiResponse.paginated(mappedData, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.AMENITIES.CREATE);

    const body = await req.json();
    const dto = createAmenitySchema.parse(body);

    const service = new AmenityService(supabase);
    const amenity = await service.createAmenity(dto);

    const mappedData = AmenityMapper.toResponse(amenity);
    return ApiResponse.success(mappedData, "Amenity created successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
