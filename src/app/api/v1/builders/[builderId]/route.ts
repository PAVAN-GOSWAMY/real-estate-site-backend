import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { BuilderService } from "@/modules/builders/service/builder.service";
import { createClient } from "@/lib/supabase/server";
import { updateBuilderSchema } from "@/modules/builders/validators/builder.validator";
import { BuilderMapper } from "@/modules/builders/mapper/builder.mapper";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ builderId: string }> }
) {
  try {
    const { builderId: id } = await params;
    const supabase = await createClient();
    const service = new BuilderService(supabase);

    const builder = await service.getBuilder(id);
    const mappedData = BuilderMapper.toResponse(builder);

    return ApiResponse.success(mappedData);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ builderId: string }> }
) {
  try {
    const { builderId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.BUILDERS.UPDATE);

    const body = await req.json();
    const dto = updateBuilderSchema.parse(body);

    const service = new BuilderService(supabase);
    const builder = await service.updateBuilder(id, dto);

    const mappedData = BuilderMapper.toResponse(builder);
    return ApiResponse.success(mappedData, "Builder updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ builderId: string }> }
) {
  try {
    const { builderId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.BUILDERS.DELETE);

    const service = new BuilderService(supabase);
    await service.deleteBuilder(id);

    return ApiResponse.noContent();
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
