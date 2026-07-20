import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { PropertyComparisonService } from "@/modules/property-comparisons/service/property-comparisons.service";
import { createClient } from "@/lib/supabase/server";
import { addPropertyToComparisonSchema } from "@/modules/property-comparisons/validators/property-comparisons.validator";
import { PropertyComparisonMapper } from "@/modules/property-comparisons/mapper/property-comparisons.mapper";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const supabase = await createClient();
    
    const body = await req.json();
    const dto = addPropertyToComparisonSchema.parse(body);

    const service = new PropertyComparisonService(supabase);
    const session = await service.addProperty(sessionId, dto);

    const mappedData = PropertyComparisonMapper.toSessionResponse(session);
    return ApiResponse.success(mappedData, "Property added to comparison successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
