import { PageHeader } from "@/components/admin/ui/PageHeader";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Briefcase } from "lucide-react";

export default function CareersPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Careers" 
        description="Manage job postings and applicant submissions."
      />
      <EmptyState
        title="Coming Soon"
        description="The Careers module is currently under development. Check back later."
        icon={Briefcase}
        className="bg-card shadow-sm"
      />
    </div>
  );
}
