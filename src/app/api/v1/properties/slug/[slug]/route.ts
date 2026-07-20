import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { PropertyService } from "@/modules/properties/service/property.service";
import { createClient } from "@/lib/supabase/server";
import { PropertyMapper } from "@/modules/properties/mapper/property.mapper";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();
    const service = new PropertyService(supabase);

    const property = await service.getPropertyBySlug(slug);
    const mappedData = PropertyMapper.toResponse(property);

    return ApiResponse.success(mappedData);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
