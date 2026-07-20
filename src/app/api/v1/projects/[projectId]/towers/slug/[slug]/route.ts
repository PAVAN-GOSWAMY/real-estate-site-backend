import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { ProjectTowerService } from "@/modules/project-towers/service/project-tower.service";
import { createClient } from "@/lib/supabase/server";
import { ProjectTowerMapper } from "@/modules/project-towers/mapper/project-tower.mapper";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; slug: string }> }
) {
  try {
    const { projectId, slug } = await params;
    const supabase = await createClient();
    const service = new ProjectTowerService(supabase);

    const tower = await service.getTowerByProjectAndSlug(projectId, slug);
    const mappedData = ProjectTowerMapper.toResponse(tower);

    return ApiResponse.success(mappedData);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
