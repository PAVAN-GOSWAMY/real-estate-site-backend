import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PreferenceService } from "@/modules/lead-preferences/service/preference.service";
import { createClient } from "@/lib/supabase/server";
import { updatePreferenceSchema } from "@/modules/lead-preferences/validators/preference.validator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string; preferenceId: string }> }
) {
  try {
    const { leadId, preferenceId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEAD_PREFERENCES.VIEW);

    const service = new PreferenceService(supabase);
    const preference = await service.getPreference(leadId, id);

    return ApiResponse.success(preference);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string; preferenceId: string }> }
) {
  try {
    const { leadId, preferenceId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEAD_PREFERENCES.UPDATE);

    const body = await req.json();
    const dto = updatePreferenceSchema.parse(body);

    const service = new PreferenceService(supabase);
    const preference = await service.updatePreference(leadId, id, dto);

    return ApiResponse.success(preference, "Preference updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string; preferenceId: string }> }
) {
  try {
    const { leadId, preferenceId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEAD_PREFERENCES.DELETE);

    const service = new PreferenceService(supabase);
    await service.deletePreference(leadId, id);

    return ApiResponse.success(null, "Preference deleted successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
