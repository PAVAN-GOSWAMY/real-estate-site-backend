import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { AssignmentService } from "@/modules/lead-assignments/service/assignment.service";
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
    PermissionHelper.requirePermission(session, Permissions.LEAD_ASSIGNMENTS.VIEW);

    const service = new AssignmentService(supabase);
    const history = await service.getAssignmentHistory(leadId);

    return ApiResponse.success(history);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
