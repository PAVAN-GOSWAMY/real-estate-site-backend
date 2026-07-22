import * as React from "react";
import { contactInfo, businessHours, getWhatsAppLink, getMailtoLink } from "@/data/contact";
import { MapPin, Phone, Mail, Clock, Zap, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactInfo() {
  return (
    <div className="bg-surface p-5 md:p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col h-full">
      <div className="mb-5">
        <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-1">Premium Consultation</h2>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Connect directly with our luxury real estate specialists.
        </p>
      </div>
      
      <div className="space-y-4 flex-1">
        
        {/* Response Time Indicator */}
        <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-900 text-xs">Lightning Fast Response</h4>
            <p className="text-emerald-700/80 text-[10px] font-medium">We typically reply within 15 minutes</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-0.5 text-xs">Direct Line & WhatsApp</h4>
            <a href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, "")}`} className="text-muted-foreground hover:text-primary transition-colors block text-xs mb-1">{contactInfo.phone}</a>
            <div className="flex items-center gap-3 mt-3">
              <a href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, "")}`} className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors rounded-md text-sm font-medium">
                Call
              </a>
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors rounded-md text-sm font-medium">
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-1">Email Us</h3>
            <a href={getMailtoLink()} className="text-muted-foreground hover:text-primary transition-colors text-xs">{contactInfo.email}</a>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-0.5 text-xs">Corporate Office</h4>
            <p className="text-muted-foreground leading-relaxed text-xs">{contactInfo.address}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div className="w-full">
            <h4 className="font-bold text-foreground mb-1.5 text-xs">Business Hours</h4>
            <ul className="space-y-1 w-full">
              {businessHours.map((bh, idx) => (
                <li key={idx} className="text-[11px] text-muted-foreground flex justify-between border-b border-border/40 pb-1 last:border-0 last:pb-0">
                  <span>{bh.days}</span>
                  <span className="font-medium text-foreground">{bh.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
