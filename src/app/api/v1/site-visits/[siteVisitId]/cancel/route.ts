import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { VisitService } from "@/modules/site-visits/service/visit.service";
import { createClient } from "@/lib/supabase/server";
import { cancelSchema } from "@/modules/site-visits/validators/visit.validator";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ siteVisitId: string }> }
) {
  try {
    const { siteVisitId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.SITE_VISITS.UPDATE);

    const body = await req.json();
    const dto = cancelSchema.parse(body);

    const service = new VisitService(supabase);
    const result = await service.cancel(id, dto, session.userId);

    return ApiResponse.success(result, "Visit cancelled");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
