import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyBrochureService } from "@/modules/property-brochures/service/property-brochure.service";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyBrochureId: string }> }
) {
  try {
    const { propertyBrochureId: id } = await params;
    const supabase = await createClient();
    
    // Note: Depending on business rules, we might allow public downloads
    // without requiring an explicit DOWNLOAD permission, but gating them
    // behind lead forms. Here we assume we validate the user can download.
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_BROCHURES.DOWNLOAD);

    const service = new PropertyBrochureService(supabase);
    
    // registerDownload will increment the DB counter and return the public URL
    const downloadUrl = await service.registerDownload(id);

    // We return a JSON response so the Next.js frontend can gracefully handle 
    // the download via JavaScript (e.g. window.location.href = url),
    // rather than forcing a strict HTTP 307 redirect here.
    return ApiResponse.success({ url: downloadUrl }, "Download registered");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
