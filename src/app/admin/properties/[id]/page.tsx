import { PageHeader } from "@/components/admin/ui/PageHeader";
import { PropertyTabsContainer } from "../_components/property-tabs/PropertyTabsContainer";
import { listBuildersAction } from "@/modules/builders/actions";
import { getPropertyAction } from "@/modules/properties/actions";
import { getActiveAmenitiesAction } from "@/modules/amenities/actions/amenity.actions";
import { getAmenitiesForPropertyAction } from "@/modules/properties/actions/property-amenities.actions";
import { getPropertyMediaAction } from "@/modules/properties/actions/media.actions";
import { getFloorPlansAction, getDocumentsAction } from "@/modules/properties/actions/assets.actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

import { StatusBadge } from "@/components/admin/ui/StatusBadge";

export const dynamic = 'force-dynamic';

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const [
    propertyResult, 
    buildersResult, 
    amenitiesResult, 
    assignedAmenitiesResult, 
    mediaResult,
    floorPlansResult,
    documentsResult
  ] = await Promise.all([
    getPropertyAction(resolvedParams.id),
    listBuildersAction({ active: true, limit: 100 }),
    getActiveAmenitiesAction(),
    getAmenitiesForPropertyAction(resolvedParams.id),
    getPropertyMediaAction(resolvedParams.id),
    getFloorPlansAction(resolvedParams.id),
    getDocumentsAction(resolvedParams.id)
  ]);

  if (!propertyResult.success || !propertyResult.data) {
    notFound();
  }

  const builders = buildersResult.success ? buildersResult.data.items : [];
  const amenities = amenitiesResult.success ? amenitiesResult.data : [];
  const assignedAmenities = assignedAmenitiesResult.success ? assignedAmenitiesResult.data : [];
  const mediaCount = mediaResult.success ? mediaResult.data.length : 0;
  const floorPlansCount = floorPlansResult.success ? floorPlansResult.data.length : 0;
  const documentsCount = documentsResult.success ? documentsResult.data.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{propertyResult.data.title}</h1>
            <StatusBadge status={propertyResult.data.status as any} />
          </div>
          <p className="text-muted-foreground mt-1">
            {propertyResult.data.propertyCode}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/properties">Back to Properties</Link>
        </Button>
      </div>
      
      <div className="mx-auto w-full">
        <PropertyTabsContainer 
          property={propertyResult.data} 
          builders={builders}
          amenities={amenities}
          assignedAmenities={assignedAmenities}
          mediaCount={mediaCount}
          floorPlansCount={floorPlansCount}
          documentsCount={documentsCount}
        />
      </div>
    </div>
  );
}
