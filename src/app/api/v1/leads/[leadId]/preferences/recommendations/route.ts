import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PreferenceService } from "@/modules/lead-preferences/service/preference.service";
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
    PermissionHelper.requirePermission(session, Permissions.LEAD_PREFERENCES.VIEW);

    const service = new PreferenceService(supabase);
    const recommendations = await service.getRecommendations(leadId);

    return ApiResponse.success(recommendations, "Recommendation payload generated");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
