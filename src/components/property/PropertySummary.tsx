import { MapPin, Building, Key } from "lucide-react";
import { PublicProperty } from "@/modules/public/types/property";

interface PropertySummaryProps {
  property: PublicProperty;
}

export function PropertySummary({ property }: PropertySummaryProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
            {property.status}
          </span>
          {property.isFeatured && (
            <span className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 px-3 py-1 text-sm font-medium">
              Featured
            </span>
          )}
          {property.isVerified && (
            <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-3 py-1 text-sm font-medium">
              Verified
            </span>
          )}
          {property.reraNumber && (
            <span className="inline-flex items-center rounded-full bg-border/50 px-3 py-1 text-sm font-medium text-muted-foreground">
              RERA: {property.reraNumber}
            </span>
          )}
        </div>
        
        <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary tracking-tight mb-2">
          {property.title}
        </h1>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-5 w-5 mr-2 shrink-0 text-accent" />
            <span className="text-lg">{[property.sector, property.locality, property.city].filter(Boolean).join(', ') || "Location on Request"}</span>
          </div>
          {property.priceDisplay && (
            <div className="text-2xl font-bold text-primary">
              {property.priceDisplay}
            </div>
          )}
        </div>
      </div>

      <div className="prose prose-lg prose-p:text-muted-foreground max-w-none">
        {property.shortDescription && (
          <p className="text-xl text-foreground font-medium mb-4">{property.shortDescription}</p>
        )}
        <p>{property.description}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-border/50">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Developer</p>
          <p className="font-medium text-foreground">{property.builderName}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Configurations</p>
          <p className="font-medium text-foreground">{property.bedrooms ? `${property.bedrooms} BHK ${property.propertyType}` : property.propertyType}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Carpet Area</p>
          <p className="font-medium text-foreground">{property.carpetArea ? `${property.carpetArea} Sq.Ft.` : "On Request"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Possession</p>
          <p className="font-medium text-foreground">{property.possessionDate || "Ready"}</p>
        </div>
      </div>
    </div>
  );
}
