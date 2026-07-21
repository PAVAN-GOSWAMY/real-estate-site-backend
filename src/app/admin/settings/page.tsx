import { PageHeader } from "@/components/admin/ui/PageHeader";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings" 
        description="Manage global application settings and configurations."
      />
      <EmptyState
        title="Coming Soon"
        description="The Settings module is currently under development. Check back later."
        icon={Settings}
        className="bg-card shadow-sm"
      />
    </div>
  );
}
