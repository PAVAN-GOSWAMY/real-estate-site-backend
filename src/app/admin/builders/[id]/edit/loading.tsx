import { Skeleton } from "@/components/ui/skeleton";

export default function EditBuilderLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      
      <div className="space-y-8 mt-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow space-y-6 p-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64 mb-6" />
          
          <Skeleton className="h-32 w-full rounded-md" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          
          <div className="space-y-2 mt-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
