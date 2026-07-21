import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function BuilderNotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center rounded-lg border bg-card p-8 shadow-sm">
      <div className="rounded-full bg-muted p-3">
        <FileQuestion className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold tracking-tight">Builder Not Found</h2>
        <p className="text-muted-foreground">
          The builder you are looking for does not exist or may have been permanently removed.
        </p>
      </div>
      <Button asChild>
        <Link href="/admin/builders">Return to Builders</Link>
      </Button>
    </div>
  );
}
