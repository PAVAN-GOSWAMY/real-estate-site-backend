import { Suspense } from "react";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { PropertySkeleton } from "@/components/property/PropertySkeleton";
import { getPublicFilterOptions } from "@/modules/public/services/public-property.service";
import { PropertySearchParams } from "@/core/queries/properties";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { siteConfig } from "@/config/site";

export const metadata = {
  title: `Properties | ${siteConfig.name}`,
  description: "Browse our exclusive collection of luxury properties in Noida and Greater Noida.",
  openGraph: {
    title: `Properties | ${siteConfig.name}`,
    description: "Browse our exclusive collection of luxury properties in Noida and Greater Noida.",
  },
};

// In Next.js 15, searchParams in pages are a Promise
export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<PropertySearchParams>;
}) {
  // Await the params for server component usage
  const params = await searchParams;
  const filterOptions = await getPublicFilterOptions();

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Header */}
      <div className="bg-primary py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Exclusive <span className="opacity-70 italic">Properties</span>
            </h1>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Find your perfect sanctuary from our curated selection of Noida and Greater Noida&apos;s finest real estate.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Sidebar (Sticky) */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-28 bg-background p-6 rounded-2xl border border-border/50 shadow-sm flex flex-col max-h-[calc(100vh-8rem)]">
              <h3 className="shrink-0 font-heading text-xl font-bold mb-6 text-primary border-b border-border/50 pb-4">
                Filters
              </h3>
              <div className="flex-1 overflow-y-auto pr-3 -mr-3 custom-scrollbar">
                <PropertyFilters {...filterOptions} />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile Filter Trigger */}
            <div className="lg:hidden mb-6 flex justify-end">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto bg-background h-12">
                    <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:w-[400px] overflow-y-auto custom-scrollbar">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="font-heading text-xl text-left">Filters</SheetTitle>
                  </SheetHeader>
                  <PropertyFilters {...filterOptions} />
                </SheetContent>
              </Sheet>
            </div>

            {/* Suspense wrapper around the Grid for loading states */}
            {/* The key forces Suspense to trigger on param changes */}
            <Suspense key={JSON.stringify(params)} fallback={<PropertySkeleton />}>
              <PropertyGrid searchParams={params} />
            </Suspense>
          </div>
          
        </div>
      </div>
    </div>
  );
}
