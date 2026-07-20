import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyCategoryService } from "@/modules/property-categories/service/property-category.service";
import { createClient } from "@/lib/supabase/server";
import { updatePropertyCategorySchema } from "@/modules/property-categories/validators/property-category.validator";
import { PropertyCategoryMapper } from "@/modules/property-categories/mapper/property-category.mapper";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId: id } = await params;
    const supabase = await createClient();
    const service = new PropertyCategoryService(supabase);

    const category = await service.getCategory(id);
    const mappedData = PropertyCategoryMapper.toResponse(category);

    return ApiResponse.success(mappedData);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_CATEGORIES.UPDATE);

    const body = await req.json();
    const dto = updatePropertyCategorySchema.parse(body);

    const service = new PropertyCategoryService(supabase);
    const category = await service.updateCategory(id, dto);

    const mappedData = PropertyCategoryMapper.toResponse(category);
    return ApiResponse.success(mappedData, "Category updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_CATEGORIES.DELETE);

    const service = new PropertyCategoryService(supabase);
    await service.deleteCategory(id);

    return ApiResponse.noContent();
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
