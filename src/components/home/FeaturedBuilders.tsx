import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2 } from "lucide-react";
import { getFeaturedBuilders } from "@/modules/public/services/public-property.service";

export async function FeaturedBuilders() {
  const builders = await getFeaturedBuilders();

  if (!builders || builders.length === 0) {
    return null;
  }

  // Duplicate items for continuous seamless infinite marquee scroll
  const marqueeItems = [...builders, ...builders, ...builders, ...builders];

  return (
    <section className="bg-brand-surface border-y border-brand-slate/40 py-12 md:py-16 overflow-hidden relative">
      {/* Left & Right gradient edge fades */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 md:w-40 bg-gradient-to-r from-brand-surface via-brand-surface/85 to-transparent z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 md:w-40 bg-gradient-to-l from-brand-surface via-brand-surface/85 to-transparent z-10"
      />

      <div className="container mx-auto px-4 mb-8 sm:mb-10 text-center">
        {/* Kicker in Brand Red */}
        <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-brand-red mb-2.5">
          Our Elite Partners
        </p>

        {/* Heading in Brand Navy */}
        <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-brand-navy max-w-4xl mx-auto leading-snug sm:leading-tight">
          Powering Real Estate Success With Trusted Alliances.
        </h2>
      </div>

      {/* Marquee Track */}
      <div className="relative w-full overflow-hidden">
        <div className="animate-marquee-scroll flex items-center gap-6 sm:gap-8 py-2">
          {marqueeItems.map((builder, idx) => {
            const builderLink = builder.slug
              ? `/properties?builder=${builder.slug}`
              : "/properties";

            return (
              <Link
                key={`${builder.id}-${idx}`}
                href={builderLink}
                prefetch={false}
                className="group/item shrink-0 flex items-center justify-center h-20 sm:h-24 min-w-[200px] sm:min-w-[240px] px-6 sm:px-8 bg-white rounded-2xl border border-brand-slate/40 shadow-xs hover:shadow-md hover:border-brand-red/50 hover:-translate-y-0.5 transition-all duration-300"
                title={`Explore ${builder.name} projects`}
              >
                {builder.logoUrl ? (
                  <div className="relative w-full h-12 sm:h-14 flex items-center justify-center">
                    <Image
                      src={builder.logoUrl}
                      alt={`${builder.name} logo`}
                      fill
                      className="object-contain filter grayscale group-hover/item:grayscale-0 transition-all duration-300"
                      sizes="240px"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-surface border border-brand-slate/40 flex items-center justify-center shrink-0 group-hover/item:bg-brand-red/10 transition-colors">
                      <Building2 className="w-4 h-4 text-brand-navy group-hover/item:text-brand-red transition-colors" />
                    </div>
                    <span className="font-heading text-sm sm:text-base font-bold text-brand-navy tracking-tight group-hover/item:text-brand-red transition-colors whitespace-nowrap">
                      {builder.name}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Subtle Link to All Builders */}
      <div className="text-center mt-8">
        <Link
          href="/builders"
          prefetch={false}
          className="inline-flex items-center text-xs sm:text-sm font-bold text-brand-navy hover:text-brand-red transition-colors group"
        >
          <span>Explore All Developer Partners</span>
          <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
