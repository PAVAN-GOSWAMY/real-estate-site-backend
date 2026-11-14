"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { PropertyConfiguration } from "@/modules/properties/types/configuration";
import { PropertyFloorPlan } from "@/modules/properties/types/assets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Ruler,
  Bed,
  Bath,
  Compass,
  Calendar,
  Car,
  Layers,
  PhoneCall,
  Maximize2,
  FileText,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface PropertyConfigurationsViewerProps {
  configurations?: PropertyConfiguration[];
  floorPlans?: PropertyFloorPlan[];
  propertyTitle: string;
}

// Compact card price e.g. "₹20 L" or "₹1.25 Cr"
function formatCompactPrice(price: number | null | undefined): string {
  if (!price || price <= 0) return "On Req";
  if (price >= 10000000) {
    const cr = price / 10000000;
    return `\u20B9${cr.toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  if (price >= 100000) {
    const lakhs = price / 100000;
    return `\u20B9${lakhs.toFixed(2).replace(/\.00$/, '')} L`;
  }
  return `\u20B9${price.toLocaleString('en-IN')}`;
}

// Full detailed price e.g. "₹20 Lakhs onwards"
function formatFullPrice(price: number | null | undefined): string {
  if (!price || price <= 0) return "Price on Request";
  if (price >= 10000000) {
    const cr = price / 10000000;
    return `\u20B9 ${cr.toFixed(2).replace(/\.00$/, "")} Cr onwards *`;
  }
  if (price >= 100000) {
    const lakhs = price / 100000;
    return `\u20B9 ${lakhs.toFixed(2).replace(/\.00$/, "")} Lakhs onwards *`;
  }
  return `\u20B9 ${price.toLocaleString("en-IN")} onwards *`;
}

function isCommercialType(cfgType: string): boolean {
  const lower = cfgType.toLowerCase();
  return (
    lower.includes("office") ||
    lower.includes("retail") ||
    lower.includes("shop") ||
    lower.includes("commercial") ||
    lower.includes("showroom") ||
    lower.includes("warehouse")
  );
}

export function PropertyConfigurationsViewer({
  configurations = [],
  floorPlans = [],
  propertyTitle,
}: PropertyConfigurationsViewerProps) {
  // Sort configurations to find the lowest-priced configuration by default
  const defaultIndex = useMemo(() => {
    if (!configurations || configurations.length === 0) return 0;
    let minPriceIndex = 0;
    let minPrice = Infinity;
    for (let i = 0; i < configurations.length; i++) {
      const p = configurations[i].basePrice;
      if (typeof p === "number" && p > 0 && p < minPrice) {
        minPrice = p;
        minPriceIndex = i;
      }
    }
    return minPriceIndex;
  }, [configurations]);

  const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex);

  // Sync selected index when configurations change
  useEffect(() => {
    setSelectedIndex(defaultIndex);
  }, [defaultIndex]);

  const activeConfig = configurations[selectedIndex] || configurations[0];

  // Notify page/inquiry form of the selected configuration
  useEffect(() => {
    if (activeConfig?.configurationType) {
      window.dispatchEvent(
        new CustomEvent("selected-configuration-changed", {
          detail: {
            configurationType: activeConfig.configurationType,
            basePrice: activeConfig.basePrice,
            carpetArea: activeConfig.carpetArea,
          },
        })
      );
    }
  }, [activeConfig]);

  if (!configurations || configurations.length === 0) {
    return null;
  }

  const isCommercial = isCommercialType(activeConfig.configurationType);

  // Find matching floor plans for this configuration
  const matchingFloorPlans = floorPlans.filter(
    (fp) =>
      (activeConfig.id && (fp as any).configuration_id === activeConfig.id) ||
      fp.configuration.toLowerCase() === activeConfig.configurationType.toLowerCase() ||
      fp.name.toLowerCase().includes(activeConfig.configurationType.toLowerCase())
  );

  const handleSelect = (idx: number) => {
    setSelectedIndex(idx);
  };

  const scrollToInquiry = () => {
    const inquiryCard = document.getElementById("inquiry-card") || document.querySelector("form");
    if (inquiryCard) {
      inquiryCard.scrollIntoView({ behavior: "smooth" });
      const nameInput = document.getElementById("name");
      if (nameInput) (nameInput as HTMLElement).focus();
    }
  };

  return (
    <section id="available-configurations" className="space-y-6">
      {/* 1. Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-brand-slate/40 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
              AVAILABLE CONFIGURATIONS
            </span>
            <Badge variant="outline" className="text-brand-navy border-brand-slate/60 text-[11px] font-semibold">
              {configurations.length} {configurations.length === 1 ? "Option" : "Options"}
            </Badge>
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-navy">
            {isCommercial ? "Choose Your Ideal Space" : "Choose Your Ideal Home"}
          </h2>
          <p className="text-sm text-brand-navy/70 mt-1">
            Explore available layouts, starting prices and specifications at this project.
          </p>
        </div>
      </div>

      {/* 2. Clickable Visual Configuration Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {configurations.map((cfg, idx) => {
          const isSelected = idx === selectedIndex;
          const isComm = isCommercialType(cfg.configurationType);
          const compactPrice = formatCompactPrice(cfg.basePrice);

          return (
            <div
              key={cfg.id || idx}
              onClick={() => handleSelect(idx)}
              className={`group relative flex flex-col justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 bg-white ${
                isSelected
                  ? "border-2 border-brand-red ring-2 ring-brand-red/15 shadow-md -translate-y-0.5"
                  : "border border-brand-slate/50 hover:border-brand-slate hover:shadow-sm"
              }`}
            >
              {/* Card Top: Type & Selected Badge */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="font-heading text-base sm:text-lg font-bold text-brand-navy">
                  {cfg.configurationType}
                </span>
                {isSelected ? (
                  <Badge className="bg-brand-red text-white text-[10px] font-semibold px-2 py-0.5 h-5 shadow-xs">
                    Selected
                  </Badge>
                ) : (
                  <span className="text-[11px] text-brand-navy/40 group-hover:text-brand-blue font-medium transition-colors">
                    Click to view
                  </span>
                )}
              </div>

              {/* Card Middle: Price */}
              <div className="my-1.5">
                <div className="text-xl sm:text-2xl font-extrabold text-brand-navy leading-none">
                  {compactPrice}
                </div>
                <span className="text-[11px] font-medium text-brand-navy/60 uppercase tracking-wider">
                  Onwards
                </span>
              </div>

              {/* Card Bottom: Highlights Strip */}
              <div className="pt-2 mt-2 border-t border-brand-slate/30 text-xs text-brand-navy/70 space-y-0.5">
                <div className="font-semibold text-brand-navy">
                  {cfg.carpetArea ? `${cfg.carpetArea} sq.ft.` : "Area on Req"}
                  <span className="font-normal text-brand-navy/60 ml-1 text-[11px]">Carpet area</span>
                </div>
                {!isComm ? (
                  <div className="text-[11px] text-brand-navy/60 flex items-center gap-1.5">
                    <span>{cfg.bedrooms !== null && cfg.bedrooms !== undefined ? `${cfg.bedrooms} Bed` : "Bed on req"}</span>
                    <span>•</span>
                    <span>{cfg.bathrooms !== null && cfg.bathrooms !== undefined ? `${cfg.bathrooms} Bath` : "Bath on req"}</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-brand-navy/60 flex items-center gap-1.5">
                    <span>{cfg.parkingSlots ? `${cfg.parkingSlots} Parking` : "Parking on req"}</span>
                    {cfg.floorNumber && (
                      <>
                        <span>•</span>
                        <span>Floor {cfg.floorNumber}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Selected Configuration Detailed Specifications Panel */}
      <div className="bg-white rounded-2xl border border-brand-slate/50 p-6 md:p-8 shadow-sm space-y-6">
        {/* Selected Config Header with Price & Availability */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-slate/30 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-navy/60">
                Selected Configuration:
              </span>
              <span className="text-lg font-bold text-brand-navy">
                {activeConfig.configurationType}
              </span>
              <Badge
                variant="secondary"
                className={
                  activeConfig.availability === 'SOLD_OUT'
                    ? "bg-rose-50 text-rose-700 border-rose-200 text-[11px]"
                    : activeConfig.availability === 'RESERVED'
                    ? "bg-amber-50 text-amber-700 border-amber-200 text-[11px]"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]"
                }
              >
                {activeConfig.availability === 'SOLD_OUT'
                  ? 'Sold Out'
                  : activeConfig.availability === 'RESERVED'
                  ? 'Few Units Left'
                  : 'Available'}
              </Badge>
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-brand-red">
              {formatFullPrice(activeConfig.basePrice)}
            </div>
            <p className="text-xs text-brand-navy/60 mt-0.5">
              Starting price for selected configuration. Final pricing depends on floor height, view, and payment schedule.
            </p>
          </div>

          <Button
            type="button"
            onClick={scrollToInquiry}
            className="bg-brand-red hover:bg-brand-red-hover text-white font-semibold text-sm px-6 py-2.5 h-11 rounded-xl shadow-sm gap-2 shrink-0 self-start sm:self-auto"
          >
            <PhoneCall className="h-4 w-4" />
            Enquire About This Configuration
          </Button>
        </div>

        {/* Specifications Grid */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy/70 mb-3 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-brand-blue" />
            Configuration Specifications
          </h4>

          {!isCommercial ? (
            /* Residential Specifications */
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-brand-surface p-3.5 rounded-xl border border-brand-slate/30">
                <p className="text-[11px] font-semibold uppercase text-brand-navy/60">Bedrooms</p>
                <p className="text-base font-bold text-brand-navy mt-0.5">
                  {activeConfig.bedrooms !== null && activeConfig.bedrooms !== undefined ? activeConfig.bedrooms : "N/A"}
                </p>
              </div>

              <div className="bg-brand-surface p-3.5 rounded-xl border border-brand-slate/30">
                <p className="text-[11px] font-semibold uppercase text-brand-navy/60">Bathrooms</p>
                <p className="text-base font-bold text-brand-navy mt-0.5">
                  {activeConfig.bathrooms !== null && activeConfig.bathrooms !== undefined ? activeConfig.bathrooms : "N/A"}
                </p>
              </div>

              <div className="bg-brand-surface p-3.5 rounded-xl border border-brand-slate/30">
                <p className="text-[11px] font-semibold uppercase text-brand-navy/60">Balconies</p>
                <p className="text-base font-bold text-brand-navy mt-0.5">
                  {activeConfig.balconies !== null && activeConfig.balconies !== undefined ? activeConfig.balconies : "N/A"}
                </p>
              </div>

              <div className="bg-brand-surface p-3.5 rounded-xl border border-brand-slate/30">
                <p className="text-[11px] font-semibold uppercase text-brand-navy/60">Parking</p>
                <p className="text-base font-bold text-brand-navy mt-0.5">
                  {activeConfig.parkingSlots !== null && activeConfig.parkingSlots !== undefined
                    ? `${activeConfig.parkingSlots} ${activeConfig.parkingSlots === 1 ? 'Slot' : 'Slots'}`
                    : "1 Slot"}
                </p>
              </div>

              <div className="bg-brand-surface p-3.5 rounded-xl border border-brand-slate/30">
                <p className="text-[11px] font-semibold uppercase text-brand-navy/60">Super Built-up Area</p>
                <p className="text-base font-bold text-brand-navy mt-0.5">
                  {activeConfig.superBuiltUpArea ? `${activeConfig.superBuiltUpArea.toLocaleString('en-IN')} sq.ft.` : "On Request"}
                </p>
              </div>

              <div className="bg-brand-surface p-3.5 rounded-xl border border-brand-slate/30">
                <p className="text-[11px] font-semibold uppercase text-brand-navy/60">Carpet Area</p>
                <p className="text-base font-bold text-brand-navy mt-0.5">
                  {activeConfig.carpetArea ? `${activeConfig.carpetArea.toLocaleString('en-IN')} sq.ft.` : "On Request"}
                </p>
              </div>

              <div className="bg-brand-surface p-3.5 rounded-xl border border-brand-slate/30">
                <p className="text-[11px] font-semibold uppercase text-brand-navy/60">Facing</p>
                <p className="text-base font-bold text-brand-navy mt-0.5">
                  {activeConfig.facing || "Multiple Options"}
                </p>
              </div>

              <div className="bg-brand-surface p-3.5 rounded-xl border border-brand-slate/30">
                <p className="text-[11px] font-semibold uppercase text-brand-navy/60">Construction</p>
                <p className="text-base font-bold text-brand-navy mt-0.5">
                  {activeConfig.constructionStatus
                    ? activeConfig.constructionStatus.replace(/_/g, ' ')
                    : "Under Construction"}
                </p>
              </div>
            </div>
          ) : (
            /* Commercial / Office Specifications */
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-brand-surface p-3.5 rounded-xl border border-brand-slate/30">
                <p className="text-[11px] font-semibold uppercase text-brand-navy/60">Carpet Area</p>
                <p className="text-base font-bold text-brand-navy mt-0.5">
                  {activeConfig.carpetArea ? `${activeConfig.carpetArea.toLocaleString('en-IN')} sq.ft.` : "On Request"}
                </p>
              </div>

              <div className="bg-brand-surface p-3.5 rounded-xl border border-brand-slate/30">
                <p className="text-[11px] font-semibold uppercase text-brand-navy/60">Super Built-up</p>
                <p className="text-base font-bold text-brand-navy mt-0.5">
                  {activeConfig.superBuiltUpArea ? `${activeConfig.superBuiltUpArea.toLocaleString('en-IN')} sq.ft.` : "On Request"}
                </p>
              </div>

              <div className="bg-brand-surface p-3.5 rounded-xl border border-brand-slate/30">
                <p className="text-[11px] font-semibold uppercase text-brand-navy/60">Floor Level</p>
                <p className="text-base font-bold text-brand-navy mt-0.5">
                  {activeConfig.floorNumber ? `Floor ${activeConfig.floorNumber}` : "Multiple Floors"}
                </p>
              </div>

              <div className="bg-brand-surface p-3.5 rounded-xl border border-brand-slate/30">
                <p className="text-[11px] font-semibold uppercase text-brand-navy/60">Parking</p>
                <p className="text-base font-bold text-brand-navy mt-0.5">
                  {activeConfig.parkingSlots ? `${activeConfig.parkingSlots} Dedicated Slots` : "Available"}
                </p>
              </div>

              <div className="bg-brand-surface p-3.5 rounded-xl border border-brand-slate/30">
                <p className="text-[11px] font-semibold uppercase text-brand-navy/60">Facing</p>
                <p className="text-base font-bold text-brand-navy mt-0.5">
                  {activeConfig.facing || "Road Facing"}
                </p>
              </div>

              <div className="bg-brand-surface p-3.5 rounded-xl border border-brand-slate/30">
                <p className="text-[11px] font-semibold uppercase text-brand-navy/60">Possession Date</p>
                <p className="text-base font-bold text-brand-navy mt-0.5">
                  {activeConfig.possessionDate
                    ? new Date(activeConfig.possessionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    : "Ready to Move"}
                </p>
              </div>

              <div className="bg-brand-surface p-3.5 rounded-xl border border-brand-slate/30">
                <p className="text-[11px] font-semibold uppercase text-brand-navy/60">Construction Status</p>
                <p className="text-base font-bold text-brand-navy mt-0.5">
                  {activeConfig.constructionStatus
                    ? activeConfig.constructionStatus.replace(/_/g, ' ')
                    : "Ready to Move"}
                </p>
              </div>

              <div className="bg-brand-surface p-3.5 rounded-xl border border-brand-slate/30">
                <p className="text-[11px] font-semibold uppercase text-brand-navy/60">Base Price</p>
                <p className="text-base font-bold text-brand-red mt-0.5">
                  {formatCompactPrice(activeConfig.basePrice)} Onwards *
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 4. Floor Plans for Selected Configuration */}
        <div className="pt-4 border-t border-brand-slate/30 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-heading font-bold text-base text-brand-navy">
                Floor Plans
              </h4>
              <p className="text-xs text-brand-navy/60">
                {activeConfig.configurationType} layouts and blueprints
              </p>
            </div>
          </div>

          {matchingFloorPlans.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {matchingFloorPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="group relative bg-brand-surface rounded-xl overflow-hidden border border-brand-slate/40 p-3"
                >
                  <div className="relative h-48 sm:h-56 w-full bg-white rounded-lg overflow-hidden border border-brand-slate/20">
                    <Image
                      src={plan.imageUrl}
                      alt={plan.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-brand-navy">{plan.name}</p>
                      {plan.area && (
                        <p className="text-xs text-brand-navy/60">
                          {plan.area} {plan.unit}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={scrollToInquiry}
                      className="text-brand-red hover:text-white hover:bg-brand-red text-xs font-semibold h-8"
                    >
                      Enquire
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-brand-surface/60 border border-dashed border-brand-slate/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-brand-blue/60 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-brand-navy">
                    {activeConfig.configurationType} Floor Plan
                  </p>
                  <p className="text-xs text-brand-navy/60">
                    Architectural blueprint for this layout is available on request.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={scrollToInquiry}
                className="text-xs border-brand-navy/30 text-brand-navy hover:bg-brand-surface shrink-0"
              >
                Request Blueprint
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Enquire CTA */}
        <div className="pt-2 sm:hidden">
          <Button
            type="button"
            onClick={scrollToInquiry}
            className="w-full bg-brand-red hover:bg-brand-red-hover text-white font-semibold py-3 h-auto rounded-xl shadow-sm text-sm"
          >
            Enquire About {activeConfig.configurationType}
          </Button>
        </div>
      </div>
    </section>
  );
}
