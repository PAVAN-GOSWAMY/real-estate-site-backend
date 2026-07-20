import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { FollowUpService } from "@/modules/lead-follow-ups/service/followup.service";
import { createClient } from "@/lib/supabase/server";
import { updateFollowUpSchema } from "@/modules/lead-follow-ups/validators/followup.validator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ leadFollowupId: string }> }
) {
  try {
    const { leadFollowupId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.FOLLOW_UPS.VIEW);

    const service = new FollowUpService(supabase);
    const followup = await service.getFollowUp(id);

    return ApiResponse.success(followup);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ leadFollowupId: string }> }
) {
  try {
    const { leadFollowupId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.FOLLOW_UPS.UPDATE);

    const body = await req.json();
    const dto = updateFollowUpSchema.parse(body);

    const service = new FollowUpService(supabase);
    const followup = await service.updateFollowUp(id, dto);

    return ApiResponse.success(followup, "Follow-up updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ leadFollowupId: string }> }
) {
  try {
    const { leadFollowupId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.FOLLOW_UPS.DELETE);

    const service = new FollowUpService(supabase);
    await service.deleteFollowUp(id);

    return ApiResponse.success(null, "Follow-up deleted successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
