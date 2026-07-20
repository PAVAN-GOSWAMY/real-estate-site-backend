import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { StatusService } from "@/modules/lead-status/service/status.service";
import { createClient } from "@/lib/supabase/server";
import { changeStatusSchema } from "@/modules/lead-status/validators/status.validator";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEAD_STATUS.UPDATE);

    const body = await req.json();
    const dto = changeStatusSchema.parse(body);

    const service = new StatusService(supabase);
    const result = await service.changeStatus(leadId, dto, session.userId);

    return ApiResponse.success(result, "Lead status changed successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
