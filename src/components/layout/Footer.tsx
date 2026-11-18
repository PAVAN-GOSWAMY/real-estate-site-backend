"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "./wrappers";
import { siteConfig } from "@/config/site";
import { getWhatsAppLink } from "@/data/contact";
import { SiteStatsSettings } from "@/modules/settings/services/settings.service";
import { createPublicLeadAction } from "@/modules/leads/actions/leads.actions";
import { toast } from "sonner";
import { ChevronUp, Loader2, MapPin, Flame } from "lucide-react";

// Social Media Icons
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.11 7.44C8.94 7.44 8.68 7.5 8.46 7.74C8.24 7.97 7.62 8.56 7.62 9.76C7.62 10.96 8.5 12.12 8.62 12.28C8.75 12.45 10.37 14.94 12.85 16C13.44 16.26 13.9 16.42 14.26 16.53C14.86 16.73 15.4 16.7 15.83 16.63C16.32 16.56 17.33 16.02 17.54 15.43C17.75 14.83 17.75 14.33 17.69 14.22C17.63 14.12 17.46 14.06 17.2 13.93C16.95 13.81 15.7 13.2 15.47 13.11C15.24 13.03 15.08 12.99 14.91 13.24C14.74 13.49 14.26 14.06 14.11 14.23C13.96 14.4 13.81 14.42 13.56 14.3C13.3 14.17 12.48 13.9 11.51 13.04C10.75 12.36 10.24 11.53 10.11 11.31C9.98 11.08 10.1 10.96 10.22 10.84C10.33 10.73 10.47 10.55 10.6 10.4C10.73 10.25 10.77 10.15 10.86 9.98C10.94 9.8 10.9 9.66 10.84 9.53C10.77 9.41 10.28 8.21 10.07 7.72C9.88 7.23 9.68 7.3 9.53 7.3L9.11 7.44Z" />
    </svg>
  );
}

export function Footer({ settings }: { settings?: SiteStatsSettings }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Parse popular locations string into an array of lines
  const rawLocations = settings?.popularLocations
    ? settings.popularLocations.split('\n').map(l => l.trim()).filter(l => l.length > 0)
    : ["Noida", "Greater Noida", "Greater Noida (West)", "Sector 150, Noida", "Yamuna Expressway"];

  const footerLocations = rawLocations.map((loc, index) => ({
    id: `fl-${index}`,
    label: loc,
    href: `/properties?location=${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  }));

  // Handle Enquiry Strip Submission
  const handleEnquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const fullName = (formData.get("fullName") as string || "").trim();
    const phone = (formData.get("phone") as string || "").trim();
    const email = (formData.get("email") as string || "").trim();

    if (!fullName || !phone) {
      toast.error("Please provide both your name and contact number.");
      setIsSubmitting(false);
      return;
    }

    formData.set("fullName", fullName);
    formData.set("phone", phone);
    if (email) formData.set("email", email);
    formData.set("source", "General Contact");
    formData.set("message", "Quick enquiry from website footer strip");

    try {
      const res = await createPublicLeadAction(formData);
      if (res.success) {
        toast.success("Thank you! Our property advisor will get in touch with you shortly.");
        form.reset();
      } else {
        toast.error(res.error || "Failed to submit enquiry. Please try again.");
      }
    } catch {
      toast.error("Something went wrong while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Four Link Columns Definitions
  const propertyCategories = [
    { label: "Apartments in Noida", href: "/properties?type=Apartment" },
    { label: "Luxury Villas", href: "/properties?type=Villa" },
    { label: "Studio Apartments", href: "/properties?category=Studio+Apartment" },
    { label: "Commercial Properties", href: "/properties?category=Commercial" },
    { label: "Retail & High Street Shops", href: "/properties?type=Retail" },
    { label: "Office Spaces", href: "/properties?type=Office" },
    { label: "Penthouse Collections", href: "/properties?type=Penthouse" },
  ];

  const projects = [
    { label: "All Projects", href: "/properties" },
    { label: "Residential Projects", href: "/properties?category=Residential" },
    { label: "Commercial Projects", href: "/properties?category=Commercial" },
    { label: "New Launch Projects", href: "/properties?status=NEW_LAUNCH" },
    { label: "Ready To Move In", href: "/properties?status=READY_TO_MOVE" },
    { label: "Under Construction", href: "/properties?status=UNDER_CONSTRUCTION" },
    { label: "Featured Collections", href: "/properties?isFeatured=true" },
  ];

  const aboutUs = [
    { label: "About Square AR Spaces", href: "/about" },
    { label: "Our Mission & Vision", href: "/about#mission" },
    { label: "Leadership Desk", href: "/about#leadership" },
    { label: "Career Opportunities", href: "/career" },
    { label: "Real Estate Blogs", href: "/blog" },
    { label: "Client Testimonials", href: "/testimonials" },
    { label: "Contact Our Advisors", href: "/contact" },
  ];

  const exploreMore = [
    { label: "Contact Us", href: "/contact" },
    { label: "Share Your Feedback", href: "/feedback" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-conditions" },
    { label: `Direct: ${siteConfig.contact.phone}`, href: `tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}` },
    { label: `Email: ${siteConfig.contact.email}`, href: `mailto:${siteConfig.contact.email}` },
  ];

  return (
    <footer className="w-full flex flex-col">
      {/* Box 1 – Top Gradient Section */}
      <div className="w-full bg-[linear-gradient(135deg,#870404_0%,#042C74_100%)] text-white border-t border-brand-slate/20">
        <Container className="pt-8 pb-6 md:pt-10 md:pb-8">
          {/* Hotspots Bar */}
          <div className="border-b border-white/10 pb-5 mb-8">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-brand-red-light bg-black/30 px-2.5 py-1 rounded-full border border-white/10 shadow-sm">
                <Flame className="w-3.5 h-3.5 fill-brand-red text-brand-red animate-pulse" />
                HOT SPOTS:
              </span>
              {footerLocations.map((loc, idx) => (
                <React.Fragment key={loc.id}>
                  <Link
                    href={loc.href}
                    className="hover:text-brand-red-light transition-colors duration-200 font-medium inline-flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3 text-brand-red opacity-80" />
                    <span>{loc.label}</span>
                  </Link>
                  {idx < footerLocations.length - 1 && (
                    <span className="text-white/20 select-none">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Four Link Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {/* Column 1: Popular Properties */}
            <div>
              <h4 className="text-xs sm:text-sm font-bold tracking-wider uppercase mb-3 text-white flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-brand-red rounded-sm" />
                POPULAR PROPERTIES
              </h4>
              <ul className="space-y-1">
                {propertyCategories.map((item) => (
                  <li key={item.label} className="border-b border-dashed border-white/10 pb-1.5">
                    <Link
                      href={item.href}
                      className="text-xs text-white/75 hover:text-white transition-colors duration-200 uppercase tracking-wider font-medium block truncate"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-xs sm:text-sm font-bold tracking-wider uppercase mb-3 text-white flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-brand-red rounded-sm" />
                QUICK LINKS
              </h4>
              <ul className="space-y-1">
                {projects.map((item) => (
                  <li key={item.label} className="border-b border-dashed border-white/10 pb-1.5">
                    <Link
                      href={item.href}
                      className="text-xs text-white/75 hover:text-white transition-colors duration-200 uppercase tracking-wider font-medium block truncate"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: About Us */}
            <div>
              <h4 className="text-xs sm:text-sm font-bold tracking-wider uppercase mb-3 text-white flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-brand-red rounded-sm" />
                ABOUT US
              </h4>
              <ul className="space-y-1">
                {aboutUs.map((item) => (
                  <li key={item.label} className="border-b border-dashed border-white/10 pb-1.5">
                    <Link
                      href={item.href}
                      className="text-xs text-white/75 hover:text-white transition-colors duration-200 uppercase tracking-wider font-medium block truncate"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Explore More / Contact & Support */}
            <div>
              <h4 className="text-xs sm:text-sm font-bold tracking-wider uppercase mb-3 text-white flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-brand-red rounded-sm" />
                EXPLORE MORE
              </h4>
              <ul className="space-y-1">
                {exploreMore.map((item) => (
                  <li key={item.label} className="border-b border-dashed border-white/10 pb-1.5">
                    <Link
                      href={item.href}
                      className="text-xs text-white/75 hover:text-white transition-colors duration-200 uppercase tracking-wider font-medium block truncate"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Enquiry Strip */}
          <div className="mt-6 p-3 sm:p-4 rounded-xl bg-black/25 backdrop-blur-md border border-white/10 shadow-xl">
            <form onSubmit={handleEnquirySubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-center">
              <div>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="YOUR NAME"
                  className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 rounded-lg px-4 py-3 text-xs md:text-sm text-white placeholder:text-white/60 placeholder:text-xs placeholder:uppercase placeholder:tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="YOUR CONTACT NUMBER"
                  className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 rounded-lg px-4 py-3 text-xs md:text-sm text-white placeholder:text-white/60 placeholder:text-xs placeholder:uppercase placeholder:tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="YOUR EMAIL"
                  className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 rounded-lg px-4 py-3 text-xs md:text-sm text-white placeholder:text-white/60 placeholder:text-xs placeholder:uppercase placeholder:tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full lg:w-auto h-full min-h-[42px] px-6 py-2.5 rounded-lg bg-brand-red hover:bg-brand-red-hover text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-brand-red/30 hover:shadow-brand-red/50 transition-all duration-200 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>{isSubmitting ? "SENDING..." : "GET MORE INFO."}</span>
                </button>
              </div>
            </form>
          </div>
        </Container>
      </div>

      {/* Box 2 – Full-Width White Section */}
      <div className="w-full bg-white py-4 sm:py-5">
        <Container className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Logo & Description */}
          <div className="flex flex-col items-start gap-2 max-w-sm">
            <Link href="/" className="inline-block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
              <span className="sr-only">{siteConfig.name}</span>
              <Image
                src="/logo.jpg"
                alt={siteConfig.name}
                width={150}
                height={45}
                className="object-contain"
              />
            </Link>
            <p className="text-xs text-brand-navy/70 leading-relaxed mt-0.5">
              {siteConfig.description}
            </p>
          </div>

          {/* Social Links & Explore More */}
          <div className="flex flex-col items-start md:items-end gap-2.5">
            <span className="text-xs font-bold text-brand-navy tracking-widest uppercase">
              EXPLORE MORE
            </span>
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/squarearspaces/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 hover:shadow-lg transition-transform duration-200"
              >
                <FacebookIcon className="w-4 h-4 fill-current" />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/square_ar_spaces"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center hover:scale-110 hover:shadow-lg transition-transform duration-200"
              >
                <InstagramIcon className="w-4 h-4 text-white" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/squarearspaces"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:scale-110 hover:shadow-lg transition-transform duration-200"
              >
                <LinkedInIcon className="w-4 h-4 fill-current" />
              </a>

              {/* WhatsApp */}
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 hover:shadow-lg transition-transform duration-200"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current text-white" />
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* Box 3 – Bottom Gradient Section */}
      <div className="w-full bg-[linear-gradient(135deg,#870404_0%,#042C74_100%)] text-white py-3 sm:py-4">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center text-[10px] font-bold">
              ©
            </span>
            <span>
              {new Date().getFullYear()} {siteConfig.name.toUpperCase()} PVT. LTD. — ALL RIGHTS RESERVED.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-white/60">
              Designed by{" "}
              <a
                href="https://beedigitalwork.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white underline underline-offset-4 font-medium transition-colors"
              >
                BeeDigitalWork
              </a>
            </span>
            <button
              onClick={scrollToTop}
              type="button"
              aria-label="Scroll to top"
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-brand-red text-white/80 hover:text-white border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </Container>
      </div>
    </footer>
  );
}
