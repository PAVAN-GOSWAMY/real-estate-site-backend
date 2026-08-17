import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { PublicProperty } from "@/modules/public/types/property";
import { cn } from "@/lib/utils";

interface SimplePropertyCardProps extends Omit<React.HTMLAttributes<HTMLAnchorElement>, "property"> {
  property: PublicProperty;
}

export function SimplePropertyCard({ property, className, ...props }: SimplePropertyCardProps) {
  return (
    <Link 
      href={`/properties/${property.slug}`} 
      prefetch={false}
      className={cn(
        "group flex flex-col bg-card rounded-xl overflow-hidden hover:shadow-[0_15px_30px_rgb(0,0,0,0.12)] transition-all duration-300 border border-border/50",
        className
      )}
      {...props}
    >
      {/* 1. Image Area (Top) */}
      <div className="relative h-[220px] w-full overflow-hidden bg-muted">
        {property.thumbnail ? (
          <Image
            src={property.thumbnail}
            alt={property.title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm">
            No Image
          </div>
        )}
      </div>

      {/* 2. Title Area (Bottom - Accent Background) */}
      <div className="bg-accent p-4 flex items-center justify-center text-center h-[60px]">
        <h3 className="font-heading text-sm font-bold text-accent-foreground line-clamp-1 group-hover:opacity-90 transition-opacity">
          {property.title}
        </h3>
      </div>
    </Link>
  );
}
