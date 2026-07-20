import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { VisitService } from "@/modules/site-visits/service/visit.service";
import { createClient } from "@/lib/supabase/server";
import { updateVisitSchema } from "@/modules/site-visits/validators/visit.validator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ siteVisitId: string }> }
) {
  try {
    const { siteVisitId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.SITE_VISITS.VIEW);

    const service = new VisitService(supabase);
    const visit = await service.getVisit(id);

    return ApiResponse.success(visit);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ siteVisitId: string }> }
) {
  try {
    const { siteVisitId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.SITE_VISITS.UPDATE);

    const body = await req.json();
    const dto = updateVisitSchema.parse(body);

    const service = new VisitService(supabase);
    const visit = await service.updateVisit(id, dto, session.userId);

    return ApiResponse.success(visit, "Visit updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ siteVisitId: string }> }
) {
  try {
    const { siteVisitId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.SITE_VISITS.DELETE);

    const service = new VisitService(supabase);
    await service.deleteVisit(id, session.userId);

    return ApiResponse.success(null, "Visit deleted successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
