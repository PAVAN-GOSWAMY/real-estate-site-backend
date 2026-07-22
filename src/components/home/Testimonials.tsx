import { Star } from "lucide-react";
import { Section, Container, SectionHeader, SectionTitle, SectionDescription } from "@/components/layout/wrappers";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  return (
    <Section className="bg-muted/30 pt-16 pb-16">
      <Container>
        <SectionHeader className="text-center md:max-w-3xl mx-auto">
          <SectionTitle>What Our Clients Say</SectionTitle>
          <SectionDescription>
            Don&apos;t just take our word for it. Hear from the families and investors who found their perfect property with us.
          </SectionDescription>
        </SectionHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-card rounded-2xl p-8 border border-border/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? "fill-accent text-accent" : "fill-muted text-muted"}`} 
                  />
                ))}
              </div>
              
              <p className="text-foreground text-lg leading-relaxed flex-1 mb-8 italic">
                &quot;{testimonial.review}&quot;
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-heading font-bold text-primary shrink-0">
                  {testimonial.initials}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                  {testimonial.property && (
                    <p className="text-sm text-muted-foreground">{testimonial.property}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
