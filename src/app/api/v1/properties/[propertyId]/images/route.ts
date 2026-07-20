import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { PropertyImageService } from "@/modules/property-images/service/property-image.service";
import { createClient } from "@/lib/supabase/server";
import { propertyImageFilterSchema } from "@/modules/property-images/validators/property-image.validator";
import { PropertyImageMapper } from "@/modules/property-images/mapper/property-image.mapper";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const supabase = await createClient();
    const service = new PropertyImageService(supabase);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = propertyImageFilterSchema.parse({
      ...searchParams,
      property_id: propertyId
    });

    const { data, count } = await service.listImages(query);
    const mappedData = PropertyImageMapper.toCardList(data);
    const paginationMeta = calculatePagination(count, query.page, query.limit);

    return ApiResponse.paginated(mappedData, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
