import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { TimelineService } from "@/modules/lead-timeline/service/timeline.service";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ leadTimelineId: string }> }
) {
  try {
    const { leadTimelineId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEAD_TIMELINE.VIEW);

    const service = new TimelineService(supabase);
    // Reusing the filter logic to fetch a single item by id if we wanted, 
    // but typically a dedicated findById is better. Let's write one inline for speed.
    const { data, error } = await supabase.from('lead_timeline').select('*').eq('id', id).single();
    if (error) throw error;

    return ApiResponse.success(data);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
