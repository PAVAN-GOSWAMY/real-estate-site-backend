"use client";

import { useState } from "react";
import { Job } from "@/modules/jobs/models/job.model";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitJobApplicationAction } from "@/modules/jobs/actions/jobs.actions";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";

interface JobApplicationModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JobApplicationModal({ job, isOpen, onClose }: JobApplicationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  if (!job) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("job_id", job.id);
      formData.append("job_title", job.title); // For email notification

      const file = formData.get("resume") as File;
      if (file && file.size > 5 * 1024 * 1024) {
        toast.error("Resume file size must be less than 5MB");
        setIsSubmitting(false);
        return;
      }

      const res = await submitJobApplicationAction(formData);

      if (res.success) {
        toast.success("Application Submitted!", {
          description: "We've sent a confirmation email to your inbox.",
        });
        onClose();
      } else {
        if (res.error === "You have already applied for this position.") {
          toast.warning("Already Applied", {
            description: "You have already submitted an application for this specific role.",
          });
        } else {
          toast.error("Submission Failed", {
            description: res.error,
          });
        }
      }
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
    else setFileName(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="bg-primary p-6 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl">Apply for {job.title}</DialogTitle>
            <DialogDescription className="text-primary-foreground/80">
              {job.department} • {job.location}
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input id="first_name" name="first_name" required disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input id="last_name" name="last_name" required disabled={isSubmitting} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input id="email" name="email" type="email" required disabled={isSubmitting} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input id="phone" name="phone" type="tel" required disabled={isSubmitting} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">Resume (PDF) *</Label>
            <div className="relative">
              <Input 
                id="resume" 
                name="resume" 
                type="file" 
                accept=".pdf,application/pdf"
                required 
                className="hidden"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
              <Label
                htmlFor="resume"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  fileName ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className={`w-8 h-8 mb-3 ${fileName ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="mb-2 text-sm text-foreground font-medium">
                    {fileName ? fileName : <><span className="font-semibold text-primary">Click to upload</span> or drag and drop</>}
                  </p>
                  {!fileName && <p className="text-xs text-muted-foreground">PDF (MAX. 5MB)</p>}
                </div>
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_letter">Cover Letter (Optional)</Label>
            <Textarea 
              id="cover_letter" 
              name="cover_letter" 
              placeholder="Tell us why you're a great fit..."
              className="resize-none h-24"
              disabled={isSubmitting}
            />
          </div>

          <div className="pt-4 border-t border-border mt-6">
            <Button type="submit" className="w-full h-12 text-base rounded-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
