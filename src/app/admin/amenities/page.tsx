import { PageHeader } from "@/components/admin/ui/PageHeader";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Settings, Plus } from "lucide-react";
import { getAllAmenitiesAction } from "@/modules/amenities/actions/amenity.actions";
import { AmenitiesList } from "./_components/AmenitiesList";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const result = await getAllAmenitiesAction();
  const amenities = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Amenities Management" 
        description="Create and manage amenities for properties." 
      />
      
      {amenities.length === 0 ? (
        <EmptyState 
          title="No amenities found" 
          description="Get started by creating your first amenity." 
          icon={Settings} 
          className="bg-card shadow-sm"
          action={<AmenitiesList amenities={amenities} />}
        />
      ) : (
        <div className="bg-card shadow-sm rounded-lg border">
          <AmenitiesList amenities={amenities} />
        </div>
      )}
    </div>
  );
}
