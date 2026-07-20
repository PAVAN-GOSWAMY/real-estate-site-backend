import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { DashboardService } from "@/modules/crm-dashboard/service/dashboard.service";
import { createClient } from "@/lib/supabase/server";
import { dashboardFilterSchema } from "@/modules/crm-dashboard/validators/dashboard.validator";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.CRM_DASHBOARD.EXECUTIVE);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const filters = dashboardFilterSchema.parse(searchParams);

    const service = new DashboardService(supabase);
    const data = await service.getExecutiveDashboard(filters, session.userId);

    return ApiResponse.success(data);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
