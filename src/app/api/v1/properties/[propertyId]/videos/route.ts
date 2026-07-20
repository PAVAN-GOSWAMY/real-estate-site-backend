import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { PropertyVideoService } from "@/modules/property-videos/service/property-video.service";
import { createClient } from "@/lib/supabase/server";
import { propertyVideoFilterSchema } from "@/modules/property-videos/validators/property-video.validator";
import { PropertyVideoMapper } from "@/modules/property-videos/mapper/property-video.mapper";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const supabase = await createClient();
    const service = new PropertyVideoService(supabase);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = propertyVideoFilterSchema.parse({
      ...searchParams,
      property_id: propertyId
    });

    const { data, count } = await service.listVideos(query);
    const mappedData = PropertyVideoMapper.toCardList(data);
    const paginationMeta = calculatePagination(count, query.page, query.limit);

    return ApiResponse.paginated(mappedData, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
