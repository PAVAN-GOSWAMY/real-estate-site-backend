import { Metadata } from "next"
import { getPaginatedJobsAction, getCareersStatsAction } from "@/modules/jobs/actions/jobs.actions"
import { JobsTable } from "./_components/JobsTable"
import { CareersStatsCards } from "./_components/CareersStatsCards"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ensureRole } from "@/lib/auth/utils"

export const metadata: Metadata = {
  title: "Jobs | Admin",
  description: "Manage job postings.",
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; status?: string }>
}) {
  await ensureRole(['Super Admin', 'Admin']);
  
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1
  const limit = 20
  
  const { jobs, total } = await getPaginatedJobsAction(page, limit, {
    q: resolvedSearchParams.q,
    status: resolvedSearchParams.status,
  })

  const stats = await getCareersStatsAction();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground mt-1">
            Manage job postings and career opportunities.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button asChild>
            <Link href="/admin/jobs/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Job
            </Link>
          </Button>
        </div>
      </div>

      <CareersStatsCards stats={stats} />

      <JobsTable 
        jobs={jobs} 
        total={total}
        currentPage={page}
        pageSize={limit}
      />
    </div>
  )
}
