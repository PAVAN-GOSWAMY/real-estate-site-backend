import Image from "next/image";
import { getSiteStats } from "@/modules/public/services/public-property.service";

import { siteConfig } from "@/config/site";

export const metadata = {
  title: `About Us | ${siteConfig.name}`,
  description: "Learn about our heritage of luxury real estate in Noida and Greater Noida.",
  openGraph: {
    title: `About Us | ${siteConfig.name}`,
    description: "Learn about our heritage of luxury real estate in Noida and Greater Noida.",
  },
};

export default async function AboutPage() {
  const stats = await getSiteStats();

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-primary/70 mix-blend-multiply" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Redefining <span className="opacity-70 italic">Luxury</span>
            </h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl mx-auto font-light">
            We are the premier destination for high-end real estate in Noida, connecting discerning buyers with exceptional properties.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              {/* [Placeholder awaiting official client data] */}
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-primary mb-6">Our Heritage</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Founded with a vision to transform the luxury real estate landscape in Noida and Greater Noida, {siteConfig.name} has grown into the most trusted name for premium properties. We believe that a home is more than just a place to live—it is a statement, a sanctuary, and a legacy. Our core philosophy is simple: <strong className="font-medium text-foreground">{siteConfig.tagline}</strong>
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                With exclusive partnerships with top-tier developers and an unparalleled understanding of the local market, we curate only the finest residences in the most sought-after neighborhoods. We ensure a seamless experience for our clients, providing end-to-end guidance from the first viewing to the final handover.
              </p>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop"
                alt="Luxury Interior"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-heading font-bold text-accent mb-2">{stats.propertyCount}+</p>
              <p className="text-primary-foreground/70 uppercase tracking-widest text-sm">Verified Projects</p>
            </div>
            <div>
              <p className="text-5xl font-heading font-bold text-accent mb-2">{stats.developerCount}+</p>
              <p className="text-primary-foreground/70 uppercase tracking-widest text-sm">Trusted Developers</p>
            </div>
            <div>
              <p className="text-5xl font-heading font-bold text-accent mb-2">{stats.happyClients}</p>
              <p className="text-primary-foreground/70 uppercase tracking-widest text-sm">Happy Clients</p>
            </div>
            <div>
              <p className="text-5xl font-heading font-bold text-accent mb-2">{stats.yearsExperience}</p>
              <p className="text-primary-foreground/70 uppercase tracking-widest text-sm">Years of Experience</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
