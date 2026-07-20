import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { PropertyComparisonService } from "@/modules/property-comparisons/service/property-comparisons.service";
import { createClient } from "@/lib/supabase/server";
import { replaceComparisonPropertySchema } from "@/modules/property-comparisons/validators/property-comparisons.validator";
import { PropertyComparisonMapper } from "@/modules/property-comparisons/mapper/property-comparisons.mapper";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string, propertyId: string }> }
) {
  try {
    const { sessionId, propertyId } = await params;
    const supabase = await createClient();
    
    const service = new PropertyComparisonService(supabase);
    const session = await service.removeProperty(sessionId, propertyId);

    const mappedData = PropertyComparisonMapper.toSessionResponse(session);
    return ApiResponse.success(mappedData, "Property removed from comparison");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string, propertyId: string }> }
) {
  try {
    const { sessionId, propertyId } = await params;
    const supabase = await createClient();
    
    const body = await req.json();
    const dto = replaceComparisonPropertySchema.parse(body);

    const service = new PropertyComparisonService(supabase);
    const session = await service.replaceProperty(sessionId, propertyId, dto);

    const mappedData = PropertyComparisonMapper.toSessionResponse(session);
    return ApiResponse.success(mappedData, "Property replaced in comparison");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
