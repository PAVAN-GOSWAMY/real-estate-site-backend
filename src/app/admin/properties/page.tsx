import { PageHeader } from "@/components/admin/ui/PageHeader";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Home } from "lucide-react";

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Properties" 
        description="Manage all real estate properties, types, and locations."
      />
      <EmptyState
        title="Coming Soon"
        description="The Properties module is currently under development. Check back later."
        icon={Home}
        className="bg-card shadow-sm"
      />
    </div>
  );
}
