"use client";

import * as React from "react";
import { LeadEnquiry } from "@/types/contact";
import { SuccessModal } from "./SuccessModal";

import { toast } from "sonner";
import { createPublicLeadAction } from "@/modules/leads/actions/leads.actions";

interface LeadFormProps {
  type: LeadEnquiry["type"];
  children: (props: {
    isLoading: boolean;
    error: string | null;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  }) => React.ReactNode;
  onSuccess?: () => void;
}

export function LeadForm({ type, children, onSuccess }: LeadFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Basic Validation
    if (!data.name && !data.fullName || !data.phone || (!data.email && type !== "Callback")) {
      setError("Please fill out all required fields.");
      setIsLoading(false);
      return;
    }

    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email as string)) {
        setError("Please enter a valid email address.");
        setIsLoading(false);
        return;
      }
    }

    const phoneRegex = /^\+?[\d\s-]{10,15}$/;
    if (!phoneRegex.test(data.phone as string)) {
      setError("Please enter a valid phone number.");
      setIsLoading(false);
      return;
    }

    // Normalize for CRM
    if (formData.has("name") && !formData.has("fullName")) {
      formData.set("fullName", formData.get("name") as string);
    }

    if (formData.has("preferredDate") && formData.get("preferredDate")) {
      let visitDate = formData.get("preferredDate") as string;
      let timeStr = formData.get("preferredTime") as string;
      if (timeStr) {
        if (timeStr.includes(" PM") || timeStr.includes(" AM")) {
          const isPM = timeStr.includes(" PM");
          const parts = timeStr.split(" ")[0].split(":");
          let hours = parseInt(parts[0], 10);
          if (isPM && hours < 12) hours += 12;
          if (!isPM && hours === 12) hours = 0;
          timeStr = `${hours.toString().padStart(2, "0")}:${parts[1]}`;
        }
        visitDate += `T${timeStr}:00Z`;
      } else {
        visitDate += `T00:00:00Z`; // Default if no time provided
      }
      formData.set("preferredVisitDate", visitDate);
    }
    
    if (formData.has("configuration") && formData.get("configuration")) {
      const config = formData.get("configuration") as string;
      const existingMessage = formData.get("message") as string || "";
      formData.set("message", existingMessage ? `Preferred Configuration: ${config}\n\n${existingMessage}` : `Preferred Configuration: ${config}`);
    }

    // Set CRM Source
    const sourceMap: Record<string, string> = {
      "Property": "Property Inquiry",
      "General": "General Contact",
      "Callback": "Phone Call",
      "SiteVisit": "Site Visit Request",
    };
    formData.set("source", sourceMap[type] || "General Contact");

    try {
      const result = await createPublicLeadAction(formData);
      
      if (result.success) {
        toast.success("Enquiry submitted successfully! We will get back to you soon.");
        setShowSuccess(true);
        if (onSuccess) onSuccess();
        e.currentTarget.reset();
      } else {
        setError(result.error || "Failed to submit enquiry. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {children({ isLoading, error, onSubmit: handleSubmit })}
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
    </>
  );
}
