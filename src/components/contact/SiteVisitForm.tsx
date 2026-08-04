"use client";

import * as React from "react";
import { LeadForm } from "./LeadForm";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SiteVisitFormProps {
  projectName?: string;
}

export function SiteVisitForm({ projectName }: SiteVisitFormProps) {
  return (
    <LeadForm type="SiteVisit">
      {({ isLoading, error, onSubmit }) => (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name *</label>
            <input id="name" name="name" type="text" required className="w-full px-4 py-3 rounded-xl border border-border/50 bg-surface outline-none focus:border-primary transition-colors text-foreground" placeholder="John Doe" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number *</label>
              <input id="phone" name="phone" type="tel" required className="w-full px-4 py-3 rounded-xl border border-border/50 bg-surface outline-none focus:border-primary transition-colors text-foreground" placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address *</label>
              <input id="email" name="email" type="email" required className="w-full px-4 py-3 rounded-xl border border-border/50 bg-surface outline-none focus:border-primary transition-colors text-foreground" placeholder="john@example.com" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="preferredDate" className="text-sm font-medium text-foreground">Preferred Date *</label>
              <input id="preferredDate" name="preferredDate" type="date" required className="w-full px-4 py-3 rounded-xl border border-border/50 bg-surface outline-none focus:border-primary transition-colors text-foreground" />
            </div>
            <div className="space-y-2">
              <label htmlFor="preferredTime" className="text-sm font-medium text-foreground">Preferred Time *</label>
              <select id="preferredTime" name="preferredTime" required className="w-full px-4 py-3 rounded-xl border border-border/50 bg-surface outline-none focus:border-primary transition-colors text-foreground appearance-none">
                <option value="" disabled selected>Select a time</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="05:00 PM">05:00 PM</option>
                <option value="06:00 PM">06:00 PM</option>
              </select>
            </div>
          </div>

          {projectName && (
             <input type="hidden" name="project" value={projectName} />
          )}

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <Button type="submit" disabled={isLoading} className="w-full rounded-xl py-6 bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-lg">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            {isLoading ? "Scheduling..." : "Schedule Visit"}
          </Button>
        </form>
      )}
    </LeadForm>
  );
}
