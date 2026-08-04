"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getWhatsAppLink } from "@/data/contact";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface StickyCTAProps {
  title?: string;
  price?: string;
  type?: "property" | "builder" | "location";
}

import { Suspense } from "react";

function StickyCTAContent({ title, price, type = "property" }: StickyCTAProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero section (approx 400px)
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={cn(
      "fixed top-[106px] left-0 right-0 bg-white/95 backdrop-blur-md border-b border-border/50 shadow-sm z-40 transition-transform duration-300 px-4 py-3 hidden md:block",
      isVisible ? "translate-y-0" : "-translate-y-full"
    )}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="hidden md:block truncate">
          <h4 className="font-bold text-foreground text-sm truncate">{title || "Interested in this property?"}</h4>
          {price && <p className="text-primary font-bold text-xs">{price}</p>}
        </div>

        <div className="flex w-full md:w-auto items-center gap-3">
          <a href={getWhatsAppLink(title)} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none">
            <Button variant="outline" className="w-full rounded-full border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 hover:text-[#25D366]">
              <MessageCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </Button>
          </a>
          <Button onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("modal", "schedule-visit");
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
          }} className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Schedule Visit</span>
            <span className="sm:hidden">Visit</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function StickyCTA(props: StickyCTAProps) {
  return (
    <Suspense fallback={null}>
      <StickyCTAContent {...props} />
    </Suspense>
  );
}
