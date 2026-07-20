import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { ImportService } from "@/modules/bulk-operations/service/import.service";
import { createClient } from "@/lib/supabase/server";
import { createImportJobSchema } from "@/modules/bulk-operations/validators/bulk.validator";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.IMPORT);
    
    // The payload represents the parsed JSON of the uploaded CSV/Excel
    const body = await req.json();
    const dto = createImportJobSchema.parse(body);

    const service = new ImportService(supabase);
    const job = await service.previewImport(session.userId, dto);

    return ApiResponse.success(job, "Import job validated and staged for preview", 202);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
