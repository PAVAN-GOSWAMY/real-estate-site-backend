"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Maximize2, CalendarDays } from "lucide-react";
import { PublicProperty } from "@/modules/public/types/property";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PropertyCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "property"> {
  property: PublicProperty;
}

export function PropertyCard({ property, className, ...props }: PropertyCardProps) {
  // 1. Category
  const categoryText = (property.propertyCategories && property.propertyCategories.length > 0)
    ? property.propertyCategories.join(' • ')
    : (property.propertyCategory || property.propertyType || "Residential");

  // 2. RERA ID
  const reraText = property.reraNumber
    ? `RERA ID : ${property.reraNumber}`
    : (property.isVerified ? "RERA Approved" : "RERA ID : Available on Request");

  // 3. Area Text: if carpet area mentioned -> show in numbers + Sq.ft, otherwise "Area on Req"
  const areaNumber = property.carpetArea || (property.floorPlans?.[0]?.area ? Number(property.floorPlans[0].area) : null);
  const areaText = areaNumber && areaNumber > 0
    ? `${Number(areaNumber).toLocaleString('en-IN')} Sq.ft`
    : "Area on Req";

  // 4. Configuration Text (e.g. "1, 2, 3 BHK")
  let configText = (property.configurations && property.configurations.length > 0)
    ? property.configurations.join(', ')
    : (property.bedrooms ? `${property.bedrooms} BHK` : property.propertyType);

  if (property.floorPlans && property.floorPlans.length > 0 && (!property.configurations || property.configurations.length === 0)) {
    const configs = Array.from(
      new Set(property.floorPlans.map((f) => f.configuration).filter(Boolean))
    );
    if (configs.length > 0) {
      configText = configs.join(', ');
    }
  }

  // 5. Possession Date formatting (displayed below location)
  let possessionDateDisplay = "Ready to Move";
  if (property.possessionDate && property.possessionDate.trim()) {
    const rawDate = property.possessionDate.trim();
    if (rawDate.toLowerCase().includes("ready")) {
      possessionDateDisplay = "Ready to Move";
    } else {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime()) && rawDate.includes("-")) {
        // If date is in the past, consider it Ready to Move
        if (d < new Date("2024-01-01")) {
          possessionDateDisplay = "Ready to Move";
        } else {
          possessionDateDisplay = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        }
      } else {
        possessionDateDisplay = rawDate;
      }
    }
  } else if (property.status) {
    possessionDateDisplay = (property.status === "ACTIVE" || property.status === "READY_TO_MOVE")
      ? "Ready to Move"
      : property.status.replace(/_/g, " ");
  }



  // 6. Price formatting ("price onwards *")
  let basePrice = "";
  if (property.priceDisplay) {
    basePrice = property.priceDisplay
      .replace(/\s*onwards\s*/gi, "")
      .replace(/\s*\*+\s*/g, "")
      .trim();
  } else if (property.price && property.price > 0) {
    basePrice =
      property.price >= 10000000
        ? `₹ ${(property.price / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`
        : `₹ ${(property.price / 100000).toFixed(2).replace(/\.00$/, "")} Lakhs`;
  }

  const isPriceOnRequest = !basePrice || basePrice.toLowerCase().includes("request");
  const hasOnwards = !isPriceOnRequest;
  const displayPrice = isPriceOnRequest ? "Price on Request" : `${basePrice} onwards *`;

  const locationStr = [property.locality, property.city].filter(Boolean).join(', ') || "Location on Request";

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-brand-slate/40 shadow-sm hover:shadow-md transition-all duration-300 w-full p-3 sm:p-3.5",
        className
      )}
      {...props}
    >
      {/* 1. Image Area with Category & RERA Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden rounded-xl bg-muted shrink-0">
        {property.thumbnail ? (
          <Image
            src={property.thumbnail}
            alt={property.title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400 text-xs">
            No Image Available
          </div>
        )}

        {/* Top-Left Category Ribbon Badge */}
        <div className="absolute top-2.5 left-0 z-10">
          <div className="bg-brand-navy text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-r-md shadow-md flex items-center">
            <span>{categoryText}</span>
          </div>
        </div>

        {/* Bottom Image Overlay: RERA ID */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent pt-6 pb-2 px-3 text-center z-10">
          <p className="text-[10px] sm:text-[11px] font-semibold text-white/95 tracking-wide drop-shadow-sm truncate">
            {reraText}
          </p>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="pt-3 pb-1 flex-1 flex flex-col justify-between">
        <div>
          {/* Title in Brand Red */}
          <h3 className="font-heading text-base sm:text-lg font-bold text-brand-red line-clamp-1 leading-snug">
            <Link
              href={`/properties/${property.slug}`}
              prefetch={false}
              className="hover:underline transition-colors"
            >
              {property.title}
            </Link>
          </h3>

          {/* Location with Pin */}
          <p className="text-xs sm:text-sm font-medium text-brand-navy flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 text-brand-navy shrink-0" />
            <span className="truncate underline underline-offset-2">
              {locationStr}
            </span>
          </p>

          {/* Possession Date below Location */}
          <p className="text-[11px] sm:text-xs font-medium text-brand-navy/85 flex items-center gap-1.5 mt-1">
            <CalendarDays className="w-3.5 h-3.5 text-brand-red shrink-0" />
            <span className="truncate">
              Possession: <strong className="font-bold text-brand-navy">{possessionDateDisplay}</strong>
            </span>
          </p>

          {/* 2-Column Spec Strip (Area & Config) */}
          <div className="grid grid-cols-2 divide-x divide-brand-slate/40 bg-brand-surface border border-brand-slate/40 rounded-lg py-2.5 px-2 text-center my-3">
            {/* Area */}
            <div className="flex items-center justify-center gap-1.5 px-2 min-w-0 overflow-hidden">
              <Maximize2 className="w-3.5 h-3.5 text-brand-navy shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-brand-navy whitespace-nowrap">
                {areaText}
              </span>
            </div>

            {/* BHK / Configuration */}
            <div className="flex items-center justify-center px-2 min-w-0">
              <span className="text-xs sm:text-sm font-bold text-brand-navy truncate">
                {configText}
              </span>
            </div>
          </div>

          {/* Price */}
          <p className="text-base sm:text-lg md:text-xl font-extrabold text-brand-red mb-3 tracking-tight flex items-baseline flex-wrap gap-1">
            <span>{isPriceOnRequest ? displayPrice : basePrice}</span>
            {hasOnwards && (
              <span className="text-xs sm:text-sm font-semibold tracking-normal text-brand-red">
                onwards *
              </span>
            )}
          </p>
        </div>

        {/* CTA Button */}
        <Link href={`/properties/${property.slug}`} prefetch={false} className="w-full mt-auto block">
          <Button className="w-full h-10 sm:h-11 bg-brand-red hover:bg-brand-red-hover text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-all duration-200 active:scale-[0.99] cursor-pointer">
            More Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
