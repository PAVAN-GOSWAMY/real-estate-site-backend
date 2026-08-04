"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "./DashboardProvider";
import { getCrmKpisAction } from "@/modules/analytics/actions/analytics.actions";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export function PipelineFunnel() {
  const { filters } = useDashboard();
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFunnel = async () => {
      setLoading(true);
      try {
        const kpis = await getCrmKpisAction(filters);
        if (kpis) {
          // Construct the funnel in order
          setData([
            { name: "New", value: kpis.new_leads },
            { name: "Contacted", value: kpis.contacted },
            { name: "Site Visit", value: kpis.site_visits },
            { name: "Negotiation", value: kpis.negotiation },
            { name: "Won", value: kpis.closed_won },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch funnel", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFunnel();
  }, [filters]);

  const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#059669"];

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 h-[400px] flex flex-col">
      <h3 className="font-semibold text-foreground mb-6">Sales Pipeline</h3>
      <div className="flex-1 w-full relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : data.length === 0 || data.every(d => d.value === 0) ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            No pipeline data for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "currentColor", className: "text-xs text-muted-foreground" }} 
              />
              <Tooltip 
                cursor={{ fill: "transparent" }}
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px"
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
