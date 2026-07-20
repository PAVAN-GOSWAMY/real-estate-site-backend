import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyFeatureService } from "@/modules/property-features/service/property-feature.service";
import { createClient } from "@/lib/supabase/server";
import { assignPropertyFeatureSchema, propertyFeatureFilterSchema } from "@/modules/property-features/validators/property-feature.validator";
import { PropertyFeatureMapper } from "@/modules/property-features/mapper/property-feature.mapper";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const supabase = await createClient();
    const service = new PropertyFeatureService(supabase);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = propertyFeatureFilterSchema.parse({
      ...searchParams,
      property_id: propertyId
    });

    const { data, count } = await service.listAssignments(query);

    const mappedData = PropertyFeatureMapper.toResponseList(data);
    const paginationMeta = calculatePagination(count, query.page, query.limit);

    return ApiResponse.paginated(mappedData, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

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
    const dto = assignPropertyFeatureSchema.parse({
      ...body,
      property_id: propertyId
    });

    const service = new PropertyFeatureService(supabase);
    const assignment = await service.assignFeature(dto);

    const mappedData = PropertyFeatureMapper.toResponse(assignment);
    return ApiResponse.success(mappedData, "Feature assigned to property successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
