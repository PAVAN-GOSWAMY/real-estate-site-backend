import { Metadata } from "next"
import { LocationForm } from "../../_components/LocationForm"
import { LocationsRepository } from "@/modules/locations/repository/locations.repository"
import { LocationsService } from "@/modules/locations/locations.service"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Edit Location | Admin",
  description: "Edit location.",
}

export default async function EditLocationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  const location = await LocationsRepository.findById(resolvedParams.id)
  
  if (!location) {
    notFound()
  }

  const cities = await LocationsService.getAllCities() // fetch all in case the attached city is inactive

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Location</h1>
        <p className="text-muted-foreground mt-1">
          Update locality or sector.
        </p>
      </div>

      <LocationForm initialData={location} cities={cities} />
    </div>
  )
}
