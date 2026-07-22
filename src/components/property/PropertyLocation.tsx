"use client";

import { MapPin, ExternalLink, Map as MapIcon, Building2, MapPinned, Copy, Check, Navigation, Navigation2 } from "lucide-react";
import { PublicProperty } from "@/modules/public/types/property";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

interface PropertyLocationProps {
  property: PublicProperty;
}

export function PropertyLocation({ property }: PropertyLocationProps) {
  const [copied, setCopied] = useState(false);
  
  const hasFullAddress = !!property.address;
  const hasMapUrl = !!property.googleMapsUrl;
  const hasCoordinates = !!property.latitude && !!property.longitude;
  const hasPincode = !!property.pincode;

  const copyToClipboard = () => {
    let textToCopy = property.address || "";
    if (!textToCopy) {
      textToCopy = [property.landmark, property.locality, property.city, property.state, property.pincode]
        .filter(Boolean)
        .join(", ");
    }
    
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success("Address Copied");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-[2rem] p-6 sm:p-8 lg:p-10 border border-border/50 shadow-sm transition-all duration-300 hover:shadow-md group">
      
      {/* Left Column: Location Details (40%) */}
      <div className="lg:col-span-5 flex flex-col h-full min-w-0 lg:pr-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner">
            <MapPin className="h-7 w-7" />
          </div>
          <div>
            <h2 className="font-heading text-3xl font-bold text-foreground tracking-tight">Location</h2>
            <p className="text-muted-foreground text-lg mt-1 font-medium">
              {[property.locality, property.city, property.state, property.country].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>

        <div className="space-y-8 flex-grow">
          {property.landmark && (
            <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-primary/20 before:rounded-full">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-primary/70" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Landmark</h3>
              </div>
              <p className="text-foreground font-semibold text-lg">{property.landmark}</p>
            </div>
          )}

          {hasFullAddress && (
            <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-primary/20 before:rounded-full">
              <div className="flex items-center gap-2 mb-2">
                <MapPinned className="w-5 h-5 text-primary/70" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Complete Address</h3>
              </div>
              <p className="text-foreground/90 leading-relaxed font-medium">
                {property.address}
              </p>
              {hasPincode && (
                <p className="text-muted-foreground mt-2 font-medium">Pincode: {property.pincode}</p>
              )}
            </div>
          )}

          {/* Location Chips */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
            {property.locality && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-700 text-sm font-medium transition-colors hover:bg-zinc-200">
                <MapPin className="w-3.5 h-3.5" />
                {property.locality}
              </span>
            )}
            {property.city && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-700 text-sm font-medium transition-colors hover:bg-zinc-200">
                <Building2 className="w-3.5 h-3.5" />
                {property.city}
              </span>
            )}
            {property.pincode && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-700 text-sm font-medium transition-colors hover:bg-zinc-200">
                <Navigation2 className="w-3.5 h-3.5" />
                {property.pincode}
              </span>
            )}
            {property.landmark && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-700 text-sm font-medium transition-colors hover:bg-zinc-200">
                <Navigation className="w-3.5 h-3.5" />
                Landmark
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4">
          {hasMapUrl && (
            <Button asChild size="lg" className="w-full sm:w-auto rounded-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
              <a href={property.googleMapsUrl!} target="_blank" rel="noopener noreferrer">
                View on Google Maps <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto rounded-full shadow-sm hover:shadow-md transition-all duration-300"
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Address
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Right Column: Interactive Map (60%) */}
      <div className="lg:col-span-7 mt-8 lg:mt-0 relative group/map overflow-hidden rounded-[2rem] border border-border/80 bg-zinc-50 aspect-video lg:aspect-auto min-h-[300px] lg:min-h-full transition-transform duration-500 hover:scale-[1.01]">
        
        {hasMapUrl ? (
          /* Current Behaviour: Google Maps Preview Card */
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-50 p-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-border/50 flex flex-col items-center text-center max-w-sm w-full transition-transform duration-300 group-hover/map:-translate-y-2 group-hover/map:shadow-lg">
              <div className="h-16 w-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-6">
                <MapPinned className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Google Maps</h3>
              <p className="text-muted-foreground mb-8">Property Location</p>
              
              <Button asChild size="lg" className="w-full rounded-full shadow-md hover:shadow-lg bg-primary hover:bg-primary/90">
                <a href={property.googleMapsUrl!} target="_blank" rel="noopener noreferrer">
                  Open Map
                </a>
              </Button>
            </div>
            
            {/* Future Architecture Placeholders: Nearby POIs, Commute Time */}
            {/* 
            <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto">
              <POICard icon="school" title="Nearby Schools" />
              <POICard icon="hospital" title="Nearby Hospitals" />
            </div>
            */}
          </div>
        ) : hasCoordinates ? (
          /* Future Behaviour: Embedded Interactive Map */
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-100/50 p-6">
             <div className="text-center space-y-4 text-zinc-400">
               <MapIcon className="h-16 w-16 mx-auto opacity-40" />
               <p className="font-medium">Map Integration Ready</p>
               <p className="text-sm">({property.latitude}, {property.longitude})</p>
             </div>
             
             {/* Architecture Placeholder for Map Component */}
             {/* <InteractiveMap lat={property.latitude} lng={property.longitude} /> */}
          </div>
        ) : (
          /* Fallback */
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-50 p-8 text-center">
            <div className="h-24 w-24 rounded-full bg-zinc-100 flex items-center justify-center mb-6 text-zinc-300">
              <MapIcon className="h-12 w-12" />
            </div>
            <h3 className="font-heading text-xl font-bold text-zinc-400 mb-2">Map not available</h3>
            <p className="text-zinc-400 text-sm max-w-[250px]">Location details will be updated soon.</p>
          </div>
        )}
      </div>

    </div>
  );
}
