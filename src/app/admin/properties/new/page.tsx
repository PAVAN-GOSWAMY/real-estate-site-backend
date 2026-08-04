import { PageHeader } from "@/components/admin/ui/PageHeader";
import { CreatePropertyForm } from "../_components/create-property-form";
import { listBuildersAction } from "@/modules/builders/actions";
import { getNextPropertyCodeAction } from "@/modules/properties/actions";
import { getActiveCitiesAction } from "@/modules/locations/locations.actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function NewPropertyPage() {
  const [buildersResult, codeResult, cities] = await Promise.all([
    listBuildersAction({ active: true, limit: 100 }),
    getNextPropertyCodeAction(),
    getActiveCitiesAction()
  ]);

  const builders = buildersResult.success ? buildersResult.data.items : [];
  const initialCode = codeResult.success ? codeResult.data : `PROP-${Date.now().toString().slice(-6)}`;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Add New Property" 
        description="Create a new property listing." 
        action={
          <Button variant="outline" asChild>
            <Link href="/admin/properties">Cancel</Link>
          </Button>
        }
      />
      
      <div className="mx-auto max-w-5xl">
        <CreatePropertyForm initialCode={initialCode} builders={builders} cities={cities} />
      </div>
    </div>
  );
}
