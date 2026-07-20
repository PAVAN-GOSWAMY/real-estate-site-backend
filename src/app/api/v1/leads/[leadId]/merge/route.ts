import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { LeadService } from "@/modules/leads/service/lead.service";
import { createClient } from "@/lib/supabase/server";
import { mergeLeadSchema } from "@/modules/leads/validators/lead.validator";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> } // primary_lead_id
) {
  try {
    const { leadId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEADS.MERGE);

    const body = await req.json();
    const dto = mergeLeadSchema.parse({ ...body, primary_lead_id: id });

    const service = new LeadService(supabase);
    const merged = await service.mergeLeads(dto);

    return ApiResponse.success(merged, "Leads merged successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
