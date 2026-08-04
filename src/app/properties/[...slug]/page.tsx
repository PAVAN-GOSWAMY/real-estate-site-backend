import { notFound } from "next/navigation";
import { getPublicPropertyBySlug, getRelatedProperties } from "@/modules/public/services/public-property.service";
import { PropertyBreadcrumb } from "@/components/property/PropertyBreadcrumb";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertySummary } from "@/components/property/PropertySummary";
import { PropertyAmenities } from "@/components/property/PropertyAmenities";
import { PropertyFloorPlans } from "@/components/property/PropertyFloorPlans";
import { PropertyInquiryCard } from "@/components/property/PropertyInquiryCard";
import { PropertyDocuments, PropertyDisclaimer } from "@/components/property/PropertyExtras";
import { PropertyLocation } from "@/components/property/PropertyLocation";
import { StickyCTA } from "@/components/contact/StickyCTA";
import { PropertyDeveloper } from "@/components/property/PropertyDeveloper";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { ScheduleVisitModalContainer } from "@/components/forms/ScheduleVisitModalContainer";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const property = await getPublicPropertyBySlug(resolvedParams.slug);
  if (!property) return { title: "Property Not Found" };

  return {
    title: property.metaTitle || `${property.title} | Luxury Real Estate in ${property.locality}, ${property.city}`,
    description: property.metaDescription || property.description || `Explore ${property.title} in ${property.locality}, ${property.city}.`,
    openGraph: {
      title: property.metaTitle || `${property.title} | Luxury Real Estate in ${property.locality}, ${property.city}`,
      description: property.metaDescription || property.description || `Explore ${property.title} in ${property.locality}, ${property.city}.`,
      images: property.thumbnail ? [{ url: property.thumbnail, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: property.metaTitle || `${property.title} | Luxury Real Estate in ${property.locality}, ${property.city}`,
      description: property.metaDescription || property.description || `Explore ${property.title} in ${property.locality}, ${property.city}.`,
      images: property.thumbnail ? [property.thumbnail] : [],
    },
  };
}

export default async function PropertyDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const property = await getPublicPropertyBySlug(resolvedParams.slug);

  if (!property) {
    notFound();
  }

  // Ensure we have an images array. `images` is populated by DB service.
  const images = property.images && property.images.length > 0 ? property.images : (property.thumbnail ? [property.thumbnail] : []);
  const priceDisplay = property.priceDisplay || "Price on Request";

  const relatedProperties = await getRelatedProperties(property, 4);

  return (
    <main className="min-h-screen bg-surface pb-24">
      <StickyCTA title={property.title} price={priceDisplay} type="property" />
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        
        <PropertyBreadcrumb 
          city={property.city} 
          locality={property.locality} 
          title={property.title} 
          citySlug={property.citySlug}
          locationSlug={property.locationSlug}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Left Content */}
          <div className="lg:col-span-8 space-y-16">
            
            <section id="gallery">
              <PropertyGallery images={images} />
            </section>

            <section id="summary">
              <PropertySummary property={property} />
            </section>

            <section id="location">
              <PropertyLocation property={property} />
            </section>

            {/* Hidden: Highlights (Future Phase) */}
            
            {/* Hidden: Pricing Configurations (Future Phase) */}

            {property.documents && property.documents.length > 0 && (
              <section id="brochure">
                <PropertyDocuments documents={property.documents} />
              </section>
            )}

            {property.amenityGroups && property.amenityGroups.length > 0 && (
              <section id="amenities">
                <PropertyAmenities groups={property.amenityGroups} />
              </section>
            )}

            {property.floorPlans && property.floorPlans.length > 0 && (
              <section id="floor-plans">
                <PropertyFloorPlans floorPlans={property.floorPlans} />
              </section>
            )}

            {/* Hidden: Location Advantages (Future Phase) */}
            
            {property.builderProfile && (
              <section id="developer">
                <PropertyDeveloper profile={{
                  name: property.builderProfile.name,
                  logo: property.builderProfile.logoUrl || '',
                  description: property.builderProfile.description || '',
                  experience: property.builderProfile.establishedYear ? `${new Date().getFullYear() - property.builderProfile.establishedYear} Years` : 'N/A',
                  delivered: 'Multiple Projects' // DB fallback
                }} />
              </section>
            )}
            
            {/* Hidden: FAQs (Future Phase) */}
            
            <PropertyDisclaimer />
          </div>

          {/* Sticky Right Sidebar */}
          <div className="lg:col-span-4 relative">
            <PropertyInquiryCard 
              title={property.title} 
              price={priceDisplay} 
              propertyId={property.id}
              builderId={property.builderId || undefined}
            />
          </div>
          
        </div>

        {relatedProperties.length > 0 && (
          <section id="related-properties" className="mt-24 border-t border-border/50 pt-16">
            <h2 className="font-heading text-3xl font-bold text-primary mb-8">Related Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProperties.map(prop => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </section>
        )}
      </div>

      <ScheduleVisitModalContainer 
        propertyId={property.id} 
        builderId={property.builderId || undefined}
        propertyTitle={property.title}
      />
    </main>
  );
}
