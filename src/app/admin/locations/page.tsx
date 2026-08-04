import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Building2, LayoutList, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Location Management | Admin",
  description: "Manage cities and locations for properties.",
}

async function getStats() {
  const supabase = await createClient();
  const [{ count: totalCities }, { count: activeCities }, { count: totalLocations }, { count: activeLocations }] = await Promise.all([
    supabase.from('cities').select('*', { count: 'exact', head: true }),
    supabase.from('cities').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('locations').select('*', { count: 'exact', head: true }),
    supabase.from('locations').select('*', { count: 'exact', head: true }).eq('is_active', true),
  ]);
  
  return {
    totalCities: totalCities || 0,
    activeCities: activeCities || 0,
    totalLocations: totalLocations || 0,
    activeLocations: activeLocations || 0,
  }
}

export default async function LocationDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Location Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage cities, localities, and sectors.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button asChild variant="outline" className="flex-1 sm:flex-none bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary">
            <Link href="/admin/locations/cities/import">
              <MapPin className="mr-2 h-4 w-4" />
              Import Cities
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 sm:flex-none">
            <Link href="/admin/locations/cities/new">
              <Plus className="mr-2 h-4 w-4" />
              Add City
            </Link>
          </Button>
          <Button asChild className="flex-1 sm:flex-none">
            <Link href="/admin/locations/locations/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cities</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCities}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.activeCities} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLocations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.activeLocations} active
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage parent cities and overarching regions.
            </p>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/admin/locations/cities">
                <LayoutList className="mr-2 h-4 w-4" />
                View All Cities
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage localities, sectors, and micro-markets within cities.
            </p>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/admin/locations/locations">
                <LayoutList className="mr-2 h-4 w-4" />
                View All Locations
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
