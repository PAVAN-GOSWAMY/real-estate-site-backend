import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { PropertyBrochureService } from "@/modules/property-brochures/service/property-brochure.service";
import { createClient } from "@/lib/supabase/server";
import { propertyBrochureFilterSchema } from "@/modules/property-brochures/validators/property-brochure.validator";
import { PropertyBrochureMapper } from "@/modules/property-brochures/mapper/property-brochure.mapper";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const supabase = await createClient();
    const service = new PropertyBrochureService(supabase);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = propertyBrochureFilterSchema.parse({
      ...searchParams,
      property_id: propertyId
    });

    const { data, count } = await service.listBrochures(query);
    const mappedData = PropertyBrochureMapper.toCardList(data);
    const paginationMeta = calculatePagination(count, query.page, query.limit);

    return ApiResponse.paginated(mappedData, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
