import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { ShortlistService } from "@/modules/favorites/service/shortlist.service";
import { createClient } from "@/lib/supabase/server";
import { createShortlistSchema, shortlistQuerySchema } from "@/modules/favorites/validators/favorites.validator";
import { calculatePagination } from "@/lib/utils/pagination.util";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    if (!session.userId) throw new Error("Unauthorized");
    const userId = session.userId;

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = shortlistQuerySchema.parse({ ...searchParams, user_id: userId });

    const service = new ShortlistService(supabase);
    const { data, count } = await service.getShortlists(query);

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
    const dto = createShortlistSchema.parse(body);

    const service = new ShortlistService(supabase);
    const shortlist = await service.createShortlist(userId, dto);

    return ApiResponse.success(shortlist, "Shortlist created successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
