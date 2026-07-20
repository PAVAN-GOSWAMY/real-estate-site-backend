import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { ShortlistService } from "@/modules/favorites/service/shortlist.service";
import { createClient } from "@/lib/supabase/server";
import { updateShortlistSchema } from "@/modules/favorites/validators/favorites.validator";

export async function GET(
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

    const service = new ShortlistService(supabase);
    const shortlist = await service.getShortlist(userId, id);

    return ApiResponse.success(shortlist);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
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
    const dto = updateShortlistSchema.parse(body);

    const service = new ShortlistService(supabase);
    const shortlist = await service.updateShortlist(userId, id, dto);

    return ApiResponse.success(shortlist, "Shortlist updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
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

    const service = new ShortlistService(supabase);
    await service.deleteShortlist(userId, id);

    return ApiResponse.success(null, "Shortlist deleted successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
