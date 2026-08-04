import { Metadata } from "next"
import { getPaginatedLocationsAction } from "@/modules/locations/locations.actions"
import { LocationsTable } from "./_components/LocationsTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Locations | Location Management",
  description: "Manage locations (localities, sectors, etc).",
}

export default async function LocationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; city_id?: string; type?: string; status?: string }>
}) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1
  const limit = 20
  
  const { locations, total } = await getPaginatedLocationsAction(page, limit, {
    q: resolvedParams.q,
    city_id: resolvedParams.city_id,
    type: resolvedParams.type,
    status: resolvedParams.status,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground mt-1">
            Manage localities, sectors, areas, and zones.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/locations/locations/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Location
          </Link>
        </Button>
      </div>

      <LocationsTable 
        locations={locations} 
        total={total}
        currentPage={page}
        pageSize={limit}
      />
    </div>
  )
}
