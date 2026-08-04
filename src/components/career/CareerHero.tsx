import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Briefcase, ArrowDown } from "lucide-react";

export function CareerHero() {
  return (
    <section className="relative pt-20 pb-24 lg:pt-28 lg:pb-32 overflow-hidden bg-foreground text-background">
      {/* Premium Background Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/90 to-surface"></div>

      <div className="container px-4 md:px-6 mx-auto text-center max-w-4xl relative z-10">
        <span className="inline-flex items-center px-4 py-1.5 bg-primary/20 text-primary text-sm font-bold uppercase tracking-wider rounded-full mb-6">
          <Briefcase className="w-4 h-4 mr-2" /> Join Our Team
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight">
          Build Your Real Estate Career With Us
        </h1>
        <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto">
          We are actively hiring talented professionals across multiple departments. Work with experienced leaders, premium projects, and an ambitious team committed to excellence.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#jobs" className="w-full sm:w-auto">
            <Button size="lg" className="w-full rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 px-8 py-6 text-lg shadow-lg shadow-primary/20">
              Explore Open Roles
            </Button>
          </a>
          <a href="#why-join" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full rounded-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white px-8 py-6 text-lg transition-colors">
              Why Join Us <ArrowDown className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
