import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, LayoutGrid, CalendarDays, CheckCircle2 } from "lucide-react";
import { PublicProperty } from "@/modules/public/types/property";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PropertyCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "property"> {
  property: PublicProperty;
}

export function PropertyCard({ property, className, ...props }: PropertyCardProps) {
  // Helper to map status to semantic colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready to Move":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "New Launch":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Under Construction":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  // Flatten amenities for quick display
  const allAmenities = property.amenityGroups.flatMap(g => g.items);

  const configuration = property.bedrooms ? `${property.bedrooms} BHK ${property.propertyType}` : property.propertyType;

  return (
    <div 
      className={cn(
        "group flex flex-col bg-white rounded-2xl overflow-hidden border border-border/40 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300",
        className
      )}
      {...props}
    >
      {/* 1. Image & Badge Area */}
      <div className="relative h-64 overflow-hidden bg-muted">
        {property.thumbnail ? (
          <Image
            src={property.thumbnail}
            alt={property.title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400">
            No Image
          </div>
        )}
        
        {/* Gradients for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <Badge variant="outline" className={cn("backdrop-blur-md bg-white/95 font-semibold", getStatusColor(property.status))}>
            {property.status}
          </Badge>
          {property.reraNumber && (
            <Badge variant="outline" className="bg-white/95 text-zinc-800 border-zinc-200 font-semibold shadow-sm backdrop-blur-md flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              RERA
            </Badge>
          )}
        </div>

        {/* Bottom Image Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white font-bold text-xl drop-shadow-sm font-heading">{property.priceDisplay || "Price on Request"}</p>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            {property.builderName}
          </p>
          <h3 className="font-heading text-xl font-bold text-foreground line-clamp-1">
            <Link href={`/properties/${property.slug}`} prefetch={false} className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
              {property.title}
            </Link>
          </h3>
          <p className="text-sm text-muted-foreground flex items-center mt-2">
            <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0" />
            <span className="line-clamp-1">{[property.locality, property.city].filter(Boolean).join(', ') || "Location on Request"}</span>
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 py-4 border-y border-border/50 mb-4">
          <div className="flex items-center text-sm">
            <LayoutGrid className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
            <span className="text-foreground/80 font-medium truncate">{configuration}</span>
          </div>
          <div className="flex items-center text-sm">
            <CalendarDays className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
            <span className="text-foreground/80 font-medium truncate">{property.possessionDate || "Ready to Move"}</span>
          </div>
        </div>

        {/* Amenities (Max 4) */}
        {allAmenities.length > 0 && (
          <div className="mb-6 flex-1">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3">Premium Amenities</p>
            <ul className="grid grid-cols-2 gap-2">
              {allAmenities.slice(0, 4).map((amenity, index) => (
                <li key={index} className="flex items-center text-xs text-foreground/70">
                  <CheckCircle2 className="w-3 h-3 text-accent mr-1.5 shrink-0" />
                  <span className="truncate">{amenity.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 3. Action Buttons */}
        <div className="pt-4 mt-auto border-t border-border/50 flex gap-3">
          <Link href={`/properties/${property.slug}`} prefetch={false} className="flex-1">
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold">
              View Details
            </Button>
          </Link>
          <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
            Enquire
          </Button>
        </div>
      </div>
    </div>
  );
}
