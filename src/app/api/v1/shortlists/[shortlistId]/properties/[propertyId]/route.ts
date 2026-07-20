import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { ShortlistService } from "@/modules/favorites/service/shortlist.service";
import { createClient } from "@/lib/supabase/server";
import { updateShortlistItemSchema } from "@/modules/favorites/validators/favorites.validator";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ shortlistId: string, propertyId: string }> }
) {
  try {
    const { shortlistId: id, propertyId } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    if (!session.userId) throw new Error("Unauthorized");
    const userId = session.userId;

    const body = await req.json();
    const dto = updateShortlistItemSchema.parse(body);

    const service = new ShortlistService(supabase);
    await service.updateProperty(userId, id, propertyId, dto);

    return ApiResponse.success(null, "Shortlist property metadata updated");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ shortlistId: string, propertyId: string }> }
) {
  try {
    const { shortlistId: id, propertyId } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    if (!session.userId) throw new Error("Unauthorized");
    const userId = session.userId;

    const service = new ShortlistService(supabase);
    await service.removeProperty(userId, id, propertyId);

    return ApiResponse.success(null, "Property removed from shortlist");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
