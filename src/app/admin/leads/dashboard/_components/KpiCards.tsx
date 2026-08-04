"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "./DashboardProvider";
import { getCrmKpisAction } from "@/modules/analytics/actions/analytics.actions";
import { KpiMetrics } from "@/modules/analytics/types";
import { Users, UserPlus, Phone, Calendar, Briefcase, CheckCircle, XCircle, TrendingUp, Activity } from "lucide-react";

export function KpiCards() {
  const { filters } = useDashboard();
  const [metrics, setMetrics] = useState<KpiMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpis = async () => {
      setLoading(true);
      try {
        const data = await getCrmKpisAction(filters);
        setMetrics(data);
      } catch (error) {
        console.error("Failed to fetch KPIs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchKpis();
  }, [filters]);

  const cards = [
    { title: "Total Leads", value: metrics?.total_leads || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "New Leads", value: metrics?.new_leads || 0, icon: UserPlus, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Contacted", value: metrics?.contacted || 0, icon: Phone, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Site Visits", value: metrics?.site_visits || 0, icon: Calendar, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Negotiation", value: metrics?.negotiation || 0, icon: Briefcase, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Closed Won", value: metrics?.closed_won || 0, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-600/10" },
    { title: "Closed Lost", value: metrics?.closed_lost || 0, icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Conversion Rate", value: `${metrics?.conversion_rate || 0}%`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Active Pipeline", value: metrics?.active_pipeline || 0, icon: Activity, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-28 bg-muted animate-pulse rounded-xl border border-border/50"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <div 
          key={i} 
          className="bg-card border border-border/50 rounded-xl p-5 hover:border-border transition-colors group cursor-default"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
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
