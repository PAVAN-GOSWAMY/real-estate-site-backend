import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { ExportService } from "@/modules/bulk-operations/service/export.service";
import { createClient } from "@/lib/supabase/server";
import { createExportJobSchema } from "@/modules/bulk-operations/validators/bulk.validator";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.EXPORT);

    const body = await req.json().catch(() => ({}));
    const dto = createExportJobSchema.parse(body);

    const service = new ExportService(supabase);
    const job = await service.createExportJob(session.userId, dto);

    return ApiResponse.success(job, "Export job created and processing in background", 202);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
