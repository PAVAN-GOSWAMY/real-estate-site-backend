"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function InquiryForm({ propertyName }: { propertyName: string }) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitted(false);
      toast.success("Thank you! Our luxury property consultant will contact you shortly.");
    }, 1500);
  };

  return (
    <div className="bg-background border border-border/50 rounded-2xl p-4 shadow-sm sticky top-28 flex flex-col">
      <div className="mb-3">
        <h3 className="font-heading text-lg font-bold text-primary mb-0.5">Enquire Now</h3>
        <p className="text-[11px] text-muted-foreground leading-tight">
          Schedule a viewing or request details for {propertyName}.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[11px] font-medium">Name</label>
            <Input required placeholder="Your full name" className="bg-surface h-9 text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-medium">Phone</label>
            <Input required type="tel" placeholder="+91..." className="bg-surface h-9 text-xs" />
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="text-[11px] font-medium">Email</label>
          <Input required type="email" placeholder="you@example.com" className="bg-surface h-9 text-xs" />
        </div>
        
        <div className="space-y-1">
          <label className="text-[11px] font-medium">Message (Optional)</label>
          <textarea 
            className="flex w-full rounded-md border border-input bg-surface px-3 py-1.5 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[48px] max-h-[60px]"
            rows={2}
            placeholder="I would like to schedule a viewing..."
          />
        </div>
        
        <Button type="submit" disabled={isSubmitted} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-10 text-sm font-semibold mt-1">
          {isSubmitted ? "Sending..." : "Request Details"}
        </Button>
      </form>
    </div>
  );
}
