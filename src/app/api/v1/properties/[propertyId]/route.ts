import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyService } from "@/modules/properties/service/property.service";
import { createClient } from "@/lib/supabase/server";
import { updatePropertySchema } from "@/modules/properties/validators/property.validator";
import { PropertyMapper } from "@/modules/properties/mapper/property.mapper";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId: id } = await params;
    const supabase = await createClient();
    const service = new PropertyService(supabase);

    const property = await service.getProperty(id);
    const mappedData = PropertyMapper.toResponse(property);

    return ApiResponse.success(mappedData);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.UPDATE);

    const body = await req.json();
    const dto = updatePropertySchema.parse(body);

    const service = new PropertyService(supabase);
    const property = await service.updateProperty(id, dto);

    const mappedData = PropertyMapper.toResponse(property);
    return ApiResponse.success(mappedData, "Property unit updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.DELETE);

    const service = new PropertyService(supabase);
    await service.deleteProperty(id);

    return ApiResponse.noContent();
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
