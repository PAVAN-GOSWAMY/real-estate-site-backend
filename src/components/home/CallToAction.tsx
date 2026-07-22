import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { Section, Container } from "@/components/layout/wrappers";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <Section className="py-20 bg-primary relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <Container className="relative z-10 text-center max-w-4xl mx-auto">
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
          Ready to Find Your Dream Property?
        </h2>
        
        <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
          Whether you&apos;re looking for a luxury villa, a premium apartment, or a commercial investment, our experts are here to guide you every step of the way.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="w-full sm:w-auto h-14 px-8 bg-accent text-accent-foreground hover:bg-accent/90 text-base font-semibold group"
            asChild
          >
            <Link href="/properties">
              Explore Properties
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full sm:w-auto h-14 px-8 bg-transparent border-white/30 text-white hover:bg-white hover:text-primary text-base font-semibold transition-colors"
            asChild
          >
            <Link href="/contact">
              <PhoneCall className="mr-2 w-4 h-4" />
              Contact Us Today
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
