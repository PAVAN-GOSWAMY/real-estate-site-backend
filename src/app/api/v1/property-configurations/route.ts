import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyConfigurationService } from "@/modules/property-configurations/service/property-configuration.service";
import { createClient } from "@/lib/supabase/server";
import { createPropertyConfigurationSchema, propertyConfigurationFilterSchema } from "@/modules/property-configurations/validators/property-configuration.validator";
import { PropertyConfigurationMapper } from "@/modules/property-configurations/mapper/property-configuration.mapper";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const service = new PropertyConfigurationService(supabase);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = propertyConfigurationFilterSchema.parse(searchParams);

    const { data, count } = await service.listConfigurations(query);

    const mappedData = PropertyConfigurationMapper.toResponseList(data);
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
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_CONFIGURATIONS.CREATE);

    const body = await req.json();
    const dto = createPropertyConfigurationSchema.parse(body);

    const service = new PropertyConfigurationService(supabase);
    const configuration = await service.createConfiguration(dto);

    const mappedData = PropertyConfigurationMapper.toResponse(configuration);
    return ApiResponse.success(mappedData, "Configuration created successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
