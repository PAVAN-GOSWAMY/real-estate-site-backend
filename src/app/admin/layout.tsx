import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="fixed inset-y-0 z-50 w-64 flex-col">
            <AdminSidebar />
          </div>
        </div>
        
        {/* Main Layout Area */}
        <div className="flex flex-1 flex-col w-full min-w-0">
          <AdminHeader />
          <main className="flex-1 p-4 sm:p-6 md:p-8">
            <AdminBreadcrumb />
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
