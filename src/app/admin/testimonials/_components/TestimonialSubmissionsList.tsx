"use client";

import Image from "next/image";
import { User, Star, MessageSquare } from "lucide-react";
import { TestimonialSubmission } from "@/modules/testimonials/types";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { ReviewSubmissionDialog } from "./ReviewSubmissionDialog";
import { format } from "date-fns";

export function TestimonialSubmissionsList({ submissions }: { submissions: TestimonialSubmission[] }) {
  if (!submissions || submissions.length === 0) {
    return (
      <EmptyState 
        title="No submissions found" 
        description="There are no customer feedback submissions in this category." 
        icon={MessageSquare} 
        className="bg-card shadow-sm" 
      />
    );
  }

  return (
    <div className="rounded-md border border-brand-slate/50 bg-white overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-slate/50 text-sm">
          <thead className="bg-brand-surface">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-brand-navy/70">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy/70">Rating</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy/70">Message</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy/70">Date</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy/70">Status</th>
              <th className="px-4 py-3 text-right font-medium text-brand-navy/70">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-slate/50">
            {submissions.map((submission) => (
              <tr key={submission.id} className="hover:bg-brand-surface/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 bg-brand-surface rounded-full overflow-hidden border border-brand-slate/20 shrink-0">
                      {submission.profileImageUrl ? (
                        <Image unoptimized src={submission.profileImageUrl} alt={submission.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-blue/50">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-brand-navy">{submission.name}</p>
                      {submission.location && (
                        <p className="text-xs text-brand-navy/60">{submission.location}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    <span className="font-medium text-brand-navy mr-1">{submission.rating}</span>
                    <Star className="w-4 h-4 fill-amber-500" />
                  </div>
                </td>
                <td className="px-4 py-3 text-brand-navy/70 max-w-[200px] truncate">
                  {submission.message}
                </td>
                <td className="px-4 py-3 text-brand-navy/70">
                  {submission.createdAt ? format(new Date(submission.createdAt), "MMM d, yyyy") : "-"}
                </td>
                <td className="px-4 py-3">
                  <Badge 
                    variant={submission.status === 'pending' ? 'secondary' : submission.status === 'rejected' ? 'destructive' : 'default'}
                    className={submission.status === 'pending' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''}
                  >
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  {submission.status === 'pending' && (
                    <ReviewSubmissionDialog submission={submission} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
