import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listBuildersAction } from "@/modules/builders/actions";
import { BuilderFilters } from "@/modules/builders/types/builder";
import { BuildersFilter } from "./_components/BuildersFilter";
import { BuildersList } from "./_components/BuildersList";
import { AdminPagination } from "@/components/common/admin-pagination";
import { PageHeader } from "@/components/admin/ui/PageHeader";

// Next.js config to ensure dynamic search params parsing works optimally
export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BuildersPage(props: PageProps) {
  // Await searchParams in Next.js 15
  const searchParams = await props.searchParams;

  // Extract limit or default to 10
  const rawLimit = typeof searchParams.limit === 'string' ? parseInt(searchParams.limit, 10) : 10;
  const limit = isNaN(rawLimit) ? 10 : rawLimit;

  // Map URL parameters to domain filters
  const filters: BuilderFilters = {
    search: typeof searchParams.search === 'string' ? searchParams.search : undefined,
    featured: searchParams.featured === 'true' ? true : searchParams.featured === 'false' ? false : undefined,
    active: searchParams.active === 'true' ? true : searchParams.active === 'false' ? false : undefined,
    page: typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1,
    limit,
  };

  // Fetch data cleanly from Server Actions
  const result = await listBuildersAction(filters);

  // Error boundary will catch this if something fails
  if (!result.success) {
    throw new Error(result.error);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Builders"
        description="Manage your real estate developer profiles."
        action={
          <Button asChild>
            <Link href="/admin/builders/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Builder
            </Link>
          </Button>
        }
      />
      
      {/* Search and Filters Shell */}
      <BuildersFilter />
      
      {/* Data Presentation */}
      <BuildersList builders={result.data.items} />
      
      {/* Dynamic Pagination Controls */}
      {result.data.total > 0 && (
        <div className="pt-4 pb-8">
          <AdminPagination 
            total={result.data.total}
            page={result.data.page}
            limit={result.data.limit}
          />
        </div>
      )}
    </div>
  );
}
