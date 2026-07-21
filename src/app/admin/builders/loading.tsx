import { Skeleton } from "@/components/ui/skeleton";

export default function BuildersLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[140px] hidden sm:block" />
        <Skeleton className="h-10 w-[140px] hidden sm:block" />
      </div>
      <div className="rounded-md border bg-card p-4 space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-8 w-24 hidden sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
