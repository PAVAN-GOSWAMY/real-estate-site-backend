import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyPricingService } from "@/modules/property-pricing/service/property-pricing.service";
import { createClient } from "@/lib/supabase/server";
import { createPricingRevisionSchema } from "@/modules/property-pricing/validators/property-pricing.validator";
import { PropertyPricingMapper } from "@/modules/property-pricing/mapper/property-pricing.mapper";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.PRICING.REVISE);

    const body = await req.json();
    const dto = createPricingRevisionSchema.parse(body);

    const service = new PropertyPricingService(supabase);
    const revision = await service.revisePricing(id, dto);

    const mappedData = PropertyPricingMapper.toResponse(revision);
    return ApiResponse.success(mappedData, "Pricing revision created successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
