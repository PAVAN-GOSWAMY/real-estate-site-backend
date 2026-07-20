# Supabase Client Implementations

This directory contains the Supabase client initializers for the Square AR Spaces platform, configured specifically for Next.js 15 (App Router).

We utilize `@supabase/ssr` to securely manage cookies and sessions across Server and Client Components.

## Files

- `client.ts`: Used exclusively in Client Components (`"use client"`). Uses the browser's context to initialize the Supabase client.
- `server.ts`: Used exclusively in Server Components, Server Actions, and Route Handlers. Automatically securely extracts and sets HttpOnly cookies via `next/headers`.

## Usage Examples

### Client Component
```tsx
"use client";
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [data, setData] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('properties').select();
      setData(data);
    }
    load();
  }, []);
  
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

### Server Component / Server Action
```tsx
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from('properties').select();
  
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```
