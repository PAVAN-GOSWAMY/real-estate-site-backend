import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";
import { ensureAdminAuth } from "@/lib/auth/utils";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await ensureAdminAuth();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="fixed inset-y-0 z-50 w-64 flex-col">
            <AdminSidebar role={user.role} />
          </div>
        </div>
        
        {/* Main Layout Area */}
        <div className="flex flex-1 flex-col w-full min-w-0">
          <AdminHeader role={user.role} />
          <main className="flex-1 p-4 sm:p-6 md:p-8">
            <AdminBreadcrumb />
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
