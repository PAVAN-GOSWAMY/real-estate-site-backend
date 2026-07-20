import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyService } from "@/modules/properties/service/property.service";
import { createClient } from "@/lib/supabase/server";
import { createPropertySchema, propertyFilterSchema } from "@/modules/properties/validators/property.validator";
import { PropertyMapper } from "@/modules/properties/mapper/property.mapper";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const service = new PropertyService(supabase);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = propertyFilterSchema.parse(searchParams);

    const { data, count } = await service.listProperties(query);
    const mappedData = PropertyMapper.toCardList(data);
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
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.CREATE);

    const body = await req.json();
    const dto = createPropertySchema.parse(body);

    const service = new PropertyService(supabase);
    const property = await service.createProperty(dto);

    const mappedData = PropertyMapper.toResponse(property);
    return ApiResponse.success(mappedData, "Property unit created successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
