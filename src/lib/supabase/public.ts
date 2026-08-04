import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

/**
 * Creates a public Supabase client without Next.js cookies/headers.
 * This should ONLY be used for public data fetching in Server Components
 * to avoid opting the entire page into Dynamic Rendering.
 */
export const createPublicClient = () => {
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
      }
    }
  );
};
