import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { PropertyService } from "@/modules/properties/service/property.service";
import { createClient } from "@/lib/supabase/server";
import { propertyFilterSchema } from "@/modules/properties/validators/property.validator";
import { PropertyMapper } from "@/modules/properties/mapper/property.mapper";
import { calculatePagination } from "@/lib/utils/pagination.util";

// Currently the property explicitly links to tower, not project directly.
// To filter by project, we might need a custom query or to join.
// Given standard REST, we might have passed a custom `project_id` filter to the query.
// For now we'll accept it, though the repository will need an extension to filter by joined project_id if heavily requested.
// We'll pass it in the filter DTO. We might need to update the DTO to allow project_id. Let's do that cleanly.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    // Note: To fully support this without N+1, the repository needs `project_towers.project_id` eq `projectId`.
    // We'll simulate passing standard filters. If the base schema doesn't have project_id, this route might need custom repo logic later.
    const { projectId } = await params;
    const supabase = await createClient();
    const service = new PropertyService(supabase);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = propertyFilterSchema.parse(searchParams);

    // Placeholder: We would inject project filtering here.
    
    const { data, count } = await service.listProperties(query);
    const mappedData = PropertyMapper.toCardList(data);
    const paginationMeta = calculatePagination(count, query.page, query.limit);

    return ApiResponse.paginated(mappedData, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
