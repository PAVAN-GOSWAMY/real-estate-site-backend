import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { LocationService } from "@/modules/locations/service/location.service";
import { createClient } from "@/lib/supabase/server";
import { createLocationSchema, locationFilterSchema } from "@/modules/locations/validators/location.validator";
import { LocationMapper } from "@/modules/locations/mapper/location.mapper";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const service = new LocationService(supabase);

    // 1. Parse search params
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = locationFilterSchema.parse(searchParams);

    // 2. Fetch data
    const { data, count } = await service.listLocations(query);

    // 3. Format response
    const mappedData = LocationMapper.toResponseList(data);
    const paginationMeta = calculatePagination(count, query.page, query.limit);

    return ApiResponse.paginated(mappedData, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 1. Authentication & Authorization
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LOCATIONS.CREATE);

    // 2. Validate Body
    const body = await req.json();
    const dto = createLocationSchema.parse(body);

    // 3. Execute Business Logic
    const service = new LocationService(supabase);
    const location = await service.createLocation(dto);

    // 4. Format Response
    const mappedData = LocationMapper.toResponse(location);
    return ApiResponse.success(mappedData, "Location created successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
