import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { StatusService } from "@/modules/lead-status/service/status.service";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEAD_STATUS.PIPELINE);

    const service = new StatusService(supabase);
    const stats = await service.getStatistics();

    return ApiResponse.success(stats, "Pipeline statistics retrieved");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
