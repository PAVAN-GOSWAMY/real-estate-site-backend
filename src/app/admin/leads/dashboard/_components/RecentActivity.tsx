"use client";

import { useEffect, useState } from "react";
import { getRecentActivityAction } from "@/modules/analytics/actions/analytics.actions";
import { format } from "date-fns";
import { Circle, User, Settings, FileText, Calendar, CheckCircle, Phone, MessageSquare, Mail } from "lucide-react";

export function RecentActivity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getRecentActivityAction(10);
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch activities", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

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
    <div className="bg-card border border-border/50 rounded-xl p-6 h-full flex flex-col">
      <h3 className="font-semibold text-foreground mb-6">Recent CRM Activity</h3>
      
      <div className="flex-1 overflow-y-auto pr-2">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No recent activity</div>
        ) : (
          <div className="relative pl-6 space-y-6 border-l-2 border-border/50 ml-2">
            {activities.map((activity) => (
              <div key={activity.id} className="relative">
                <div className="absolute -left-[33px] bg-card border border-border p-1.5 rounded-full z-10">
                  {getIcon(activity.action_type)}
                </div>
                
                <div>
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="font-medium text-sm text-foreground">
                      {activity.leads?.full_name || "Unknown"}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
                      {format(new Date(activity.created_at), "MMM d, h:mm a")}
                    </span>
                  </div>
                  
                  <div className="text-xs text-foreground mb-1">
                    <span className="font-semibold">{activity.action_type}</span>
                    {activity.leads?.properties?.title && (
                      <span className="text-muted-foreground"> &bull; {activity.leads.properties.title}</span>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted/40 w-fit px-2 py-0.5 rounded">
                    <User className="h-3 w-3" />
                    <span>{activity.created_by_email.split('@')[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
