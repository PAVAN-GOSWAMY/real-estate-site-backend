import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { DashboardService } from "@/modules/crm-dashboard/service/dashboard.service";
import { Roles } from "@/lib/constants/roles";
import { createClient } from "@/lib/supabase/server";
import { dashboardFilterSchema } from "@/modules/crm-dashboard/validators/dashboard.validator";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.CRM_DASHBOARD.VIEW);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const filters = dashboardFilterSchema.parse(searchParams);

    const service = new DashboardService(supabase);
    let data;

    // Smart Routing based on role (Mock logic)
    const userRole = session.role || Roles.SALES_EXECUTIVE; 

    if (userRole === Roles.SUPER_ADMIN || userRole === Roles.ADMIN) {
      data = await service.getAdminDashboard(filters, session.userId);
    } else if (userRole === Roles.SALES_MANAGER) {
      data = await service.getManagerDashboard(filters, session.userId);
    } else if (userRole === Roles.SALES_EXECUTIVE) {
      data = await service.getExecutiveDashboard(filters, session.userId);
    } else {
      data = await service.getSalesDashboard(filters, session.userId);
    }

    return ApiResponse.success(data);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
