import { Skeleton } from "@/components/ui/skeleton";

export default function BuilderDetailsLoading() {
  return (
    <main className="min-h-screen bg-surface pb-24">
      <div className="container mx-auto px-4 md:px-6 mt-6 md:mt-8">
        <Skeleton className="h-4 w-48 mb-8" />
      </div>
      
      {/* Hero Skeleton */}
      <div className="bg-card py-16 border-b border-border/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Skeleton className="h-32 w-32 rounded-3xl" />
            <div className="space-y-4 flex-1 w-full text-center md:text-left">
              <Skeleton className="h-10 w-64 mx-auto md:mx-0" />
              <Skeleton className="h-6 w-full max-w-xl mx-auto md:mx-0" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Skeleton */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
      
      {/* Overview Skeleton */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </main>
  );
}
