"use client";

import * as React from "react";
import { useEnquiryModal } from "@/contexts/EnquiryModalContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyType } from "@/modules/properties/types/enums";
import { createPublicLeadAction } from "@/modules/leads/actions/leads.actions";
import { toast } from "sonner";

export function EnquiryModal() {
  const { isOpen, closeModal, modalData } = useEnquiryModal();

  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  // Focus trap / ESC listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeModal]);

  // Reset internal state when closed
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setIsSuccess(false);
        setIsLoading(false);
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const location = formData.get("location") as string;
    const propertyType = formData.get("propertyType") as string;
    let message = formData.get("message") as string;
    
    // Append location and property type to message if they exist
    if (location || propertyType) {
      message = (message ? message + "\n\n" : "") + 
                (location ? `Preferred Location: ${location}\n` : "") + 
                (propertyType ? `Property Type: ${propertyType}` : "");
    }
    
    formData.set("message", message.trim());
    formData.set("source", modalData.propertyName ? "Property Inquiry" : "General Contact");
    if (modalData.propertyName) {
      message = `Interested in: ${modalData.propertyName}\n` + message;
    }
    formData.set("message", message.trim());

    try {
      const res = await createPublicLeadAction(formData);
      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          closeModal();
        }, 2500);
      } else {
        toast.error(res.error || "Failed to submit enquiry. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-border/50 flex justify-between items-center bg-surface sticky top-0 z-10">
              <div>
                <h2 id="modal-title" className="text-xl font-heading font-bold text-foreground">
                  Speak With Our Property Advisor
                </h2>
                <p className="text-muted-foreground text-xs mt-1">
                  Fill in your details and our expert will contact you shortly.
                </p>
              </div>
              <button 
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-accent/10 hover:bg-accent/20 flex items-center justify-center text-accent transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold font-heading text-foreground mb-2">Thank You!</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Our property advisor will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="modal-name" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Full Name *</label>
                      <input id="modal-name" name="fullName" required type="text" autoFocus className="w-full px-4 h-11 rounded-xl border border-border/50 bg-background outline-none focus:border-primary transition-colors text-foreground shadow-sm text-sm" placeholder="John Doe" />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="modal-phone" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Phone Number *</label>
                      <input id="modal-phone" name="phone" required type="tel" className="w-full px-4 h-11 rounded-xl border border-border/50 bg-background outline-none focus:border-primary transition-colors text-foreground shadow-sm text-sm" placeholder="+91 98765 43210" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="modal-email" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email Address *</label>
                    <input id="modal-email" name="email" required type="email" className="w-full px-4 h-11 rounded-xl border border-border/50 bg-background outline-none focus:border-primary transition-colors text-foreground shadow-sm text-sm" placeholder="john@example.com" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="modal-location" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Preferred Location</label>
                      <Select name="location">
                        <SelectTrigger id="modal-location" className="w-full h-11 rounded-xl border-border/50 bg-background shadow-sm text-sm">
                          <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                        <SelectContent className="z-[200]">
                          <SelectItem value="Noida">Noida</SelectItem>
                          <SelectItem value="Greater Noida">Greater Noida</SelectItem>
                          <SelectItem value="Ghaziabad">Ghaziabad</SelectItem>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                          <SelectItem value="Gurugram">Gurugram</SelectItem>
                          <SelectItem value="Faridabad">Faridabad</SelectItem>
                          <SelectItem value="Jewar">Jewar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="modal-type" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Property Type</label>
                      <Select name="propertyType">
                        <SelectTrigger id="modal-type" className="w-full h-11 rounded-xl border-border/50 bg-background shadow-sm text-sm">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent className="z-[200]">
                          {Object.values(PropertyType).map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="modal-budget" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Budget</label>
                    <Select name="budget">
                      <SelectTrigger id="modal-budget" className="w-full h-11 rounded-xl border-border/50 bg-background shadow-sm text-sm">
                        <SelectValue placeholder="Select Budget Range" />
                      </SelectTrigger>
                        <SelectContent className="z-[200]">
                          <SelectItem value="under-50l">Below 50L</SelectItem>
                          <SelectItem value="50l-1cr">50L - 1 Cr</SelectItem>
                          <SelectItem value="1cr-2cr">1 Cr - 2 Cr</SelectItem>
                          <SelectItem value="2cr-5cr">2 Cr - 5 Cr</SelectItem>
                          <SelectItem value="above-5cr">Above 5 Cr</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="modal-message" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Message</label>
                    <textarea id="modal-message" name="message" rows={3} className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background outline-none focus:border-primary transition-colors text-foreground shadow-sm text-sm resize-none" placeholder={modalData.propertyName ? `I am interested in ${modalData.propertyName}...` : "How can we assist with your property search?"} />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <Button type="button" variant="outline" onClick={closeModal} disabled={isLoading} className="flex-1 h-12 rounded-full font-bold">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="flex-1 h-12 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-lg shadow-primary/20">
                      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      {isLoading ? "Submitting..." : "Submit Enquiry"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
