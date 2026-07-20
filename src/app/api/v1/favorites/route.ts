import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { FavoriteService } from "@/modules/favorites/service/favorite.service";
import { createClient } from "@/lib/supabase/server";
import { addFavoriteSchema, favoriteQuerySchema } from "@/modules/favorites/validators/favorites.validator";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    
    // Using simple auth check since this is a user-specific action
    // In CRM mode, they'd need Permissions.FAVORITES.VIEW
    if (!session.userId) throw new Error("Unauthorized");
    const userId = session.userId;

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = favoriteQuerySchema.parse({ ...searchParams, user_id: userId });

    const service = new FavoriteService(supabase);
    const { data, count } = await service.getFavorites(query);

    const paginationMeta = calculatePagination(count, query.page, query.limit);
    return ApiResponse.paginated(data, paginationMeta);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    if (!session.userId) throw new Error("Unauthorized");
    const userId = session.userId;

    const body = await req.json();
    const dto = addFavoriteSchema.parse(body);

    const service = new FavoriteService(supabase);
    await service.addFavorite(userId, dto);

    return ApiResponse.success(null, "Property added to favorites", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
