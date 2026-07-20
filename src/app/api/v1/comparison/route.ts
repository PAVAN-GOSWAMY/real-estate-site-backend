import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { PropertyComparisonService } from "@/modules/property-comparisons/service/property-comparisons.service";
import { createClient } from "@/lib/supabase/server";
import { createComparisonSessionSchema } from "@/modules/property-comparisons/validators/property-comparisons.validator";
import { PropertyComparisonMapper } from "@/modules/property-comparisons/mapper/property-comparisons.mapper";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Auth is optional for creating comparisons (guest cart)
    const body = await req.json().catch(() => ({}));
    const dto = createComparisonSessionSchema.parse(body);

    const service = new PropertyComparisonService(supabase);
    const session = await service.createSession(dto);

    const mappedData = PropertyComparisonMapper.toSessionResponse(session);
    return ApiResponse.success(mappedData, "Comparison session created successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
