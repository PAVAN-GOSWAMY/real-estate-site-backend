import { Metadata } from "next";
import { getPaginatedApplicationsAction } from "@/modules/jobs/actions/jobs.actions";
import { ApplicationsTable } from "./_components/ApplicationsTable";
import { ensureRole } from "@/lib/auth/utils";

export const metadata: Metadata = {
  title: "Job Applications | Admin Portal",
};

export default async function ApplicationsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  await ensureRole(['Super Admin', 'Admin']);

  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
  const limit = typeof searchParams.limit === 'string' ? parseInt(searchParams.limit) : 20;
  
  const status = typeof searchParams.status === 'string' ? searchParams.status : undefined;
  const jobId = typeof searchParams.jobId === 'string' ? searchParams.jobId : undefined;

  const result = await getPaginatedApplicationsAction(page, limit, { status, jobId });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Job Applications</h1>
        <p className="text-muted-foreground mt-1">
          Review candidate applications, view resumes, and update hiring statuses.
        </p>
      </div>

      <ApplicationsTable 
        applications={result.applications} 
        total={result.total} 
      />
    </div>
  );
}
