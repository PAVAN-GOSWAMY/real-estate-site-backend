import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { FollowUpService } from "@/modules/lead-follow-ups/service/followup.service";
import { createClient } from "@/lib/supabase/server";
import { escalateFollowUpSchema } from "@/modules/lead-follow-ups/validators/followup.validator";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ leadFollowupId: string }> }
) {
  try {
    const { leadFollowupId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.FOLLOW_UPS.ESCALATE);

    const body = await req.json();
    const dto = escalateFollowUpSchema.parse(body);

    const service = new FollowUpService(supabase);
    const followup = await service.escalateFollowUp(id, dto);

    return ApiResponse.success(followup, "Follow-up escalated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
