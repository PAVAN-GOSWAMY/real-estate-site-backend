import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, Container, SectionHeader, SectionTitle, SectionDescription } from "@/components/layout/wrappers";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PublicProperty } from "@/modules/public/types/property";

export function PremiumProjects({ properties }: { properties: PublicProperty[] }) {
  if (!properties || properties.length === 0) {
    return null; // Do not render if no premium properties exist
  }

  return (
    <Section className="bg-surface border-t border-border/50">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
          <SectionHeader className="mb-0">
            <SectionTitle>
              Premium Projects
            </SectionTitle>
            <SectionDescription>
              Discover ultra-luxury living spaces and elite commercial properties curated for exceptional lifestyles.
            </SectionDescription>
          </SectionHeader>
          <Link
            href="/properties?minPrice=30000000"
            className="inline-flex items-center text-sm font-bold text-accent hover:text-primary transition-colors group whitespace-nowrap mb-1"
          >
            Explore Luxury Properties
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
