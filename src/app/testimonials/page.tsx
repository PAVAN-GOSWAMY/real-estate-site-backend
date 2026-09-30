import { Container, Section, SectionHeader, SectionTitle } from "@/components/layout/wrappers";
import { TestimonialsService } from "@/modules/testimonials/services/testimonials.service";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";

export const metadata: Metadata = {
  title: "Client Testimonials | Square AR",
  description: "Read real stories and experiences from our happy homeowners and investors.",
};

export const revalidate = 90;

export default async function TestimonialsPage() {
  const testimonials = await TestimonialsService.getActiveTestimonials();

  return (
    <Section className="bg-brand-surface py-20 min-h-screen">
      <Container>
        <div className="relative flex flex-col items-center justify-center mb-12 gap-6">
          <SectionHeader className="mb-0 text-center">
            <SectionTitle>Client Testimonials</SectionTitle>
            <p className="text-[15px] font-medium text-brand-blue mt-2">
              Real stories from happy homeowners and investors
            </p>
          </SectionHeader>
          <div className="md:absolute md:right-0 md:bottom-0 text-center">
            <Link href="/feedback">
              <Button className="rounded-full bg-brand-red hover:bg-brand-red-hover text-white px-6">
                <MessageSquarePlus className="w-4 h-4 mr-2" />
                Share Your Experience
              </Button>
            </Link>
          </div>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-2xl border border-brand-slate/20 max-w-2xl mx-auto shadow-sm mt-12">
            <MessageSquarePlus className="w-12 h-12 text-brand-navy/30 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-brand-navy mb-2">
              No Testimonials Yet
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
            {testimonials.map((testimonial, i) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={i} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
