import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { PropertyFloorPlanService } from "@/modules/property-floor-plans/service/property-floor-plan.service";
import { createClient } from "@/lib/supabase/server";
import { propertyFloorPlanFilterSchema } from "@/modules/property-floor-plans/validators/property-floor-plan.validator";
import { PropertyFloorPlanMapper } from "@/modules/property-floor-plans/mapper/property-floor-plan.mapper";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const supabase = await createClient();
    const service = new PropertyFloorPlanService(supabase);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = propertyFloorPlanFilterSchema.parse({
      ...searchParams,
      property_id: propertyId
    });

    const { data, count } = await service.listFloorPlans(query);
    const mappedData = PropertyFloorPlanMapper.toCardList(data);
    const paginationMeta = calculatePagination(count, query.page, query.limit);

    return ApiResponse.paginated(mappedData, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
