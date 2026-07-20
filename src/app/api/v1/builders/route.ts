import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { BuilderService } from "@/modules/builders/service/builder.service";
import { createClient } from "@/lib/supabase/server";
import { createBuilderSchema, builderFilterSchema } from "@/modules/builders/validators/builder.validator";
import { BuilderMapper } from "@/modules/builders/mapper/builder.mapper";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const service = new BuilderService(supabase);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = builderFilterSchema.parse(searchParams);

    const { data, count } = await service.listBuilders(query);

    const mappedData = BuilderMapper.toResponseList(data);
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
    PermissionHelper.requirePermission(session, Permissions.BUILDERS.CREATE);

    const body = await req.json();
    const dto = createBuilderSchema.parse(body);

    const service = new BuilderService(supabase);
    const builder = await service.createBuilder(dto);

    const mappedData = BuilderMapper.toResponse(builder);
    return ApiResponse.success(mappedData, "Builder created successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
