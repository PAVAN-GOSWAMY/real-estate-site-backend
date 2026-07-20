import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { FollowUpService } from "@/modules/lead-follow-ups/service/followup.service";
import { createClient } from "@/lib/supabase/server";
import { followUpFilterSchema, createFollowUpSchema } from "@/modules/lead-follow-ups/validators/followup.validator";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.FOLLOW_UPS.VIEW);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = followUpFilterSchema.parse({ ...searchParams, lead_id: leadId });

    const service = new FollowUpService(supabase);
    const { data, count } = await service.getFollowUps(query);

    const paginationMeta = calculatePagination(count, query.page, query.limit);
    return ApiResponse.paginated(data, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.FOLLOW_UPS.CREATE);

    const body = await req.json();
    const dto = createFollowUpSchema.parse({ ...body, lead_id: leadId });

    const service = new FollowUpService(supabase);
    const followup = await service.createFollowUp(dto, session.userId);

    return ApiResponse.success(followup, "Follow-up created successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
