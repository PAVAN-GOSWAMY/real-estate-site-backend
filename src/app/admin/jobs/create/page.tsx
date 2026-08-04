import { Metadata } from "next"
import { JobForm } from "../_components/JobForm"
import { ensureRole } from "@/lib/auth/utils"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Create Job | Admin",
  description: "Create a new job posting.",
}

export default async function CreateJobPage() {
  await ensureRole(['Super Admin', 'Admin']);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/jobs">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Job</h1>
          <p className="text-muted-foreground mt-1">
            Add a new job posting to the careers page.
          </p>
        </div>
      </div>

      <JobForm />
    </div>
  )
}
