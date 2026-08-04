"use client";

import { LeadActivity } from "@/modules/leads/types";
import { format } from "date-fns";
import { Circle, User, Settings, FileText, Calendar, CheckCircle, Phone, MessageSquare, Mail } from "lucide-react";

interface ActivityTabProps {
  activities: LeadActivity[];
}

export function ActivityTab({ activities }: ActivityTabProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "Lead Created": return <User className="h-4 w-4 text-emerald-500" />;
      case "Status Changed": return <Settings className="h-4 w-4 text-blue-500" />;
      case "Note Added": return <FileText className="h-4 w-4 text-amber-500" />;
      case "Follow-up Scheduled": return <Calendar className="h-4 w-4 text-purple-500" />;
      case "Lead Assigned": return <User className="h-4 w-4 text-indigo-500" />;
      case "Follow-up Updated": return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "Phone Call Initiated": return <Phone className="h-4 w-4 text-amber-500" />;
      case "WhatsApp Opened": return <MessageSquare className="h-4 w-4 text-emerald-500" />;
      case "Email Draft Opened": return <Mail className="h-4 w-4 text-blue-500" />;
      default: return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg text-foreground border-b border-border/50 pb-2">Activity Timeline</h3>
      
      {activities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-border/50 border-dashed">
          No activity recorded yet.
        </div>
      ) : (
        <div className="relative pl-6 space-y-8 border-l-2 border-border/50 ml-4 py-2">
          {activities.map((activity) => (
            <div key={activity.id} className="relative">
              {/* Timeline dot/icon */}
              <div className="absolute -left-[35px] bg-background border border-border p-1.5 rounded-full z-10 shadow-sm">
                {getIcon(activity.actionType)}
              </div>
              
              <div className="bg-card border border-border/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <span className="font-semibold text-foreground">{activity.actionType}</span>
                  <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
                    {format(new Date(activity.createdAt), "MMM d, h:mm a")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 w-fit px-2 py-1 rounded">
                  <User className="h-3 w-3" />
                  <span>{activity.createdByEmail.split('@')[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
