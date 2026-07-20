import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyCategoryService } from "@/modules/property-categories/service/property-category.service";
import { createClient } from "@/lib/supabase/server";
import { createPropertyCategorySchema, propertyCategoryFilterSchema } from "@/modules/property-categories/validators/property-category.validator";
import { PropertyCategoryMapper } from "@/modules/property-categories/mapper/property-category.mapper";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const service = new PropertyCategoryService(supabase);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = propertyCategoryFilterSchema.parse(searchParams);

    const { data, count } = await service.listCategories(query);

    const mappedData = PropertyCategoryMapper.toResponseList(data);
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
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_CATEGORIES.CREATE);

    const body = await req.json();
    const dto = createPropertyCategorySchema.parse(body);

    const service = new PropertyCategoryService(supabase);
    const category = await service.createCategory(dto);

    const mappedData = PropertyCategoryMapper.toResponse(category);
    return ApiResponse.success(mappedData, "Category created successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
