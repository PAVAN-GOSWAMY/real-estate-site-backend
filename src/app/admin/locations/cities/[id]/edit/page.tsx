import { Metadata } from "next"
import { CityForm } from "../../_components/CityForm"
import { CitiesRepository } from "@/modules/locations/repository/cities.repository"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Edit City | Admin",
  description: "Edit city.",
}

export default async function EditCityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  const city = await CitiesRepository.findById(resolvedParams.id)
  
  if (!city) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit City</h1>
        <p className="text-muted-foreground mt-1">
          Update overarching city region.
        </p>
      </div>

      <CityForm initialData={city} />
    </div>
  )
}
