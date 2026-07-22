import { Hero } from "@/components/home/Hero";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { PremiumProjects } from "@/components/home/PremiumProjects";
import { TopLocations } from "@/components/home/TopLocations";
import { FeaturedBuilders } from "@/components/home/FeaturedBuilders";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { CallToAction } from "@/components/home/CallToAction";
import { getTopLocations, getSiteStats, getPublicFilterOptions } from "@/modules/public/services/public-property.service";
import { getFilteredProperties } from "@/core/queries/properties";

export default async function Home() {
  const [locations, stats, filterOptions, featuredData, premiumData] = await Promise.all([
    getTopLocations(),
    getSiteStats(),
    getPublicFilterOptions(),
    getFilteredProperties({ isFeatured: true, limit: 6, sort: "recommended" }),
    getFilteredProperties({ isPremium: true, limit: 3, sort: "price-desc" })
  ]);

  return (
    <>
      <Hero stats={stats} filterOptions={filterOptions} />
      <FeaturedProperties properties={featuredData.properties} />
      <PremiumProjects properties={premiumData.properties} />
      <TopLocations locations={locations} />
      <FeaturedBuilders />
      <WhyChooseUs />
      <Testimonials />
      <CallToAction />
    </>
  );
}
