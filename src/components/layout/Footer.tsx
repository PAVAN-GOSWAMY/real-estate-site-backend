import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "./wrappers";
import { footerQuickLinks, footerLocations, socialLinks } from "@/data/navigation";
import { siteConfig } from "@/config/site";
import { getMailtoLink } from "@/data/contact";
import { Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-border/10">
      <Container className="py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* 1. Company Info */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="sr-only">{siteConfig.name}</span>
              <Image 
                src="/logo.jpg" 
                alt={siteConfig.name} 
                width={160} 
                height={50} 
                className="object-contain" 
              />
            </Link>
            <p className="text-sm text-primary-foreground/70 max-w-xs leading-relaxed">
              {siteConfig.description}
            </p>
          </div>
          
          {/* 2. Quick Links */}
          <div className="space-y-6">
            <h4 className="font-semibold text-accent text-lg">Quick Links</h4>
            <nav aria-label="Footer Quick Links">
              <ul className="space-y-3 text-sm text-primary-foreground/80">
                {footerQuickLinks.map((link) => (
                  <li key={link.id}>
                    <Link 
                      href={link.href} 
                      className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          {/* 3. Popular Locations */}
          <div className="space-y-6">
            <h4 className="font-semibold text-accent text-lg">Popular Locations</h4>
            <nav aria-label="Footer Locations">
              <ul className="space-y-3 text-sm text-primary-foreground/80">
                {footerLocations.map((link) => (
                  <li key={link.id}>
                    <Link 
                      href={link.href} 
                      className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          {/* 4. Contact & Socials */}
          <div className="space-y-6">
            <h4 className="font-semibold text-accent text-lg">Connect With Us</h4>
            
            <div className="space-y-4">
              <address className="not-italic text-sm text-primary-foreground/70 space-y-4">
                <li className="flex items-start gap-3 list-none">
                  <Mail className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">Email</h4>
                    <a href={getMailtoLink()} className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm">{siteConfig.contact.email}</a>
                  </div>
                </li>
                <li className="flex items-start gap-3 list-none">
                  <Phone className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">Phone</h4>
                    <a href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm">{siteConfig.contact.phone}</a>
                  </div>
                </li>
              </address>
              
              <nav aria-label="Social Links" className="pt-2">
                <ul className="flex flex-wrap gap-4 text-sm">
                  {socialLinks.map((link) => (
                    <li key={link.id}>
                      <Link 
                        href={link.href} 
                        className="text-primary-foreground/80 hover:text-white transition-colors font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
          
        </div>
        
        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/50">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>
            Designed for <span className="text-primary-foreground/70">Noida & Greater Noida</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
