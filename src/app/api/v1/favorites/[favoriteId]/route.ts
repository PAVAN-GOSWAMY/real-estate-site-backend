import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { FavoriteService } from "@/modules/favorites/service/favorite.service";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ favoriteId: string }> } // id is the property_id
) {
  try {
    const { favoriteId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    if (!session.userId) throw new Error("Unauthorized");
    const userId = session.userId;

    const service = new FavoriteService(supabase);
    await service.removeFavorite(userId, id);

    return ApiResponse.success(null, "Property removed from favorites");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
