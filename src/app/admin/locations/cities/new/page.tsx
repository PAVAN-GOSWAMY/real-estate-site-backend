import { Metadata } from "next"
import { CityForm } from "../_components/CityForm"

export const metadata: Metadata = {
  title: "Add City | Admin",
  description: "Add a new city.",
}

export default function NewCityPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add City</h1>
        <p className="text-muted-foreground mt-1">
          Create a new overarching city region.
        </p>
      </div>

      <CityForm />
    </div>
  )
}
