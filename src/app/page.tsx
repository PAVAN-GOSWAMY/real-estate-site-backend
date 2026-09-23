import { Hero } from "@/components/home/Hero";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { PremiumProjects } from "@/components/home/PremiumProjects";
import { TopLocations } from "@/components/home/TopLocations";
import { FeaturedBuilders } from "@/components/home/FeaturedBuilders";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { BlogSection } from "@/components/home/BlogSection";
import { CallToAction } from "@/components/home/CallToAction";
import { getTopLocations, getSiteStats, getPublicFilterOptions } from "@/modules/public/services/public-property.service";
import { getFilteredProperties } from "@/core/queries/properties";
import { BlogsService } from "@/modules/blogs/services/blogs.service";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { Section, Container, SectionHeader, SectionTitle } from "@/components/layout/wrappers";

export const revalidate = 90;

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function Home(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  
  // Check if we are in search mode
  const isSearchActive = Object.keys(searchParams || {}).some(key => 
    ['q', 'city', 'location', 'type', 'config', 'budget', 'builder'].includes(key)
  );

  const [locations, stats, filterOptions, featuredData, premiumData, latestBlogs] = await Promise.all([
    getTopLocations(),
    getSiteStats(),
    getPublicFilterOptions(),
    getFilteredProperties({ isFeatured: true, limit: 12, sort: "recommended" }),
    getFilteredProperties({ isPremium: true, limit: 12, sort: "price-desc" }),
    BlogsService.getLatestBlogs(4)
  ]);

  return (
    <>
      <Hero stats={stats} filterOptions={filterOptions} />
      
      {isSearchActive ? (
        <Section className="bg-muted/10 min-h-[500px]">
          <Container>
            <SectionHeader className="mb-8">
              <SectionTitle>Search Results</SectionTitle>
            </SectionHeader>
            <PropertyGrid searchParams={searchParams} />
          </Container>
        </Section>
      ) : (
        <>
          <FeaturedProperties properties={featuredData.properties} />
          <PremiumProjects properties={premiumData.properties} />
          <TopLocations locations={locations} />
          <Testimonials />
          <BlogSection blogs={latestBlogs.map(b => ({ id: b.id, title: b.title, slug: b.slug, excerpt: b.excerpt || "", date: b.publishedAt ? new Date(b.publishedAt).toLocaleDateString() : "Draft", image: b.coverImage || "/placeholder.jpg" }))} />
        </>
      )}
      
      <WhyChooseUs />
      <CallToAction />
    </>
  );
}
