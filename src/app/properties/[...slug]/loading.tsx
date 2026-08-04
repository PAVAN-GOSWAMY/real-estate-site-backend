import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetailsLoading() {
  return (
    <main className="min-h-screen bg-surface pb-24">
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Left Content */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Gallery Skeleton */}
            <section className="space-y-4">
              <Skeleton className="w-full aspect-video rounded-3xl" />
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="aspect-square rounded-2xl" />
                ))}
              </div>
            </section>

            {/* Summary Skeleton */}
            <section className="space-y-6 bg-card p-8 rounded-3xl border border-border/50">
              <div className="space-y-4">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-6 w-1/3" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-border/50">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                ))}
              </div>
            </section>
            
            {/* Amenities Skeleton */}
            <section className="space-y-6">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-48 rounded-2xl" />
                ))}
              </div>
            </section>

          </div>

          {/* Sticky Right Sidebar */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-6">
              <Skeleton className="h-[400px] rounded-[2rem] w-full" />
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
