import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { PropertyRecommendationService } from "@/modules/property-recommendations/service/property-recommendations.service";
import { createClient } from "@/lib/supabase/server";
import { recommendationQuerySchema } from "@/modules/property-recommendations/validators/property-recommendations.validator";
import { PropertyRecommendationMapper } from "@/modules/property-recommendations/mapper/property-recommendations.mapper";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = recommendationQuerySchema.parse(searchParams);

    const service = new PropertyRecommendationService(supabase);
    const { data, count } = await service.getFeatured(query);

    const mappedData = PropertyRecommendationMapper.toResponseList(data);
    const paginationMeta = calculatePagination(count, query.page, query.limit);

    return ApiResponse.paginated(mappedData, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
