import * as React from "react";
import { Location } from "@/types";
import { getFilteredProperties } from "@/core/queries/properties";
import { PropertyCard } from "@/components/properties/PropertyCard";

interface LocationProjectsProps {
  location: Location;
}

export async function LocationProjects({ location }: LocationProjectsProps) {
  // Find projects that match this location's featured list or city/micromarket
  const { properties } = await getFilteredProperties({ location: location.slug });
  const locationProjects = properties;

  if (locationProjects.length === 0) return null;

  return (
    <section className="py-12 bg-accent/5">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold text-foreground">Featured Projects in {location.name}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locationProjects.slice(0, 6).map((project) => (
            <PropertyCard key={project.id} property={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
