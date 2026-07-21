"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { ArrowRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/wrappers";
import { HeroSearchPanel } from "./HeroSearchPanel";
import { trustMetrics } from "@/data/home";

export function Hero() {
  // Stagger variants for smooth sequence animations
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    },
  };

  const searchPanelVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }
    },
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pb-8 overflow-hidden bg-primary">
      {/* Background Image using Next.js Image for optimization */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero-bg.jpg"
          alt="Luxury high-rise apartment building at twilight in Noida"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Subtle dark overlay for perfect text readability (no heavy gradients) */}
        <div className="absolute inset-0 bg-primary/70 mix-blend-multiply" />
      </div>

      <Container className="relative z-10 flex flex-col justify-center h-full pt-12 md:pt-20 gap-12 lg:gap-16">
        
        {/* Top: Copy & CTAs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl space-y-8"
        >
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              See it. Feel it. Own it. with <span className="opacity-70">Square AR Spaces</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 font-light leading-relaxed max-w-xl">
              Discover premium, verified residential and commercial properties curated by Square AR Spaces across Noida, Greater Noida, and the Yamuna Expressway corridor.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button size="lg" className="h-14 px-8 bg-accent text-accent-foreground hover:bg-accent/90 text-base font-semibold group">
              Explore Properties
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 bg-transparent border-white/30 text-white hover:bg-white hover:text-primary text-base font-semibold transition-colors">
              <PhoneCall className="mr-2 w-4 h-4" />
              Book Free Consultation
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div variants={itemVariants} className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {trustMetrics.map((metric) => (
              <div key={metric.id} className="flex flex-col space-y-1 border-l-2 border-accent/50 pl-4">
                <span className="text-2xl md:text-3xl font-bold text-white font-heading tracking-tight">
                  {metric.value}
                </span>
                <span className="text-xs md:text-sm text-white/70 font-medium uppercase tracking-wider">
                  {metric.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom: Full-Width Search Panel */}
        <motion.div
          variants={searchPanelVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <HeroSearchPanel />
        </motion.div>
        
      </Container>
    </section>
  );
}
