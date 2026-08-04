"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "./DashboardProvider";
import { getLeadTrendsAction } from "@/modules/analytics/actions/analytics.actions";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LeadTrend } from "@/modules/analytics/types";
import { format, parseISO } from "date-fns";

export function LeadTrendChart() {
  const { filters, activePreset } = useDashboard();
  const [data, setData] = useState<LeadTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Determine optimal interval based on preset
    const getInterval = () => {
      if (activePreset === "7days" || activePreset === "30days") return "day";
      if (activePreset === "90days") return "week";
      return "month";
    };

    const fetchTrends = async () => {
      setLoading(true);
      try {
        const interval = getInterval();
        const trends = await getLeadTrendsAction(interval, filters);
        
        // Format dates for display
        const formatted = trends.map(t => ({
          ...t,
          displayDate: interval === 'month' 
            ? format(parseISO(t.date_bucket), 'MMM yyyy')
            : format(parseISO(t.date_bucket), 'MMM dd')
        }));
        
        setData(formatted);
      } catch (error) {
        console.error("Failed to fetch trends", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, [filters, activePreset]);

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 h-[400px] flex flex-col lg:col-span-2">
      <h3 className="font-semibold text-foreground mb-6">Lead Generation Trends</h3>
      <div className="flex-1 w-full relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            No trend data for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="displayDate" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: "currentColor", className: "text-xs text-muted-foreground" }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: "currentColor", className: "text-xs text-muted-foreground" }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px"
                }}
              />
              <Area 
                type="monotone" 
                dataKey="lead_count" 
                name="Leads"
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorLeads)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
