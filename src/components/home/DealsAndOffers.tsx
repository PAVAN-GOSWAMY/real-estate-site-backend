"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { Section, Container } from "@/components/layout/wrappers";
import { Banner } from "@/modules/banners/types";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";

function CarouselControls({ length }: { length: number }) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();
  
  if (length <= 1) return null;

  return (
    <div className="flex items-center justify-center mt-8 gap-4">
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-10 rounded-xl border-brand-slate text-brand-navy bg-white hover:bg-brand-surface hover:text-brand-red shadow-sm disabled:opacity-50"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Previous deals"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-10 rounded-xl border-brand-slate text-brand-navy bg-white hover:bg-brand-surface hover:text-brand-red shadow-sm disabled:opacity-50"
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Next deals"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}

const cardVariants = {
  hidden: (i: number) => {
    let xOffset = 0;
    const mod = i % 2;
    if (mod === 0) xOffset = 100;
    else if (mod === 1) xOffset = -100;
    return { opacity: 0, x: xOffset, y: 50, scale: 0.95 };
  },
  visible: (i: number) => ({
    opacity: 1, x: 0, y: 0, scale: 1,
    transition: { type: 'spring' as const, bounce: 0.3, duration: 0.8, delay: (i % 2) * 0.15 }
  })
};

export function DealsAndOffers({ banners }: { banners: Banner[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 4500, stopOnInteraction: true })
  );

  if (!banners || banners.length === 0) return null;

  return (
    <Section className="bg-white py-12 md:py-16">
      <Container>
        <div className="mb-8 text-center">
          <p className="text-[13px] font-bold text-brand-red tracking-wider uppercase mb-1">
            Recent
          </p>
          <h2 className="text-3xl font-bold text-brand-navy">
            DEALS & OFFERS
          </h2>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          className="w-full"
        >
          <CarouselContent className="-ml-4 md:-ml-6 pb-2">
            {banners.map((banner, i) => (
              <CarouselItem key={banner.id} className="pl-4 md:pl-6 basis-full md:basis-1/2">
                <motion.div
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={cardVariants}
                  className="h-full"
                >
                  {banner.linkUrl ? (
                    <Link href={banner.linkUrl} className="block relative w-full aspect-[21/9] md:aspect-[2/1] lg:aspect-[21/9] rounded-2xl overflow-hidden group shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                      <Image 
                        src={banner.imageUrl} 
                        alt={banner.title || "Promotional banner"} 
                        fill 
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    </Link>
                  ) : (
                    <div className="relative w-full aspect-[21/9] md:aspect-[2/1] lg:aspect-[21/9] rounded-2xl overflow-hidden shadow-sm">
                      <Image 
                        src={banner.imageUrl} 
                        alt={banner.title || "Promotional banner"} 
                        fill 
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselControls length={banners.length} />
        </Carousel>
      </Container>
    </Section>
  );
}
