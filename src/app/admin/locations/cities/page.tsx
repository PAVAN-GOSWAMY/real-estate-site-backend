import { Metadata } from "next"
import { getPaginatedCitiesAction } from "@/modules/locations/locations.actions"
import { CitiesTable } from "./_components/CitiesTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Cities | Location Management",
  description: "Manage cities.",
}

export default async function CitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; state?: string; status?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1
  const limit = 20
  
  const { cities, total } = await getPaginatedCitiesAction(page, limit, {
    q: resolvedSearchParams.q,
    state: resolvedSearchParams.state,
    status: resolvedSearchParams.status,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cities</h1>
          <p className="text-muted-foreground mt-1">
            Manage top-level cities and their active status.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button asChild variant="outline" className="flex-1 sm:flex-none bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary">
            <Link href="/admin/locations/cities/import">
              <Plus className="mr-2 h-4 w-4" />
              Import City
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/locations/cities/new">
              <Plus className="mr-2 h-4 w-4" />
              Add City
            </Link>
          </Button>
        </div>
      </div>

      <CitiesTable 
        cities={cities} 
        total={total}
        currentPage={page}
        pageSize={limit}
      />
    </div>
  )
}
