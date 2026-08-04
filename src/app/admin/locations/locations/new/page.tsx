import { Metadata } from "next"
import { LocationForm } from "../_components/LocationForm"
import { LocationsService } from "@/modules/locations/locations.service"

export const metadata: Metadata = {
  title: "Add Location | Admin",
  description: "Add a new location.",
}

export default async function NewLocationPage() {
  const cities = await LocationsService.getActiveCities()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Location</h1>
        <p className="text-muted-foreground mt-1">
          Create a new locality, sector, or zone.
        </p>
      </div>

      <LocationForm cities={cities} />
    </div>
  )
}
