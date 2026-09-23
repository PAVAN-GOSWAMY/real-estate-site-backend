"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, ArrowRight as ArrowRightInline } from "lucide-react";
import { Section, Container } from "@/components/layout/wrappers";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  image: string;
}

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
      <Link href="/blog">
        <Button variant="outline" className="h-12 rounded-xl px-8 text-[15px] font-bold border-slate-200 text-primary bg-white hover:bg-slate-50 shadow-sm">
          View All Blogs
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
export function BlogSection({ blogs = [] }: { blogs?: BlogPost[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  if (!blogs || blogs.length === 0) return null;

  return (
    <Section className="bg-[#F8F5FB] py-16 border-t border-border/50">
      <Container>
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            From Our Blog
          </h2>
          <p className="text-[15px] font-medium text-slate-500">
            Latest real estate insights, tips and market updates
          </p>
        </div>

        <Carousel
          opts={{ align: "start", loop: true }} plugins={[plugin.current]} onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}
          className="w-full"
        >
          <CarouselContent className="-ml-4 md:-ml-6 pb-4">
            {blogs.map((post, i) => (
              <CarouselItem key={post.id} className="pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <motion.div custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={cardVariants} className="bg-white rounded-xl overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full min-h-[350px]">
                  <div className="relative h-44 w-full">
                    <Image
                      src={post.image || '/placeholder.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {post.date}
                    </p>
                    <h3 className="font-bold text-[17px] text-slate-900 mb-2 line-clamp-2 leading-snug">
                      <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    
                    <div className="mt-auto pt-3 border-t border-slate-100">
                      <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-[13px] font-bold text-slate-900 hover:text-primary transition-colors group">
                        Read More
                        <ArrowRightInline className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselControls length={blogs.length} />
        </Carousel>
      </Container>
    </Section>
  );
}
