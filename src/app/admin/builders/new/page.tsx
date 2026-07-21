import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateBuilderForm } from "../_components/create-builder-form";

export default function NewBuilderPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/builders">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Builder</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Add a new real estate developer to your directory.
          </p>
        </div>
      </div>
      
      <CreateBuilderForm />
    </div>
  );
}
