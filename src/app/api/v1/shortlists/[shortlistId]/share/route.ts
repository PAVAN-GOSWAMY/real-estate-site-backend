import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { ShortlistService } from "@/modules/favorites/service/shortlist.service";
import { createClient } from "@/lib/supabase/server";
import { shareShortlistSchema } from "@/modules/favorites/validators/favorites.validator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shortlistId: string }> }
) {
  try {
    const { shortlistId: id } = await params; // Here id is the share token
    const supabase = await createClient();
    
    // Auth is NOT required for viewing a shared shortlist if they have the token
    const service = new ShortlistService(supabase);
    const shortlist = await service.getSharedShortlist(id);

    return ApiResponse.success(shortlist);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

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

    const body = await req.json().catch(() => ({}));
    const dto = shareShortlistSchema.parse(body);

    const service = new ShortlistService(supabase);
    const link = await service.shareShortlist(userId, id, dto);

    return ApiResponse.success(link, "Shortlist share link generated");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
