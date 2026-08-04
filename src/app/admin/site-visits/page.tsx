import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SiteVisitService } from "@/modules/site-visits/services/site-visit.service";
import { SiteVisitsClient } from "./_components/SiteVisitsClient";

export const dynamic = "force-dynamic";

export default async function SiteVisitsPage() {
  const visits = await SiteVisitService.getSiteVisits();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Site Visits" 
        description="Manage all property site visits requested by customers."
      />
      <SiteVisitsClient initialVisits={visits} />
    </div>
  );
}
