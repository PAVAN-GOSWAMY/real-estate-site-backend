import { MapPin, Building, Key, IndianRupee, Ruler, Calendar, LayoutTemplate } from "lucide-react";
import { PublicProperty } from "@/modules/public/types/property";
import { Badge } from "@/components/ui/badge";

interface PropertySummaryProps {
  property: PublicProperty;
}

export function PropertySummary({ property }: PropertySummaryProps) {
  return (
    <div className="space-y-8 bg-white p-6 md:p-8 rounded-2xl border border-brand-slate/50 shadow-sm">
      {/* Header Section */}
      <div className="border-b border-brand-slate/50 pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200/50">
            {property.status}
          </Badge>
          {property.isFeatured && (
            <Badge variant="secondary" className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200/50">
              Featured
            </Badge>
          )}
          {property.isVerified && (
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200/50">
              Verified
            </Badge>
          )}
          {property.reraNumber && (
            <Badge variant="outline" className="text-brand-navy border-brand-slate/50">
              RERA: {property.reraNumber}
            </Badge>
          )}
        </div>
        
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy tracking-tight mb-3">
              {property.title}
            </h1>
            <div className="flex items-center text-brand-navy/70">
              <MapPin className="h-5 w-5 mr-2 shrink-0 text-brand-blue" />
              <span className="text-base md:text-lg">{[property.sector, property.locality, property.city].filter(Boolean).join(', ') || "Location on Request"}</span>
            </div>
          </div>
          
          {property.priceDisplay && (
            <div className="xl:text-right shrink-0">
              <p className="text-sm font-medium text-brand-navy/60 uppercase tracking-wider mb-1">Starting Price</p>
              <div className="text-2xl md:text-4xl font-bold text-brand-red flex flex-wrap items-baseline gap-1.5 xl:justify-end">
                {property.priceDisplay.replace(/\s*onwards\s*\**\s*/i, '')}
                <span className="text-sm md:text-base font-normal text-brand-navy/70 lowercase">onwards*</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description Section */}
      <div className="prose prose-lg max-w-none">
        {property.shortDescription && (
          <p className="text-lg md:text-xl text-brand-navy font-medium leading-relaxed mb-6">
            {property.shortDescription}
          </p>
        )}
        <div className="text-brand-navy/80 leading-relaxed whitespace-pre-wrap">
          {property.description}
        </div>
      </div>

      {/* Key Metrics Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        <div className="bg-brand-surface p-4 rounded-xl flex flex-col gap-2">
          <Building className="w-5 h-5 text-brand-blue" />
          <div>
            <p className="text-xs font-medium text-brand-navy/60 uppercase tracking-wider">Developer</p>
            <p className="font-semibold text-brand-navy line-clamp-1" title={property.builderName}>{property.builderName}</p>
          </div>
        </div>
        
        <div className="bg-brand-surface p-4 rounded-xl flex flex-col gap-2">
          <LayoutTemplate className="w-5 h-5 text-brand-blue" />
          <div>
            <p className="text-xs font-medium text-brand-navy/60 uppercase tracking-wider">Configuration</p>
            <p className="font-semibold text-brand-navy">{property.bedrooms ? `${property.bedrooms} BHK` : property.propertyType}</p>
          </div>
        </div>

        <div className="bg-brand-surface p-4 rounded-xl flex flex-col gap-2">
          <Ruler className="w-5 h-5 text-brand-blue" />
          <div>
            <p className="text-xs font-medium text-brand-navy/60 uppercase tracking-wider">Carpet Area</p>
            <p className="font-semibold text-brand-navy">{property.carpetArea ? `${property.carpetArea} Sq.Ft.` : "On Request"}</p>
          </div>
        </div>

        <div className="bg-brand-surface p-4 rounded-xl flex flex-col gap-2">
          <Calendar className="w-5 h-5 text-brand-blue" />
          <div>
            <p className="text-xs font-medium text-brand-navy/60 uppercase tracking-wider">Possession</p>
            <p className="font-semibold text-brand-navy">{property.possessionDate || "Ready to Move"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
