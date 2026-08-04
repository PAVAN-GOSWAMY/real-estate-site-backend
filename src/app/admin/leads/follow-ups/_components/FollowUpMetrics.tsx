"use client";

import { Calendar, AlertCircle, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface MetricsProps {
  metrics: {
    today: number;
    upcoming: number;
    overdue: number;
    completedToday: number;
    missed: number;
    cancelled: number;
  }
}

export function FollowUpMetrics({ metrics }: MetricsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const cards = [
    { title: "Today's Tasks", value: metrics.today, icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10", filter: "Scheduled" },
    { title: "Upcoming", value: metrics.upcoming, icon: Calendar, color: "text-indigo-500", bg: "bg-indigo-500/10", filter: "Scheduled" },
    { title: "Overdue", value: metrics.overdue, icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10", filter: "Scheduled" },
    { title: "Completed Today", value: metrics.completedToday, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", filter: "Completed" },
    { title: "Missed", value: metrics.missed, icon: RefreshCw, color: "text-amber-500", bg: "bg-amber-500/10", filter: "Missed" },
    { title: "Cancelled", value: metrics.cancelled, icon: XCircle, color: "text-muted-foreground", bg: "bg-muted/50", filter: "Cancelled" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, i) => (
        <div 
          key={i} 
          onClick={() => handleFilter(card.filter)}
          className="bg-card border border-border/50 rounded-xl p-5 hover:border-border transition-all hover:shadow-sm cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
              {card.title}
            </h3>
            <div className={`p-2 rounded-lg ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
