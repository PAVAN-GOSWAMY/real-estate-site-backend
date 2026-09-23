"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { Section, Container } from "@/components/layout/wrappers";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import { testimonials } from "@/data/testimonials";

function CarouselControls({ length }: { length: number }) {
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
      <Link href="/about#testimonials">
        <Button variant="outline" className="h-12 rounded-xl px-8 text-[15px] font-bold border-slate-200 text-primary bg-white hover:bg-slate-50 shadow-sm">
          View All Testimonials
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
    if (i % 3 === 0) xOffset = 150;
    else if (i % 3 === 2) xOffset = -150;
    return { opacity: 0, x: xOffset, y: 100, scale: 0.9 };
  },
  visible: (i: number) => ({
    opacity: 1, x: 0, y: 0, scale: 1,
    transition: { type: 'spring' as const, bounce: 0.3, duration: 0.8, delay: (i % 3) * 0.15 }
  })
};

export function Testimonials() {
  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <Section className="bg-[#faf9f6] py-16">
      <Container>
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            What Our Clients Say
          </h2>
          <p className="text-[15px] font-medium text-slate-500">
            Real stories from happy homeowners and investors
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="-ml-4 md:-ml-6 pb-4">
            {testimonials.map((testimonial, i) => (
              <CarouselItem key={testimonial.id} className="pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3">
                <motion.div 
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={cardVariants}
                  className="bg-white rounded-xl p-6 md:p-8 h-full border border-border/40 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating
                            ? "fill-[#FFC107] text-[#FFC107]"
                            : "fill-slate-200 text-slate-200"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-slate-600 mb-8 leading-relaxed text-[15px] flex-grow">
                    &quot;{testimonial.review}&quot;
                  </p>

                  <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                    {testimonial.imageUrl ? (
                      <Image
                        src={testimonial.imageUrl}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg">
                        {testimonial.initials}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900 text-[15px]">
                        {testimonial.name}
                      </h4>
                      {testimonial.property && (
                        <p className="text-sm text-slate-500">
                          Purchased in {testimonial.property}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselControls length={testimonials.length} />
        </Carousel>
      </Container>
    </Section>
  );
}
