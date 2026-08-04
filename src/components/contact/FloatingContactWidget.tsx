"use client";

import * as React from "react";
import { Phone, MessageCircle, FileText, X } from "lucide-react";
import { contactInfo, getWhatsAppLink, getMailtoLink } from "@/data/contact";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { usePathname } from "next/navigation";

export function FloatingContactWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Mobile Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border/50 shadow-[0_-10px_40px_rgb(0,0,0,0.1)] z-40 px-4 py-3 flex justify-between items-center gap-2">
        <a 
          href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, "")}`}
          className="flex-1 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
        >
          <Phone className="w-5 h-5" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Call</span>
        </a>
        <a 
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center gap-1 text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">WhatsApp</span>
        </a>
        <Link 
          href="/contact"
          className="flex-[2] bg-primary text-primary-foreground rounded-full py-2 flex items-center justify-center font-bold text-sm shadow-md"
        >
          Enquire Now
        </Link>
      </div>

      {/* Desktop Floating Widget */}
      <div className="hidden md:flex fixed bottom-8 left-8 z-50 flex-col items-start">
        <div className={cn(
          "bg-white rounded-3xl shadow-2xl border border-border/50 p-4 mb-4 flex-col gap-3 transition-all duration-300 origin-bottom-left",
          isOpen ? "scale-100 opacity-100 flex" : "scale-0 opacity-0 hidden"
        )}>
          <a 
            href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, "")}`}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent/10 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors text-primary group-hover:text-primary-foreground">
              <Phone className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm">Request Callback</span>
          </a>
          <a 
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent/10 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-500 transition-colors text-emerald-600 group-hover:text-white">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm">Chat on WhatsApp</span>
          </a>
          <a 
            href={getMailtoLink()}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent/10 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors text-primary group-hover:text-primary-foreground">
              <FileText className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm">Submit Enquiry</span>
          </a>
        </div>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close contact menu" : "Open contact menu"}
          aria-expanded={isOpen}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center text-primary-foreground shadow-2xl transition-transform duration-300 hover:scale-110",
            isOpen ? "bg-foreground" : "bg-primary"
          )}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>
    </>
  );
}
