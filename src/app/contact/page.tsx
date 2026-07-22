import * as React from "react";
import { Metadata } from "next";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { GeneralEnquiryForm } from "@/components/contact/GeneralEnquiryForm";
import { ContactFAQ } from "@/components/contact/ContactFAQ";
import { siteConfig } from "@/config/site";
import { ShieldCheck, MapPin, Building, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactInfo, getWhatsAppLink } from "@/data/contact";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Contact Us | ${siteConfig.name}`,
  description: "Get in touch with our expert property advisors. Schedule a site visit or request a callback for premium real estate in Noida.",
  openGraph: {
    title: `Contact Us | ${siteConfig.name}`,
    description: "Get in touch with our expert property advisors. Schedule a site visit or request a callback for premium real estate in Noida.",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-surface pb-0">
      <ContactHero />
      
      {/* Main Consultation Section */}
      <section className="py-16 md:py-24 relative z-20 -mt-16 md:-mt-20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Premium Info Card */}
            <div className="lg:col-span-5 h-full">
              <ContactInfo />
            </div>
            
            {/* Right Column: Enquiry Form */}
            <div className="lg:col-span-7 bg-white p-5 md:p-6 rounded-3xl shadow-xl border border-border/40">
              <div className="mb-4">
                <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-1">Request Details</h2>
                <p className="text-muted-foreground text-[11px] md:text-xs">
                  Please fill out the form below. All fields marked with an asterisk (*) are required.
                </p>
              </div>
              <GeneralEnquiryForm />
            </div>

          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 md:py-20 bg-white border-y border-border/50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-foreground mb-2">Expert Property Advisors</h4>
              <p className="text-sm text-muted-foreground">Work with the best in the industry.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-foreground mb-2">Verified Projects</h4>
              <p className="text-sm text-muted-foreground">Every property is RERA registered.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Building className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-foreground mb-2">Transparent Consultation</h4>
              <p className="text-sm text-muted-foreground">No hidden fees or charges.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-foreground mb-2">End-to-End Assistance</h4>
              <p className="text-sm text-muted-foreground">From site visit to registration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visit Our Office (Map Section) */}
      <section className="py-20 md:py-24 bg-surface">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Visit Our Office</h2>
            <p className="text-muted-foreground text-lg">
              {contactInfo.address}
            </p>
            <Button asChild variant="outline" className="mt-6 rounded-full border-primary text-primary hover:bg-primary/5">
              <a href={contactInfo.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                Get Directions <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
          <div className="rounded-3xl overflow-hidden border border-border/50 aspect-video md:aspect-[21/9] w-full relative bg-muted shadow-lg max-w-5xl mx-auto">
            <iframe 
              src={contactInfo.googleMapsUrl}
              width="100%" 
              height="100%" 
              style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <ContactFAQ />

      {/* Final CTA Section */}
      <section className="py-24 bg-foreground text-background text-center px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Still unsure which property is right for you?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Speak with our experts today for a free, no-obligation consultation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-12">
              <a href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, "")}`}>Call Now</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto rounded-full bg-emerald-500/10 hover:bg-emerald-500 border-emerald-500/50 text-emerald-400 hover:text-white font-semibold px-8 h-12 transition-colors">
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
