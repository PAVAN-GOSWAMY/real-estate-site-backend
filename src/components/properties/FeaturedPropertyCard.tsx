import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, BedDouble, CalendarDays, Heart, Maximize2 } from "lucide-react";
import { PublicProperty } from "@/modules/public/types/property";

interface FeaturedPropertyCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "property"> {
  property: PublicProperty;
}

export function FeaturedPropertyCard({ property, className, ...props }: FeaturedPropertyCardProps) {
  const configuration = property.bedrooms ? `${property.bedrooms} BHK` : property.propertyType;

  return (
    <div 
      className={`group relative flex flex-col bg-white rounded-xl overflow-hidden border border-brand-slate/40 shadow-sm hover:shadow-md transition-all duration-300 w-full ${className || ''}`}
      {...props}
    >
      {/* 1. Image & Badges Area */}
      <div className="relative h-48 overflow-hidden bg-muted rounded-t-xl">
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
        
        {/* Gradients for text readability at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          <div className="bg-brand-navy/90 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/30">
            <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">ACTIVE</span>
          </div>
          <div className="flex gap-2">
            <button 
              className="w-8 h-8 rounded-full bg-brand-navy/70 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-navy transition-colors border border-white/10"
              onClick={(e) => e.preventDefault()}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button 
              className="w-8 h-8 rounded-full bg-brand-navy/70 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-navy hover:text-brand-red transition-colors border border-white/10"
              onClick={(e) => e.preventDefault()}
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Image Info (Price) */}
        <div className="absolute bottom-3 left-3">
          {property.priceDisplay ? (
            <p className="bg-brand-red text-white px-3 py-1 rounded-full w-fit font-bold text-[17px] tracking-tight flex items-baseline gap-1 shadow-sm">
              <span>{property.priceDisplay.replace(/\s*onwards\s*\**\s*/i, '')}</span>
              <span className="text-[11px] font-normal text-white/90 lowercase">onwards*</span>
            </p>
          ) : (
            <p className="bg-brand-red text-white px-3 py-1 rounded-full w-fit font-bold text-[17px] tracking-tight shadow-sm">Price on Request</p>
          )}
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-4">
          <p className="text-[12px] font-medium text-brand-blue mb-1 truncate">
            {property.builderName || 'Nandee Realtors'}
          </p>
          <h3 className="font-bold text-[17px] text-brand-navy line-clamp-1 leading-snug relative z-0">
            <Link href={`/properties/${property.slug}`} prefetch={false} className="hover:text-brand-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm before:absolute before:inset-0 before:z-0">
              {property.title}
            </Link>
          </h3>
          <p className="text-[13px] text-brand-blue flex items-center mt-1.5">
            <MapPin className="w-3.5 h-3.5 mr-1 text-brand-blue shrink-0" />
            <span className="truncate">{[property.locality, property.city].filter(Boolean).join(', ') || "Location on Request"}</span>
          </p>
        </div>

        {/* Footer Metrics */}
        <div className="mt-auto pt-3 border-t border-brand-slate/40 flex items-center justify-between gap-2">
          <div className="flex items-center text-[13px] text-brand-navy/80 font-medium">
            <BedDouble className="w-4 h-4 text-brand-blue mr-1.5 shrink-0" />
            <span className="truncate">{configuration}</span>
          </div>
          <div className="flex items-center text-[13px] text-brand-navy/80 font-medium">
            <CalendarDays className="w-4 h-4 text-brand-blue mr-1.5 shrink-0" />
            <span className="truncate">{property.possessionDate || "Ready to Move"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
