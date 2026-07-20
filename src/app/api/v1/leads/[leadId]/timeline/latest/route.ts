import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { TimelineService } from "@/modules/lead-timeline/service/timeline.service";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEAD_TIMELINE.VIEW);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const limit = searchParams.limit ? parseInt(searchParams.limit) : 5;

    const service = new TimelineService(supabase);
    const data = await service.getLatestEvents(leadId, limit);

    return ApiResponse.success({ events: data });
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
