import { Property } from "@/types/property";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { SimplePropertyCard } from "@/components/properties/SimplePropertyCard";
import { PropertySort } from "./PropertySort";
import { PropertyPagination } from "./PropertyPagination";
import { PropertyEmptyState } from "./PropertyEmptyState";
import { getFilteredProperties, PropertySearchParams } from "@/core/queries/properties";

interface PropertyGridProps {
  searchParams: PropertySearchParams;
}

export async function PropertyGrid({ searchParams }: PropertyGridProps) {
  const { properties, totalCount, totalPages } = await getFilteredProperties(searchParams);
  const currentPage = parseInt(searchParams.page || "1");
  const isSearchActive = !!searchParams.q;

  if (properties.length === 0) {
    return <PropertyEmptyState searchQuery={searchParams.q} />;
  }

  return (
    <div className="w-full">
      {/* Header: Results count and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-lg text-muted-foreground font-medium">
          Showing <span className="text-foreground font-bold">{totalCount}</span> properties
        </h2>
        <PropertySort />
      </div>

      {/* Grid */}
      <div className={
        isSearchActive 
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
      }>
        {properties.map((property) => (
          isSearchActive ? (
            <SimplePropertyCard key={property.id} property={property} />
          ) : (
            <PropertyCard key={property.id} property={property} />
          )
        ))}
      </div>

      {/* Pagination */}
      <PropertyPagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
}
