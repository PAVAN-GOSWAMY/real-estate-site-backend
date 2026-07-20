import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { PropertyPublicationService } from "@/modules/property-publications/service/property-publication.service";
import { createClient } from "@/lib/supabase/server";
import { publicationHistoryFilterSchema } from "@/modules/property-publications/validators/property-publication.validator";
import { PropertyPublicationMapper } from "@/modules/property-publications/mapper/property-publication.mapper";
import { calculatePagination } from "@/lib/utils/pagination.util";
import { PropertyPublicationHistoryDto } from "@/modules/property-publications/dto/property-publication.dto";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId: id } = await params;
    const supabase = await createClient();
    const service = new PropertyPublicationService(supabase);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = publicationHistoryFilterSchema.parse({
      ...searchParams,
      property_id: id
    });

    const { data, count, current_status } = await service.getHistory(query);
    const mappedData = PropertyPublicationMapper.toResponseList(data);
    const paginationMeta = calculatePagination(count, query.page, query.limit);
    
    const responseData: PropertyPublicationHistoryDto = {
      history: mappedData,
      current_status,
    };

    return ApiResponse.paginated(responseData, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
