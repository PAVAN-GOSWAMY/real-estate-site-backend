"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneCall, Calendar, Building2, X } from "lucide-react";
import { createPublicLeadAction } from "@/modules/leads/actions/leads.actions";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PropertyInquiryCardProps {
  title: string;
  price: string;
  propertyId?: string;
  builderId?: string;
}

export function PropertyInquiryCard({ title, price, propertyId, builderId }: PropertyInquiryCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);

  // Listen to active configuration selected from the Available Configurations section
  useEffect(() => {
    const handleConfigChange = (e: any) => {
      if (e.detail?.configurationType) {
        setSelectedConfig(e.detail.configurationType);
      }
    };
    window.addEventListener("selected-configuration-changed", handleConfigChange);
    return () => window.removeEventListener("selected-configuration-changed", handleConfigChange);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("source", selectedConfig ? `Property Inquiry (${selectedConfig})` : "Property Inquiry");
    if (propertyId) formData.append("propertyId", propertyId);
    if (builderId) formData.append("builderId", builderId);
    if (selectedConfig) formData.append("configuration", selectedConfig);

    startTransition(async () => {
      const result = await createPublicLeadAction(formData);
      if (result.success) {
        toast.success("Thank you for your interest! A luxury property consultant will contact you shortly.");
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(result.error || "Failed to submit inquiry");
      }
    });
  };

  return (
    <div id="inquiry-card" className="sticky top-24 bg-white rounded-2xl p-4 border border-brand-slate/50 shadow-lg z-10 flex flex-col">
      <div className="mb-2.5">
        <h3 className="font-heading text-lg font-bold text-brand-navy mb-0.5">Enquire Now</h3>
        <p className="text-[11px] text-brand-blue leading-tight">Our property consultant will contact you shortly.</p>
      </div>

      {/* Selected Configuration Indicator Badge */}
      {selectedConfig && (
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-semibold mb-3">
          <div className="flex items-center gap-1.5 truncate">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Layout: {selectedConfig}</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedConfig(null)}
            className="text-brand-red/70 hover:text-brand-red p-0.5"
            title="Clear configuration preference"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <input type="hidden" name="configuration" value={selectedConfig || ""} />

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-[11px] text-brand-navy">Full Name</Label>
            <Input id="name" name="fullName" placeholder="John Doe" required className="bg-brand-surface border-brand-slate focus-visible:ring-brand-red h-9 text-xs" disabled={isPending} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone" className="text-[11px] text-brand-navy">Phone</Label>
            <Input id="phone" name="phone" type="tel" placeholder="+91..." required className="bg-brand-surface border-brand-slate focus-visible:ring-brand-red h-9 text-xs" disabled={isPending} />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="email" className="text-[11px] text-brand-navy">Email Address</Label>
          <Input id="email" name="email" type="email" placeholder="john@example.com" required className="bg-brand-surface border-brand-slate focus-visible:ring-brand-red h-9 text-xs" disabled={isPending} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="budget" className="text-[11px] text-brand-navy">Budget</Label>
            <select
              id="budget"
              name="budget"
              className="flex w-full rounded-md border border-brand-slate bg-brand-surface px-3 h-9 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-red disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isPending}
            >
              <option value="">Select Budget</option>
              <option value="Under 1 Cr">Under 1 Cr</option>
              <option value="1 - 3 Cr">1 - 3 Cr</option>
              <option value="3 - 5 Cr">3 - 5 Cr</option>
              <option value="5+ Cr">5+ Cr</option>
            </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="preferredVisitDate" className="text-[11px] text-brand-navy">Site Visit (Optional)</Label>
            <Input id="preferredVisitDate" name="preferredVisitDate" type="date" className="bg-brand-surface border-brand-slate focus-visible:ring-brand-red h-9 text-xs" disabled={isPending} min={new Date().toISOString().split('T')[0]} />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="message" className="text-[11px] text-brand-navy">Message</Label>
          <textarea
            id="message"
            name="message"
            rows={2}
            className="flex w-full rounded-md border border-brand-slate bg-brand-surface px-3 py-1.5 text-xs shadow-sm placeholder:text-brand-navy/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-red disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[48px] max-h-[60px]"
            placeholder={selectedConfig ? `I'm interested in the ${selectedConfig} configuration at ${title}...` : "I'm interested..."}
            disabled={isPending}
          />
        </div>

        <div className="flex gap-2 mt-1">
          <Button
            type="submit"
            className="flex-1 bg-brand-red hover:bg-brand-red-hover text-white h-10 text-sm font-semibold"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : (selectedConfig ? `Enquire for ${selectedConfig}` : "Enquire Now")}
          </Button>

          <Button
            type="button"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("modal", "schedule-visit");
              router.push(`${pathname}?${params.toString()}`, { scroll: false });
            }}
            className="flex-1 bg-brand-navy hover:bg-brand-navy-hover text-white h-10 text-sm font-semibold"
          >
            <Calendar className="mr-2 h-4 w-4" /> Schedule Visit
          </Button>
        </div>
      </form>

      <div className="mt-4 flex flex-col gap-2">
        <a href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center justify-center gap-1.5 text-brand-navy text-xs font-medium hover:text-brand-red transition-colors pt-0.5">
          <PhoneCall className="h-3 w-3" /> {siteConfig.contact.phone}
        </a>
      </div>
    </div>
  );
}
