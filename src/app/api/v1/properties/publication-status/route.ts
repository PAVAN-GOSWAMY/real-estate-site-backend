import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { PropertyPublicationService } from "@/modules/property-publications/service/property-publication.service";
import { createClient } from "@/lib/supabase/server";
import { publicationStatusQuerySchema } from "@/modules/property-publications/validators/property-publication.validator";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(
  req: NextRequest
) {
  try {
    const supabase = await createClient();
    const service = new PropertyPublicationService(supabase);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = publicationStatusQuerySchema.parse(searchParams);

    const { data, count } = await service.getPropertiesByStatus(query);
    const paginationMeta = calculatePagination(count, query.page, query.limit);

    return ApiResponse.paginated(data, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
