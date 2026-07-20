import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { PropertyComparisonService } from "@/modules/property-comparisons/service/property-comparisons.service";
import { createClient } from "@/lib/supabase/server";
import { PropertyComparisonMapper } from "@/modules/property-comparisons/mapper/property-comparisons.mapper";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const supabase = await createClient();
    
    const service = new PropertyComparisonService(supabase);
    const session = await service.getSession(sessionId);

    const mappedData = PropertyComparisonMapper.toSessionResponse(session);
    return ApiResponse.success(mappedData);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const supabase = await createClient();
    
    const service = new PropertyComparisonService(supabase);
    await service.deleteSession(sessionId);

    return ApiResponse.success(null, "Comparison session deleted successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
