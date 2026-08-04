"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createPublicSiteVisitAction } from "@/modules/site-visits/actions/site-visit.actions";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId?: string;
  builderId?: string;
  propertyTitle?: string;
}

export function ScheduleVisitModal({ isOpen, onClose, propertyId, builderId, propertyTitle }: ScheduleVisitModalProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (propertyId) formData.append("propertyId", propertyId);
    if (builderId) formData.append("builderId", builderId);

    startTransition(async () => {
      const result = await createPublicSiteVisitAction(formData);
      if (result.success) {
        toast.success("Your site visit request has been submitted successfully. Our team will contact you shortly.");
        onClose();
      } else {
        toast.error(result.error || "Failed to submit site visit request.");
      }
    });
  };

  // Get tomorrow's date for the min attribute of date input
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule a Site Visit</DialogTitle>
          <DialogDescription>
            {propertyTitle ? `Request a site visit for ${propertyTitle}.` : "Request a site visit to view our properties."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input id="fullName" name="fullName" placeholder="John Doe" required disabled={isPending} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+91..." required disabled={isPending} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" placeholder="john@example.com" disabled={isPending} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredDate">Preferred Date *</Label>
              <Input id="preferredDate" name="preferredDate" type="date" min={minDate} required disabled={isPending} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredTime">Preferred Time *</Label>
              <Select name="preferredTime" required disabled={isPending}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                  <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                  <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                  <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                  <SelectItem value="01:00 PM">01:00 PM</SelectItem>
                  <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                  <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                  <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                  <SelectItem value="05:00 PM">05:00 PM</SelectItem>
                  <SelectItem value="06:00 PM">06:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visitorsCount">Number of Visitors</Label>
            <Input id="visitorsCount" name="visitorsCount" type="number" min="1" max="10" defaultValue="1" required disabled={isPending} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <textarea 
              id="notes" 
              name="notes"
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none" 
              placeholder="Any specific requests?" 
              disabled={isPending}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Submitting..." : "Schedule Visit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
