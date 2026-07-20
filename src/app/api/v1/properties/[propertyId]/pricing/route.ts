import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyPricingService } from "@/modules/property-pricing/service/property-pricing.service";
import { createClient } from "@/lib/supabase/server";
import { updatePricingSchema } from "@/modules/property-pricing/validators/property-pricing.validator";
import { PropertyPricingMapper } from "@/modules/property-pricing/mapper/property-pricing.mapper";
import { NotFoundError } from "@/lib/errors/domain.error";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.PRICING.VIEW);

    const service = new PropertyPricingService(supabase);
    const pricing = await service.getCurrentPricing(id);
    
    if (!pricing) {
      return ApiResponse.error(new NotFoundError("No active pricing revision found for this property."));
    }

    const mappedData = PropertyPricingMapper.toResponse(pricing);
    return ApiResponse.success(mappedData);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId: id } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTIES.PRICING.UPDATE);

    const body = await req.json();
    const dto = updatePricingSchema.parse(body);

    const service = new PropertyPricingService(supabase);
    const revision = await service.directUpdatePricing(id, dto);

    const mappedData = PropertyPricingMapper.toResponse(revision);
    return ApiResponse.success(mappedData, "Pricing updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
