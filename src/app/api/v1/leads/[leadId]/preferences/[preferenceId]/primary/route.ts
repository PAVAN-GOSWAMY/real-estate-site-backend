import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PreferenceService } from "@/modules/lead-preferences/service/preference.service";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string; preferenceId: string }> }
) {
  try {
    const { leadId, preferenceId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEAD_PREFERENCES.UPDATE);

    const service = new PreferenceService(supabase);
    const preference = await service.setPrimary(leadId, id);

    return ApiResponse.success(preference, "Primary preference updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
