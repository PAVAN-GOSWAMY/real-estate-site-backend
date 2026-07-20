"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";

export function SupabaseTestClient() {
  const [status, setStatus] = React.useState("Checking...");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function checkConnection() {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          setStatus("Error");
          setError(error.message);
        } else {
          setStatus("Connected Successfully");
        }
      } catch (err: any) {
        setStatus("Exception Thrown");
        setError(err.message || "Unknown error occurred");
      }
    }

    checkConnection();
  }, []);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Browser Client (CSR)</h2>
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">Status</span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${status === 'Connected Successfully' ? 'bg-emerald-100 text-emerald-700' : status === 'Checking...' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
          {status}
        </span>
      </div>
      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}
    </div>
  );
}
