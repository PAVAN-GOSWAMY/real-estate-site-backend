import { createClient } from "@/lib/supabase/server";

export async function ensureAdminAuth() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized: Admin authentication required.");
  }

  return user;
}
