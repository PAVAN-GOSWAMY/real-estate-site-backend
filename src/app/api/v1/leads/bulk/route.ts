import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { LeadService } from "@/modules/leads/service/lead.service";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEADS.CREATE);

    const body = await req.json();
    if (!Array.isArray(body)) {
      throw new Error("Bulk creation requires an array of leads");
    }

    const service = new LeadService(supabase);
    // Passing directly for this phase to support bulk upload. In reality, Zod array schema validation should be used.
    // The service layer might loop and run validations.
    const result = await service.bulkCreateLeads(body, session.userId);

    return ApiResponse.success(result, "Bulk leads processed successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEADS.UPDATE);

    const body = await req.json();
    if (!Array.isArray(body)) {
      throw new Error("Bulk update requires an array of updates");
    }

    const service = new LeadService(supabase);
    const result = await service.bulkUpdateLeads(body);

    return ApiResponse.success(result, "Bulk leads updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEADS.DELETE);

    const body = await req.json();
    if (!body.ids || !Array.isArray(body.ids)) {
      throw new Error("Bulk delete requires an array of ids");
    }

    const service = new LeadService(supabase);
    await service.bulkDeleteLeads(body.ids);

    return ApiResponse.success(null, "Bulk leads deleted successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
