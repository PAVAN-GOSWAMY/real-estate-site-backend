import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { ProjectTowerService } from "@/modules/project-towers/service/project-tower.service";
import { createClient } from "@/lib/supabase/server";
import { projectTowerFilterSchema } from "@/modules/project-towers/validators/project-tower.validator";
import { ProjectTowerMapper } from "@/modules/project-towers/mapper/project-tower.mapper";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const supabase = await createClient();
    const service = new ProjectTowerService(supabase);

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    
    // Force the project_id from the URL into the query payload to ensure we only get towers for this project
    const query = projectTowerFilterSchema.parse({
      ...searchParams,
      project_id: projectId
    });

    const { data, count } = await service.listTowers(query);

    const mappedData = ProjectTowerMapper.toResponseList(data);
    const paginationMeta = calculatePagination(count, query.page, query.limit);

    return ApiResponse.paginated(mappedData, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
