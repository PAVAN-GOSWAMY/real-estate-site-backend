"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { Section, Container } from "@/components/layout/wrappers";
import { FeaturedPropertyCard } from "@/components/properties/FeaturedPropertyCard";
import { PublicProperty } from "@/modules/public/types/property";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";

function CarouselControls({ propertiesLength }: { propertiesLength: number }) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();
  
  

  return (
    <div className="flex items-center justify-center mt-10 gap-4">
      <Button 
        variant="outline" 
        size="icon" 
        className="h-12 w-12 rounded-xl border-slate-200 text-slate-400 bg-white hover:bg-slate-50 hover:text-slate-700 shadow-sm disabled:opacity-50"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Link href="/properties?featured=true">
        <Button variant="outline" className="h-12 rounded-xl px-8 text-[15px] font-bold border-slate-200 text-primary bg-white hover:bg-slate-50 shadow-sm">
          View All Properties
        </Button>
      </Link>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-12 w-12 rounded-xl border-slate-200 text-slate-400 bg-white hover:bg-slate-50 hover:text-slate-700 shadow-sm disabled:opacity-50"
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

export function FeaturedProperties({ properties }: { properties: PublicProperty[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  if (!properties || properties.length === 0) return null;

  return (
    <Section className="bg-[#faf9f6] py-16">
      <Container>
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Featured Properties
          </h2>
          <p className="text-[15px] font-medium text-slate-500">
            Handpicked residential and commercial properties for you
          </p>
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
          <CarouselContent className="-ml-4 md:-ml-6 pb-4">
            {properties.map((property, i) => (
              <CarouselItem key={property.id} className="pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <motion.div
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={cardVariants}
                  className="h-full"
                >
                  <FeaturedPropertyCard property={property} />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselControls propertiesLength={properties.length} />
        </Carousel>
      </Container>
    </Section>
  );
}
