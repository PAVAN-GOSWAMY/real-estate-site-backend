import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { LeadService } from "@/modules/leads/service/lead.service";
import { createClient } from "@/lib/supabase/server";
import { leadFilterSchema } from "@/modules/leads/validators/lead.validator";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ source: string }> }
) {
  try {
    const { source } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEADS.VIEW);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = leadFilterSchema.parse({ ...searchParams, source });

    const service = new LeadService(supabase);
    const { data, count } = await service.getLeads(query);

    const paginationMeta = calculatePagination(count, query.page, query.limit);
    return ApiResponse.paginated(data, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
