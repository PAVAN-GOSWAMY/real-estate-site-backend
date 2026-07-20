import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { LeadService } from "@/modules/leads/service/lead.service";
import { createClient } from "@/lib/supabase/server";
import { updateLeadSchema } from "@/modules/leads/validators/lead.validator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEADS.VIEW);

    const service = new LeadService(supabase);
    const lead = await service.getLead(id);

    return ApiResponse.success(lead);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEADS.UPDATE);

    const body = await req.json();
    const dto = updateLeadSchema.parse(body);

    const service = new LeadService(supabase);
    const lead = await service.updateLead(id, dto);

    return ApiResponse.success(lead, "Lead updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEADS.DELETE);

    const service = new LeadService(supabase);
    await service.deleteLead(id);

    return ApiResponse.success(null, "Lead deleted successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
