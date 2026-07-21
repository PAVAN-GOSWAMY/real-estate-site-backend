import { PageHeader } from "@/components/admin/ui/PageHeader";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Users } from "lucide-react";

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Leads" 
        description="Manage inquiries, contact forms, and site visits."
      />
      <EmptyState
        title="Coming Soon"
        description="The Leads module is currently under development. Check back later."
        icon={Users}
        className="bg-card shadow-sm"
      />
    </div>
  );
}
