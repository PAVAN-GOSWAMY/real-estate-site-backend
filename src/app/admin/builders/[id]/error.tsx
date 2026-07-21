"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronLeft } from "lucide-react";

export default function BuilderDetailsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Builder details page error:", error);
  }, [error]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/builders">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Builder Details</h1>
      </div>

      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center rounded-lg border bg-card p-8 shadow-sm">
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-bold tracking-tight">Unable to load builder</h2>
          <p className="text-muted-foreground">
            {error.message || "An unexpected error occurred while loading this builder's details."}
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => reset()} variant="default">
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/builders">Return to Directory</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
