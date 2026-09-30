"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Section, Container } from "@/components/layout/wrappers";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";

interface LocationItem {
  name: string;
  slug: string;
  image: string;
  propertyCount: number;
}

function CarouselControls({ length }: { length: number }) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();
  
  

  return (
    <div className="flex items-center justify-center mt-10 gap-4">
      <Button 
        variant="outline" 
        size="icon" 
        className="h-12 w-12 rounded-xl border-brand-slate text-brand-navy bg-white hover:bg-brand-surface hover:text-brand-navy-hover shadow-sm disabled:opacity-50"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Link href="/locations">
        <Button variant="outline" className="h-12 rounded-xl px-8 text-[15px] font-bold border-brand-slate text-brand-red bg-white hover:bg-brand-surface shadow-sm">
          View All Locations
        </Button>
      </Link>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-12 w-12 rounded-xl border-brand-slate text-brand-navy bg-white hover:bg-brand-surface hover:text-brand-navy-hover shadow-sm disabled:opacity-50"
        onClick={scrollNext}
        disabled={!canScrollNext}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}


const cardVariants = {
  hidden: (i: number) => {
    let xOffset = 0;
    const mod = i % 4;
    if (mod === 0) xOffset = 150;
    else if (mod === 1) xOffset = 50;
    else if (mod === 2) xOffset = -50;
    else if (mod === 3) xOffset = -150;
    return { opacity: 0, x: xOffset, y: 100, scale: 0.9 };
  },
  visible: (i: number) => ({
    opacity: 1, x: 0, y: 0, scale: 1,
    transition: { type: 'spring' as const, bounce: 0.3, duration: 0.8, delay: (i % 4) * 0.15 }
  })
};
export function TopLocations({ locations }: { locations: LocationItem[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  if (!locations || locations.length === 0) return null;

  return (
    <Section className="bg-brand-surface py-16 border-t border-brand-slate/50">
      <Container>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-brand-navy mb-2">
            Our Footprints
          </h2>
          <p className="text-[15px] font-medium text-brand-blue">
            Locations where we help you find the perfect property
          </p>
        </div>

        <Carousel
          opts={{ align: "start", loop: true }} plugins={[plugin.current]} onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}
          className="w-full"
        >
          <CarouselContent className="-ml-4 md:-ml-6 pb-4">
            {locations.map((location, i) => (
              <CarouselItem key={location.slug} className="pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <motion.div custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={cardVariants} className="h-full">
                  <Link href={`/locations/${location.slug}`} className="group block h-full">
                  <div className="bg-white rounded-xl overflow-hidden border border-brand-slate/40 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full p-2 pb-5">
                    <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={location.image || '/placeholder.jpg'}
                        alt={location.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="px-4 flex items-center justify-center gap-2 mt-auto">
                      <MapPin className="w-4 h-4 text-brand-blue" />
                      <h3 className="font-bold text-brand-navy text-[15px]">{location.name}</h3>
                    </div>
                  </div>
                </Link>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselControls length={locations.length} />
        </Carousel>
      </Container>
    </Section>
  );
}
