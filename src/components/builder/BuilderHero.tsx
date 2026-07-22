import * as React from "react";
import Image from "next/image";
import { Builder } from "@/types";
import { Button } from "@/components/ui/button";

interface BuilderHeroProps {
  builder: Builder;
}

export function BuilderHero({ builder }: BuilderHeroProps) {
  const totalProjects = builder.projectsCompleted + builder.projectsOngoing;

  return (
    <section className="relative pb-12 overflow-hidden bg-accent/5">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/3 max-w-[300px] shrink-0 bg-white p-8 rounded-2xl shadow-lg border border-border/50">
            <div className="relative aspect-square w-full">
              <Image 
                src={builder.logo} 
                alt={builder.name}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          
          <div className="w-full md:w-2/3 space-y-6">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
              {builder.name}
            </h1>
            <p className="text-xl text-primary font-medium">
              {builder.tagline}
            </p>
            
            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{new Date().getFullYear() - Number(builder.establishedYear)}+</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">Years Exp</span>
              </div>
              <div className="w-px bg-border/60"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{totalProjects}</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">Total Projects</span>
              </div>
              <div className="w-px bg-border/60"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{builder.projectsCompleted}</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">Completed</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-6">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 rounded-full">
                View Projects
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 font-semibold px-8 rounded-full">
                Contact Expert
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
