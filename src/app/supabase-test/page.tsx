import { createClient as createServerClient } from "@/lib/supabase/server";
import { SupabaseTestClient } from "./client-test";

export const dynamic = "force-dynamic";

export default async function SupabaseTestPage() {
  const supabase = await createServerClient();
  
  let serverStatus = "Checking...";
  let serverError = null;

  try {
    // Attempt a basic health check or config read (we won't query a table since none exist)
    const { error } = await supabase.auth.getSession();
    if (error) {
      serverStatus = "Error";
      serverError = error.message;
    } else {
      serverStatus = "Connected Successfully";
    }
  } catch (err: any) {
    serverStatus = "Exception Thrown";
    serverError = err.message;
  }

  return (
    <div className="min-h-screen p-12 bg-gray-50 flex flex-col items-center justify-center font-sans">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-slate-900 px-8 py-6">
          <h1 className="text-2xl font-bold text-white">Supabase Connection Verification</h1>
          <p className="text-slate-400 text-sm mt-1">Backend Phase 2.2 Validation</p>
        </div>
        
        <div className="p-8 space-y-8">
          {/* Environment Variables */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Environment Variables</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="block text-xs font-medium text-slate-500 uppercase mb-1">URL Configured</span>
                <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? "text-emerald-600 font-medium" : "text-red-500 font-medium"}>
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Yes" : "❌ No"}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="block text-xs font-medium text-slate-500 uppercase mb-1">Anon Key Configured</span>
                <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "text-emerald-600 font-medium" : "text-red-500 font-medium"}>
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Yes" : "❌ No"}
                </span>
              </div>
            </div>
          </div>

          {/* Server Client */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Server Client (SSR)</h2>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${serverStatus === 'Connected Successfully' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {serverStatus}
              </span>
            </div>
            {serverError && (
              <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {serverError}
              </div>
            )}
          </div>

          {/* Browser Client Component */}
          <SupabaseTestClient />
        </div>
      </div>
    </div>
  );
}
