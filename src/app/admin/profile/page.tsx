import { PageHeader } from "@/components/admin/ui/PageHeader";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Settings } from "lucide-react";

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage Profile." />
      <EmptyState title="Coming Soon" description="The Profile module is currently under development." icon={Settings} className="bg-card shadow-sm" />
    </div>
  );
}
