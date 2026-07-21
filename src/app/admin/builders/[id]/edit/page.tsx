import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBuilderAction } from "@/modules/builders/actions";
import { EditBuilderForm } from "../../_components/edit-builder-form";

// Next.js config to ensure dynamic path segment is awaited correctly
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBuilderPage(props: PageProps) {
  // Await params in Next.js 15
  const params = await props.params;
  
  // Fetch the builder using the Server Action
  const result = await getBuilderAction(params.id);

  // If the action failed or the builder wasn't found
  if (!result.success || !result.data) {
    notFound();
  }

  const builder = result.data;

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
          <h1 className="text-3xl font-bold tracking-tight">Edit Builder</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Modify the profile details for {builder.name}.
          </p>
        </div>
      </div>
      
      <EditBuilderForm builder={builder} />
    </div>
  );
}
