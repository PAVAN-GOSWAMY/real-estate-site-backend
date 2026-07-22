"use client";

import { Card } from "@/components/ui/card";
import { Users, UserPlus, PhoneCall, Calendar, Handshake, Trophy, XCircle } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface DashboardMetricsCardsProps {
  metrics: {
    totalLeads: number;
    newLeads: number;
    contactedLeads: number;
    siteVisitLeads: number;
    negotiationLeads: number;
    wonLeads: number;
    lostLeads: number;
  };
}

export function DashboardMetricsCards({ metrics }: DashboardMetricsCardsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const currentStatus = searchParams.get("status") || "all";

  const handleFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.delete("page"); // Reset pagination
    router.push(`${pathname}?${params.toString()}`);
  };

  const cards = [
    { title: "Total Leads", count: metrics.totalLeads, value: "all", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "New", count: metrics.newLeads, value: "New", icon: UserPlus, color: "text-sky-500", bg: "bg-sky-500/10", border: "border-sky-500/20" },
    { title: "Contacted", count: metrics.contactedLeads, value: "Contacted", icon: PhoneCall, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { title: "Site Visit", count: metrics.siteVisitLeads, value: "Site Visit Scheduled", icon: Calendar, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { title: "Negotiation", count: metrics.negotiationLeads, value: "Negotiation", icon: Handshake, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { title: "Closed Won", count: metrics.wonLeads, value: "Won", icon: Trophy, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { title: "Closed Lost", count: metrics.lostLeads, value: "Lost", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {cards.map((card) => (
        <Card 
          key={card.value}
          onClick={() => handleFilter(card.value)}
          className={`p-4 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${
            currentStatus === card.value 
              ? `ring-2 ring-primary/50 shadow-md ${card.bg}` 
              : `hover:bg-muted/50 ${card.border}`
          }`}
        >
          <div className="flex flex-col gap-2">
            <div className={`p-2 w-max rounded-lg ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{card.count}</p>
              <p className="text-xs font-medium text-muted-foreground">{card.title}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
