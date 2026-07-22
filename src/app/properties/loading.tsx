import { Skeleton } from "@/components/ui/skeleton";
import { PropertySkeleton } from "@/components/property/PropertySkeleton";

export default function PropertiesLoading() {
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
          {/* Desktop Sidebar Skeleton */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-28 bg-background p-6 rounded-2xl border border-border/50 shadow-sm flex flex-col space-y-6">
              <h3 className="font-heading text-xl font-bold text-primary border-b border-border/50 pb-4">
                Filters
              </h3>
              <div className="space-y-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area Skeleton */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="lg:hidden mb-6 flex justify-end">
              <Skeleton className="h-12 w-full sm:w-32" />
            </div>
            <PropertySkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
