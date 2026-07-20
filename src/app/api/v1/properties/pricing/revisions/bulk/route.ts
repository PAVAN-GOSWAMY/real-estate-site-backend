import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyPricingService } from "@/modules/property-pricing/service/property-pricing.service";
import { createClient } from "@/lib/supabase/server";
import { bulkCreatePricingRevisionSchema } from "@/modules/property-pricing/validators/property-pricing.validator";

export async function POST(
  req: NextRequest
) {
  try {
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.PRICING.REVISE);

    const body = await req.json();
    const dto = bulkCreatePricingRevisionSchema.parse(body);

    const service = new PropertyPricingService(supabase);
    const response = await service.bulkRevise(dto);

    return ApiResponse.success(response, "Bulk pricing revisions created");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
