import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { TimelineService } from "@/modules/lead-timeline/service/timeline.service";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEAD_TIMELINE.STATISTICS);

    const service = new TimelineService(supabase);
    const stats = await service.getStatistics();

    return ApiResponse.success(stats);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
