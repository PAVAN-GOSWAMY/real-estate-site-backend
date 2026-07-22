import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, Calendar, HardHat } from "lucide-react";
import { Section, Container, SectionHeader, SectionTitle, SectionDescription } from "@/components/layout/wrappers";
import { getFeaturedBuilders } from "@/modules/public/services/public-property.service";
import { Button } from "@/components/ui/button";

export async function FeaturedBuilders() {
  const builders = await getFeaturedBuilders();

  if (!builders || builders.length === 0) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <Section className="bg-muted/30 pt-16">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <SectionHeader className="mb-0">
            <SectionTitle>Featured Developers</SectionTitle>
            <SectionDescription>
              Discover India&apos;s most trusted and reputed real estate developers shaping the future of urban living.
            </SectionDescription>
          </SectionHeader>
          <Link
            href="/properties"
            className="inline-flex items-center text-sm font-bold text-accent hover:text-primary transition-colors group whitespace-nowrap mb-1"
          >
            Explore All Projects
            <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {builders.map((builder) => (
            <div 
              key={builder.id} 
              className="group bg-card border border-border/40 rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl border border-border/50 bg-white flex items-center justify-center p-2 shrink-0 overflow-hidden relative">
                    {builder.logoUrl ? (
                      <Image
                        src={builder.logoUrl}
                        alt={`${builder.name} logo`}
                        fill
                        className="object-contain p-2"
                        sizes="64px"
                      />
                    ) : (
                      <HardHat className="w-8 h-8 text-muted-foreground/50" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-primary group-hover:text-accent transition-colors">
                      {builder.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />
                        {builder.activePropertyCount} Projects
                      </span>
                      {builder.establishedYear && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {currentYear - builder.establishedYear} Yrs Exp
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {builder.description && (
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1">
                    {builder.description}
                  </p>
                )}

                <div className="mt-auto pt-4 border-t border-border/40">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between hover:bg-accent hover:text-accent-foreground group/btn"
                    asChild
                  >
                    <Link href={`/properties?builder=${builder.slug}`}>
                      View Projects
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
