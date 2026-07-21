"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
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
import { useEnquiryModal } from "@/contexts/EnquiryModalContext";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAdminAuth, setIsAdminAuth] = React.useState(false);

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
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out bg-black",
        isScrolled
          ? "border-b border-white/10 shadow-sm py-2 md:py-3"
          : "py-3 md:py-4"
      )}
    >
      <Container className="flex items-center justify-between h-auto">
        <Link
          href="/"
          className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          aria-label="Home"
        >
          <span className="sr-only">{siteConfig.name}</span>
          <Image
            src="/logo.svg"
            alt={siteConfig.name}
            width={140}
            height={40}
            className="object-contain h-8 md:h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
          {mainNav.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.id}
                href={link.href}
                prefetch={false}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-1 flex items-center",
                  isActive ? "text-white font-bold" : "text-white/70"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                    initial={false}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {process.env.NODE_ENV === 'development' && (
            <Link
              href={isAdminAuth ? "/admin" : "/login"}
              className="relative text-sm font-medium transition-colors text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-1 flex items-center"
            >
              {isAdminAuth ? "Dashboard" : "Admin"}
            </Link>
          )}

          <Button
            onClick={() => openModal("Navbar Desktop")}
            className="h-10 px-6 transition-all duration-300 bg-white text-primary hover:bg-white/90 font-bold"
          >
            Enquire Now
          </Button>
        </nav>

        {/* Mobile Navigation (Sheet) */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-ring"
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
                    src="/logo.svg"
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

                {process.env.NODE_ENV === 'development' && (
                  <Link
                    href={isAdminAuth ? "/admin" : "/login"}
                    onClick={() => setIsOpen(false)}
                    className="text-xl font-medium transition-colors text-foreground hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm w-fit"
                  >
                    {isAdminAuth ? "Dashboard" : "Admin"}
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
