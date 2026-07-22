import { PageHeader } from "@/components/admin/ui/PageHeader";
import { LeadsService } from "@/modules/leads/services/leads.service";
import { LeadsClient } from "./_components/LeadsClient";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const filters = {
    search: params.search || "",
    status: params.status || "",
    source: params.source || "",
    priority: params.priority || "",
  };

  const { leads, totalCount, totalPages } = await LeadsService.getLeads(filters, page, 10);
  const metrics = await LeadsService.getDashboardMetrics();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Leads Management" 
        description="Track and manage all customer inquiries and interactions."
        action={
          <Button asChild>
            <Link href="/admin/leads/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Link>
          </Button>
        }
      />

      <LeadsClient 
        initialLeads={leads} 
        totalCount={totalCount} 
        totalPages={totalPages} 
        currentPage={page} 
        filters={filters} 
        metrics={metrics}
      />
    </div>
  );
}
