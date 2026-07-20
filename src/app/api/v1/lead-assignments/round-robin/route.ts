import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { AssignmentService } from "@/modules/lead-assignments/service/assignment.service";
import { createClient } from "@/lib/supabase/server";
import { roundRobinAssignmentSchema } from "@/modules/lead-assignments/validators/assignment.validator";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEAD_ASSIGNMENTS.AUTO);

    const body = await req.json();
    const dto = roundRobinAssignmentSchema.parse(body);

    const service = new AssignmentService(supabase);
    const result = await service.roundRobinAssign(dto, session.userId);

    return ApiResponse.success(result, "Round Robin assignment completed successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
