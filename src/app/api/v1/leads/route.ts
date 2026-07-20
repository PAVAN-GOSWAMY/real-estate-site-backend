import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { LeadService } from "@/modules/leads/service/lead.service";
import { createClient } from "@/lib/supabase/server";
import { createLeadSchema, leadFilterSchema } from "@/modules/leads/validators/lead.validator";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEADS.VIEW);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = leadFilterSchema.parse(searchParams);

    const service = new LeadService(supabase);
    const { data, count } = await service.getLeads(query);

    const paginationMeta = calculatePagination(count, query.page, query.limit);
    return ApiResponse.paginated(data, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Auth might be optional if leads come from a public website form. 
    // In a real app we'd check API keys or verify the source.
    // For now, if we have a session, we capture the creator.
    const authHelper = new AuthHelper(supabase);
    let userId = null;
    try {
      const session = await authHelper.getSession();
      userId = session.userId;
    } catch (e) {
      // Ignored for public lead forms
    }

    const body = await req.json();
    const dto = createLeadSchema.parse(body);

    const service = new LeadService(supabase);
    // Cast to include created_by if available
    const lead = await service.createLead({ ...dto, created_by: userId } as any);

    return ApiResponse.success(lead, "Lead created successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
