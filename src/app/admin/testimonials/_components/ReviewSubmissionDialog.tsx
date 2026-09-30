"use client";

import { useState } from "react";
import { toast } from "sonner";
import { TestimonialSubmission } from "@/modules/testimonials/types";
import { updateSubmissionStatusAction, publishSubmissionAction } from "@/modules/testimonials/actions/testimonials.actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, User, Loader2, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ReviewSubmissionDialog({ submission }: { submission: TestimonialSubmission }) {
  const [open, setOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleReject = async () => {
    setIsRejecting(true);
    const result = await updateSubmissionStatusAction(submission.id, 'rejected');
    setIsRejecting(false);
    
    if (result.success) {
      toast.success("Submission rejected.");
      setOpen(false);
    } else {
      toast.error("Error rejecting submission: " + result.error);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    const result = await publishSubmissionAction(submission.id);
    setIsPublishing(false);
    
    if (result.success) {
      toast.success("Submission published successfully!");
      setOpen(false);
    } else {
      toast.error("Error publishing submission: " + result.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-brand-navy border-brand-slate/50 hover:bg-brand-surface">
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Customer Feedback</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div className="flex items-start gap-4 p-4 bg-brand-surface rounded-xl border border-brand-slate/20">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-brand-slate/30 shrink-0 bg-white">
              {submission.profileImageUrl ? (
                <Image unoptimized src={submission.profileImageUrl} alt={submission.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-blue/50">
                  <User className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-brand-navy text-lg">{submission.name}</h4>
                  {submission.email && <p className="text-sm text-brand-navy/60">{submission.email}</p>}
                  {submission.location && <p className="text-sm text-brand-navy/60">{submission.location}</p>}
                </div>
                <div className="text-right">
                  <span className="text-xs text-brand-navy/50">{format(new Date(submission.createdAt!), "MMM d, yyyy")}</span>
                  <div className="flex items-center justify-end gap-1 mt-1 text-amber-500">
                    <span className="font-medium text-brand-navy text-sm mr-1">{submission.rating}</span>
                    <Star className="w-4 h-4 fill-amber-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-brand-navy font-semibold">Feedback Message</Label>
            <div className="p-4 bg-white rounded-xl border border-brand-slate/30 text-brand-navy text-sm italic">
              &quot;{submission.message}&quot;
            </div>
          </div>

          {/* We only need admin notes if we are going to update the submission. But currently T2 doesn't have an action to update notes on submission before publish, 
          wait, T2 publish action doesn't take notes. Let's skip admin notes for simplicity or just leave it unused. */}

          <div className="flex justify-between gap-4 pt-4 border-t border-brand-slate/40">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReject} 
              disabled={isRejecting || isPublishing} 
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 w-1/2"
            >
              {isRejecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
              Reject
            </Button>
            <Button 
              type="button" 
              onClick={handlePublish} 
              disabled={isRejecting || isPublishing} 
              className="bg-brand-navy hover:bg-brand-navy-hover text-white w-1/2"
            >
              {isPublishing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
              Publish
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
