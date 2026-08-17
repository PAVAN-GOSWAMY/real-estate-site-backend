"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Menu, X, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNav } from "@/data/navigation";
import { Container } from "./wrappers";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { getWhatsAppLink } from "@/data/contact";
import { useEnquiryModal } from "@/contexts/EnquiryModalContext";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdminAuth, setIsAdminAuth] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleProjectSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search")?.toString().trim();
    if (query) {
      router.push(`/properties?q=${encodeURIComponent(query)}`);
    }
  };

  const { openModal } = useEnquiryModal();

  React.useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdminAuth(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminAuth(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out bg-white overflow-hidden",
        isScrolled
          ? "shadow-sm py-1"
          : "py-2"
      )}
    >
      <Container className="grid grid-cols-2 lg:grid-cols-[auto_1fr_auto] items-center min-h-[70px] relative gap-4">
        
        {/* Left: Logo */}
        <div className="flex items-center justify-start">
          <Link
            href="/"
            className="relative flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm h-[60px] w-[140px] md:h-[70px] md:w-[160px] mix-blend-multiply"
            aria-label="Home"
          >
            <span className="sr-only">{siteConfig.name}</span>
            <Image
              src="/logo.jpg"
              alt={siteConfig.name}
              fill
              className="object-contain object-left mix-blend-multiply scale-[1.15] md:scale-[1.25] origin-left"
              priority
            />
          </Link>
        </div>

        {/* Center: Desktop Navigation & Search */}
        <div className="hidden lg:flex flex-1 items-center justify-between xl:justify-center xl:gap-8 px-2 w-full">
          <nav className="flex items-center space-x-1 lg:space-x-2 xl:space-x-4" aria-label="Main Navigation">
            {mainNav.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  prefetch={false}
                  className={cn(
                    "relative text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full px-3 xl:px-4 py-2 flex items-center whitespace-nowrap",
                    isActive 
                      ? "text-slate-900 font-semibold bg-slate-100" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}

            {isAdminAuth && (
              <Link
                href="/admin"
                className="relative text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full px-3 xl:px-4 py-2 flex items-center whitespace-nowrap"
              >
                Dashboard
              </Link>
            )}
          </nav>
          <form onSubmit={handleProjectSearch} className="flex items-center gap-2 w-full max-w-[350px] xl:max-w-[420px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground stroke-[2.5]" />
              <input
                type="text"
                name="search"
                placeholder="Search by Project Name..."
                className="w-full pl-9 pr-3 py-[7px] text-[13px] border border-border/60 rounded-md outline-none bg-background text-foreground placeholder:text-muted-foreground focus:border-foreground transition-colors shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-foreground text-background p-2 rounded-md hover:bg-foreground/90 transition-colors shadow-sm flex-shrink-0"
              aria-label="Search"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>

        {/* Right: Actions */}
        <div className="hidden lg:flex items-center justify-end gap-2 xl:gap-3">
          <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" title="WhatsApp Us">
            <Button
              size="icon"
              className="h-10 w-10 transition-all duration-300 bg-[#25D366] text-white hover:bg-[#128C7E] rounded-full shadow-sm shrink-0"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            </Button>
          </a>
          
          <a href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`} title={`Call ${siteConfig.contact.phone}`}>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 transition-all duration-300 border-slate-200 bg-transparent text-slate-900 hover:bg-slate-100 hover:border-slate-300 rounded-full shrink-0"
            >
              <Phone className="w-4 h-4" />
            </Button>
          </a>
        </div>

        {/* Mobile Navigation (Sheet) */}
        <div className="lg:hidden flex items-center justify-end">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-900 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <SheetHeader className="mb-8">
                <SheetTitle className="text-left">
                  <span className="sr-only">{siteConfig.name}</span>
                  <Image
                    src="/logo.jpg"
                    alt={siteConfig.name}
                    width={140}
                    height={40}
                    className="object-contain"
                  />
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col space-y-6" aria-label="Mobile Navigation">
                {mainNav.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.id}
                      href={link.href}
                      prefetch={false}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm w-fit",
                        isActive ? "text-accent" : "text-foreground hover:text-accent"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                {isAdminAuth && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="text-xl font-medium transition-colors text-foreground hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm w-fit"
                  >
                    Dashboard
                  </Link>
                )}
              </nav>

              <div className="mt-8 pt-8 border-t border-border">
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    openModal("Navbar Mobile");
                  }}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                >
                  Enquire Now
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </motion.header>
  );
}
