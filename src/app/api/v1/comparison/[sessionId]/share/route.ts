import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { PropertyComparisonService } from "@/modules/property-comparisons/service/property-comparisons.service";
import { createClient } from "@/lib/supabase/server";
import { shareComparisonSchema } from "@/modules/property-comparisons/validators/property-comparisons.validator";
import { PropertyComparisonMapper } from "@/modules/property-comparisons/mapper/property-comparisons.mapper";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const supabase = await createClient();
    
    const service = new PropertyComparisonService(supabase);
    // In this route, the sessionId from the URL is actually the Share Token
    // We fetch the session by token
    const session = await service.getSessionByToken(sessionId);

    const mappedData = PropertyComparisonMapper.toSessionResponse(session);
    return ApiResponse.success(mappedData);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const supabase = await createClient();
    
    const body = await req.json().catch(() => ({}));
    const dto = shareComparisonSchema.parse(body);

    const service = new PropertyComparisonService(supabase);
    const result = await service.generateShareLink(sessionId, dto);

    return ApiResponse.success(result, "Comparison share link generated");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
