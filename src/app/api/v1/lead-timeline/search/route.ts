import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { TimelineService } from "@/modules/lead-timeline/service/timeline.service";
import { createClient } from "@/lib/supabase/server";
import { timelineSearchSchema } from "@/modules/lead-timeline/validators/timeline.validator";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEAD_TIMELINE.SEARCH);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = timelineSearchSchema.parse(searchParams);

    const service = new TimelineService(supabase);
    const { data, count } = await service.searchTimeline(query);

    const paginationMeta = calculatePagination(count, query.page, query.limit);
    return ApiResponse.paginated(data, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
