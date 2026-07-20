import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyService } from "@/modules/properties/service/property.service";
import { createClient } from "@/lib/supabase/server";
import { 
  bulkCreatePropertySchema,
  bulkUpdatePropertySchema,
  bulkDeletePropertySchema
} from "@/modules/properties/validators/property.validator";
import { PropertyMapper } from "@/modules/properties/mapper/property.mapper";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.CREATE);

    const body = await req.json();
    const dto = bulkCreatePropertySchema.parse(body);

    const service = new PropertyService(supabase);
    const results = await service.bulkCreateProperties(dto);

    const mappedData = PropertyMapper.toResponseList(results);
    return ApiResponse.success(mappedData, "Properties bulk created successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.UPDATE);

    const body = await req.json();
    const dto = bulkUpdatePropertySchema.parse(body);

    const service = new PropertyService(supabase);
    const results = await service.bulkUpdateProperties(dto);

    const mappedData = PropertyMapper.toResponseList(results);
    return ApiResponse.success(mappedData, "Properties bulk updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.DELETE);

    const body = await req.json();
    const dto = bulkDeletePropertySchema.parse(body);

    const service = new PropertyService(supabase);
    await service.bulkDeleteProperties(dto);

    return ApiResponse.noContent();
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
