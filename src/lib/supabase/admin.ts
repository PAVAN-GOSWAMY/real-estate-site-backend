import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY is not defined. Falling back to ANON key, which will fail RLS policies on secure inserts.");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
