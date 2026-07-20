import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { NoteService } from "@/modules/lead-notes/service/note.service";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ leadNoteId: string }> }
) {
  try {
    const { leadNoteId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEAD_NOTES.PIN);

    const service = new NoteService(supabase);
    const result = await service.setPinStatus(id, false, session.userId);

    return ApiResponse.success(result, "Note unpinned successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
