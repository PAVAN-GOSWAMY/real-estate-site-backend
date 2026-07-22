import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, Container, SectionHeader, SectionTitle, SectionDescription } from "@/components/layout/wrappers";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PublicProperty } from "@/modules/public/types/property";

export function FeaturedProperties({ properties }: { properties: PublicProperty[] }) {
  if (!properties || properties.length === 0) return null;

  return (
    <Section className="bg-muted/30">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
          <SectionHeader className="mb-0">
            <SectionTitle>
              Featured Projects
            </SectionTitle>
            <SectionDescription>
              Explore handpicked residential and commercial projects across Noida and Greater Noida from trusted developers.
            </SectionDescription>
          </SectionHeader>
          <Link
            href="/properties"
            className="inline-flex items-center text-sm font-bold text-accent hover:text-primary transition-colors group whitespace-nowrap mb-1"
          >
            View All Properties
            <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Property Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
