import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { NoteService } from "@/modules/lead-notes/service/note.service";
import { createClient } from "@/lib/supabase/server";
import { updateNoteSchema } from "@/modules/lead-notes/validators/note.validator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ leadNoteId: string }> }
) {
  try {
    const { leadNoteId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEAD_NOTES.VIEW);

    const service = new NoteService(supabase);
    const note = await service.getNote(id, session.userId);

    return ApiResponse.success(note);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ leadNoteId: string }> }
) {
  try {
    const { leadNoteId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEAD_NOTES.UPDATE);

    const body = await req.json();
    const dto = updateNoteSchema.parse(body);

    const service = new NoteService(supabase);
    const note = await service.updateNote(id, dto, session.userId);

    return ApiResponse.success(note, "Note updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ leadNoteId: string }> }
) {
  try {
    const { leadNoteId: id } = await params;
    const supabase = await createClient();
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.LEAD_NOTES.DELETE);

    const service = new NoteService(supabase);
    await service.deleteNote(id, session.userId);

    return ApiResponse.success(null, "Note deleted successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
