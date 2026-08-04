import { Metadata } from "next"
import { CityImportWizard } from "../_components/import-wizard/CityImportWizard"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Import City | Location Management",
  description: "Import a city from external providers.",
}

export default async function CityImportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/locations/cities">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Import City</h1>
          <p className="text-muted-foreground mt-1">
            Search and import top-level administrative cities from external providers.
          </p>
        </div>
      </div>

      <div className="max-w-4xl">
        <CityImportWizard />
      </div>
    </div>
  )
}
