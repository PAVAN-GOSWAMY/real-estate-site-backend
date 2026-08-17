"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneCall, Calendar } from "lucide-react";
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("source", "Property Inquiry");
    if (propertyId) formData.append("propertyId", propertyId);
    if (builderId) formData.append("builderId", builderId);

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
    <div className="sticky top-24 bg-surface rounded-2xl p-4 border border-border/50 shadow-lg z-10 flex flex-col">
      <div className="mb-3">
        <h3 className="font-heading text-lg font-bold text-primary mb-0.5">Enquire Now</h3>
        <p className="text-[11px] text-muted-foreground leading-tight">Our property consultant will contact you shortly.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-[11px]">Full Name</Label>
            <Input id="name" name="fullName" placeholder="John Doe" required className="bg-background h-9 text-xs" disabled={isPending} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone" className="text-[11px]">Phone</Label>
            <Input id="phone" name="phone" type="tel" placeholder="+91..." required className="bg-background h-9 text-xs" disabled={isPending} />
          </div>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="email" className="text-[11px]">Email Address</Label>
          <Input id="email" name="email" type="email" placeholder="john@example.com" required className="bg-background h-9 text-xs" disabled={isPending} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="budget" className="text-[11px]">Budget</Label>
            <select 
              id="budget" 
              name="budget" 
              className="flex w-full rounded-md border border-input bg-background px-3 h-9 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
            <Label htmlFor="preferredVisitDate" className="text-[11px]">Site Visit (Optional)</Label>
            <Input id="preferredVisitDate" name="preferredVisitDate" type="date" className="bg-background h-9 text-xs" disabled={isPending} min={new Date().toISOString().split('T')[0]} />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="message" className="text-[11px]">Message</Label>
          <textarea 
            id="message" 
            name="message"
            rows={2}
            className="flex w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[48px] max-h-[60px]" 
            placeholder="I'm interested..." 
            disabled={isPending}
          />
        </div>
        
        <div className="flex gap-2 mt-1">
          <Button 
            type="submit" 
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-10 text-sm font-semibold"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Enquire Now"}
          </Button>
          
          <Button 
            type="button"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("modal", "schedule-visit");
              router.push(`${pathname}?${params.toString()}`, { scroll: false });
            }} 
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-10 text-sm font-semibold"
          >
            <Calendar className="mr-2 h-4 w-4" /> Schedule Visit
          </Button>
        </div>
      </form>

      <div className="mt-4 flex flex-col gap-2">
        <a href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center justify-center gap-1.5 text-primary text-xs font-medium hover:text-accent transition-colors pt-0.5">
          <PhoneCall className="h-3 w-3" /> {siteConfig.contact.phone}
        </a>
      </div>
    </div>
  );
}
