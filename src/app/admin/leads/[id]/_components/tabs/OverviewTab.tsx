"use client";

import { Lead } from "@/modules/leads/types";
import { format } from "date-fns";
import { Building2, MapPin, Tag, MessageSquare } from "lucide-react";

interface OverviewTabProps {
  lead: Lead;
}

export function OverviewTab({ lead }: OverviewTabProps) {
  return (
    <div className="space-y-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Contact Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-foreground border-b border-border/50 pb-2">Contact Details</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <span className="text-muted-foreground">Full Name:</span>
              <span className="col-span-2 font-medium text-foreground">{lead.fullName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <span className="text-muted-foreground">Email:</span>
              <span className="col-span-2 text-foreground">{lead.email || "N/A"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <span className="text-muted-foreground">Phone:</span>
              <span className="col-span-2 text-foreground">{lead.phone || "N/A"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <span className="text-muted-foreground">Source:</span>
              <span className="col-span-2 text-foreground">{lead.source}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <span className="text-muted-foreground">Added On:</span>
              <span className="col-span-2 text-foreground">{format(new Date(lead.createdAt), "PPP p")}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <span className="text-muted-foreground">Updated On:</span>
              <span className="col-span-2 text-foreground">{format(new Date(lead.updatedAt), "PPP p")}</span>
            </div>
          </div>
        </div>

        {/* Lead Properties & Status */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-foreground border-b border-border/50 pb-2">Lead Information</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span className="col-span-2 text-foreground">{lead.status}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <span className="text-muted-foreground">Priority:</span>
              <span className="col-span-2 text-foreground">{lead.priority}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <span className="text-muted-foreground">Next Follow-up:</span>
              <span className="col-span-2 text-foreground">
                {lead.nextFollowUp ? format(new Date(lead.nextFollowUp), "PPP p") : "None scheduled"}
              </span>
            </div>
            {lead.budget && (
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-muted-foreground">Budget:</span>
                <span className="col-span-2 font-medium text-foreground">{lead.budget}</span>
              </div>
            )}
            {lead.preferredVisitDate && (
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-muted-foreground">Preferred Visit:</span>
                <span className="col-span-2 font-medium text-foreground">{format(new Date(lead.preferredVisitDate), "PPP")}</span>
              </div>
            )}
            {lead.tags && lead.tags.length > 0 && (
              <div className="grid grid-cols-3 gap-2 text-sm items-center mt-2">
                <span className="text-muted-foreground">Tags:</span>
                <div className="col-span-2 flex flex-wrap gap-1">
                  {lead.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-muted text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Linked Property Interest */}
      {(lead.propertyName || lead.builderName) && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-foreground border-b border-border/50 pb-2">Property Interest</h3>
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              {lead.propertyName && <h4 className="font-medium text-foreground">{lead.propertyName}</h4>}
              {lead.builderName && <p className="text-sm text-muted-foreground">{lead.builderName}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Original Message */}
      {lead.message && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-foreground border-b border-border/50 pb-2">Original Inquiry Message</h3>
          <div className="bg-muted/30 rounded-lg p-4 border border-border/50 text-sm text-foreground whitespace-pre-wrap leading-relaxed flex gap-3">
            <MessageSquare className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>{lead.message}</div>
          </div>
        </div>
      )}
      
    </div>
  );
}
