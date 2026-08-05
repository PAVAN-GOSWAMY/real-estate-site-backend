"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Property } from "@/modules/properties/types/property";
import { Builder } from "@/modules/builders/types/builder";
import { BasicInfoTab } from "./BasicInfoTab";
import { LocationTab } from "./LocationTab";
import { PricingTab } from "./PricingTab";
import { PropertyDetailsTab } from "./PropertyDetailsTab";
import { SeoTab } from "./SeoTab";
import { MediaTab } from "./MediaTab";
import { AmenitiesTab } from "./AmenitiesTab";
import { FloorPlansTab } from "./FloorPlansTab";
import { DocumentsTab } from "./DocumentsTab";
import { ComingSoonTab } from "./ComingSoonTab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { Amenity } from "@/modules/amenities/types/amenity";

interface PropertyTabsContainerProps {
  property: Property;
  builders: Builder[];
  amenities: Amenity[];
  assignedAmenities: string[];
  mediaCount: number;
  floorPlansCount: number;
  documentsCount: number;
}

export function PropertyTabsContainer({ 
  property, 
  builders, 
  amenities, 
  assignedAmenities, 
  mediaCount,
  floorPlansCount,
  documentsCount
}: PropertyTabsContainerProps) {
  // Calculate completion
  const isBasicInfoComplete = !!(property.title && property.slug && property.propertyType);
  const isLocationComplete = !!(property.city_id && property.location_id);
  const isPricingComplete = property.price !== null && property.price !== undefined;
  const isDetailsComplete = property.bedrooms !== null || property.carpetArea !== null;
  const isSeoComplete = !!(property.metaTitle || property.metaDescription);
  const isMediaComplete = mediaCount > 0;
  const isAmenitiesComplete = assignedAmenities.length > 0;
  const isFloorPlansComplete = floorPlansCount > 0;
  const isDocumentsComplete = documentsCount > 0;
  
  const completions = [
    { name: "Basic Information", complete: isBasicInfoComplete },
    { name: "Location", complete: isLocationComplete },
    { name: "Pricing", complete: isPricingComplete },
    { name: "Property Details", complete: isDetailsComplete },
    { name: "SEO", complete: isSeoComplete },
    { name: "Media", complete: isMediaComplete },
    { name: "Amenities", complete: isAmenitiesComplete },
    { name: "Floor Plans", complete: isFloorPlansComplete },
    { name: "Documents", complete: isDocumentsComplete },
  ];

  const completedCount = completions.filter(c => c.complete).length;
  const progress = Math.round((completedCount / completions.length) * 100);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-grow w-full lg:w-3/4">
        <Tabs defaultValue="basic" className="w-full">
          <div className="overflow-x-auto pb-2 mb-4 scrollbar-hide">
        <TabsList className="h-10 inline-flex w-max min-w-full justify-start lg:w-full lg:justify-start px-1">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="details">Property Details</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="floorplans">Floor Plans</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          {/* <TabsTrigger value="activity">Activity</TabsTrigger> */}
        </TabsList>
      </div>

      <div className="mt-4">
        <TabsContent value="basic" className="m-0 focus-visible:outline-none">
          <BasicInfoTab property={property} builders={builders} />
        </TabsContent>
        
        <TabsContent value="location" className="m-0 focus-visible:outline-none">
          <LocationTab property={property} />
        </TabsContent>
        
        <TabsContent value="pricing" className="m-0 focus-visible:outline-none">
          <PricingTab property={property} />
        </TabsContent>
        
        <TabsContent value="details" className="m-0 focus-visible:outline-none">
          <PropertyDetailsTab property={property} />
        </TabsContent>
        
        <TabsContent value="seo" className="m-0 focus-visible:outline-none">
          <SeoTab property={property} />
        </TabsContent>
        
        <TabsContent value="media" className="m-0 focus-visible:outline-none">
          <MediaTab property={property} />
        </TabsContent>
        
        <TabsContent value="amenities" className="m-0 focus-visible:outline-none">
          <AmenitiesTab 
            property={property} 
            allAmenities={amenities} 
            initialAssignedIds={assignedAmenities} 
          />
        </TabsContent>
        
        <TabsContent value="floorplans" className="m-0 focus-visible:outline-none">
          <FloorPlansTab propertyId={property.id} />
        </TabsContent>
        
        <TabsContent value="documents" className="m-0 focus-visible:outline-none">
          <DocumentsTab propertyId={property.id} />
        </TabsContent>
        
        {/* <TabsContent value="activity" className="m-0 focus-visible:outline-none">
          <ComingSoonTab title="Activity Timeline" description="View property history and audit logs." />
        </TabsContent> */}
      </div>
    </Tabs>
    </div>
      
    {/* Sticky Summary Panel */}
    <div className="w-full lg:w-1/4">
      <div className="sticky top-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Completion Status</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {completions.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className={`text-sm ${item.complete ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.name}
                </span>
                {item.complete ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
  );
}
