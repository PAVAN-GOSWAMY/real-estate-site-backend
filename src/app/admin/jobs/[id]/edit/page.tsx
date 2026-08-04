import { Metadata } from "next"
import { JobForm } from "../../_components/JobForm"
import { ensureRole } from "@/lib/auth/utils"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { JobsRepository } from "@/modules/jobs/repository/jobs.repository"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Edit Job | Admin",
  description: "Edit an existing job posting.",
}

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await ensureRole(['Super Admin', 'Admin']);
  
  const resolvedParams = await params;
  const job = await JobsRepository.findById(resolvedParams.id);
  
  if (!job) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/jobs">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Job</h1>
          <p className="text-muted-foreground mt-1">
            Update the job posting details.
          </p>
        </div>
      </div>

      <JobForm initialData={job} />
    </div>
  )
}
