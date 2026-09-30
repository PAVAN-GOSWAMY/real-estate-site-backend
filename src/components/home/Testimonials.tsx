"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MessageSquarePlus } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Section, Container } from "@/components/layout/wrappers";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import { Testimonial } from "@/modules/testimonials/types";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";

function CarouselControls({ length }: { length: number }) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();
  
  return (
    <div className="flex items-center justify-center mt-12 gap-4">
      <Button 
        variant="outline" 
        size="icon" 
        className="h-12 w-12 rounded-xl border-brand-slate text-brand-navy bg-white hover:bg-brand-surface hover:text-brand-navy-hover shadow-sm disabled:opacity-50"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Link href="/testimonials">
        <Button variant="outline" className="h-12 rounded-xl px-8 text-[15px] font-bold border-brand-slate text-brand-red bg-white hover:bg-brand-surface shadow-sm">
          View All Testimonials
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

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  if (!testimonials || testimonials.length === 0) {
    return (
      <Section className="bg-brand-surface py-16">
        <Container>
          <div className="text-center bg-white p-10 rounded-2xl border border-brand-slate/20 max-w-2xl mx-auto shadow-sm">
            <MessageSquarePlus className="w-12 h-12 text-brand-navy/30 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-brand-navy mb-2">
              Share Your Experience
            </h2>
            <p className="text-[15px] text-brand-navy/70 mb-6">
              We&apos;d love to hear about your journey with us. Be the first to share your story!
            </p>
            <Link href="/feedback">
              <Button className="rounded-full bg-brand-red hover:bg-brand-red-hover text-white px-8 h-12 text-[15px]">
                Submit Feedback
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="bg-brand-surface py-16">
      <Container>
        <div className="relative flex flex-col items-center justify-center mb-10 gap-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-brand-navy mb-2">
              What Our Clients Say
            </h2>
            <p className="text-[15px] font-medium text-brand-blue">
              Real stories from happy homeowners and investors
            </p>
          </div>
          <div className="md:absolute md:right-0 md:bottom-0 text-center">
            <Link href="/feedback">
              <Button className="rounded-full bg-brand-red hover:bg-brand-red-hover text-white px-6">
                <MessageSquarePlus className="w-4 h-4 mr-2" />
                Share Your Experience
              </Button>
            </Link>
          </div>
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
          <CarouselContent className="-ml-4 md:-ml-6 pb-4 pt-10">
            {testimonials.map((testimonial, i) => (
              <CarouselItem key={testimonial.id} className="pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3">
                <TestimonialCard testimonial={testimonial} index={i} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselControls length={testimonials.length} />
        </Carousel>
      </Container>
    </Section>
  );
}
