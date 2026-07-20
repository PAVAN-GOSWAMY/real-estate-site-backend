import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { ShortlistService } from "@/modules/favorites/service/shortlist.service";
import { createClient } from "@/lib/supabase/server";
import { addShortlistItemSchema } from "@/modules/favorites/validators/favorites.validator";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ shortlistId: string }> }
) {
  try {
    const { shortlistId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    if (!session.userId) throw new Error("Unauthorized");
    const userId = session.userId;

    const body = await req.json();
    const dto = addShortlistItemSchema.parse(body);

    const service = new ShortlistService(supabase);
    await service.addProperty(userId, id, dto);

    return ApiResponse.success(null, "Property added to shortlist", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
