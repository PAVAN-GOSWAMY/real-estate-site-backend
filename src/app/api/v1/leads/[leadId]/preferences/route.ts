import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PreferenceService } from "@/modules/lead-preferences/service/preference.service";
import { createClient } from "@/lib/supabase/server";
import { preferenceFilterSchema, createPreferenceSchema } from "@/modules/lead-preferences/validators/preference.validator";
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
    PermissionHelper.requirePermission(session, Permissions.LEAD_PREFERENCES.VIEW);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = preferenceFilterSchema.parse(searchParams);

    const service = new PreferenceService(supabase);
    const { data, count } = await service.getPreferences(leadId, query);

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
    PermissionHelper.requirePermission(session, Permissions.LEAD_PREFERENCES.CREATE);

    const body = await req.json();
    const dto = createPreferenceSchema.parse(body);

    const service = new PreferenceService(supabase);
    const preference = await service.createPreference(leadId, dto);

    return ApiResponse.success(preference, "Preference created successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
