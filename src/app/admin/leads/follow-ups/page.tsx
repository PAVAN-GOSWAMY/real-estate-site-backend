import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FollowUpsService } from "@/modules/leads/services/follow-ups.service";
import { FollowUpMetrics } from "./_components/FollowUpMetrics";
import { FollowUpList } from "./_components/FollowUpList";
import { FollowUpCalendar } from "./_components/FollowUpCalendar";

export const metadata = {
  title: "Follow-ups & Tasks",
};

export default async function FollowUpsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const filters = {
    status: params.status || "",
    search: params.search || "",
  };

  const { followUps, totalCount, totalPages } = await FollowUpsService.getFollowUps(filters, page, 50);
  const metrics = await FollowUpsService.getDashboardMetrics();

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-[1600px] mx-auto w-full">
      <PageHeader 
        title="Follow-ups & Tasks" 
        description="Manage your sales pipeline and upcoming customer touchpoints."
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/leads">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Leads
              </Link>
            </Button>
          </div>
        }
      />
      
      {/* Metrics Dashboard */}
      <FollowUpMetrics metrics={metrics} />

      {/* Task List (Data Table) */}
      <FollowUpList 
        followUps={followUps} 
        totalCount={totalCount} 
        totalPages={totalPages} 
        currentPage={page} 
        filters={filters} 
      />

      {/* Calendar View */}
      <FollowUpCalendar followUps={followUps} />
    </div>
  );
}
