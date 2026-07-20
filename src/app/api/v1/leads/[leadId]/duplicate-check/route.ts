import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { LeadService } from "@/modules/leads/service/lead.service";
import { createClient } from "@/lib/supabase/server";
import { duplicateCheckSchema } from "@/modules/leads/validators/lead.validator";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEADS.VIEW); // Only need VIEW to check dupes

    const body = await req.json();
    const dto = duplicateCheckSchema.parse(body);

    const service = new LeadService(supabase);
    const result = await service.checkDuplicates(dto);
    
    // We filter out the current lead ID from duplicates if they match
    result.duplicates = result.duplicates.filter(d => d.id !== id);
    result.has_duplicates = result.duplicates.length > 0;

    return ApiResponse.success(result, "Duplicate check completed");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
