import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyConfigurationService } from "@/modules/property-configurations/service/property-configuration.service";
import { createClient } from "@/lib/supabase/server";
import { updatePropertyConfigurationSchema } from "@/modules/property-configurations/validators/property-configuration.validator";
import { PropertyConfigurationMapper } from "@/modules/property-configurations/mapper/property-configuration.mapper";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyConfigurationId: string }> }
) {
  try {
    const { propertyConfigurationId: id } = await params;
    const supabase = await createClient();
    const service = new PropertyConfigurationService(supabase);

    const configuration = await service.getConfiguration(id);
    const mappedData = PropertyConfigurationMapper.toResponse(configuration);

    return ApiResponse.success(mappedData);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ propertyConfigurationId: string }> }
) {
  try {
    const { propertyConfigurationId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_CONFIGURATIONS.UPDATE);

    const body = await req.json();
    const dto = updatePropertyConfigurationSchema.parse(body);

    const service = new PropertyConfigurationService(supabase);
    const configuration = await service.updateConfiguration(id, dto);

    const mappedData = PropertyConfigurationMapper.toResponse(configuration);
    return ApiResponse.success(mappedData, "Configuration updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ propertyConfigurationId: string }> }
) {
  try {
    const { propertyConfigurationId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_CONFIGURATIONS.DELETE);

    const service = new PropertyConfigurationService(supabase);
    await service.deleteConfiguration(id);

    return ApiResponse.noContent();
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
