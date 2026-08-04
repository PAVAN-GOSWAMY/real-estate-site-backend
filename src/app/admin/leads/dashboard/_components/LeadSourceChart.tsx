"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "./DashboardProvider";
import { getLeadSourcesAction } from "@/modules/analytics/actions/analytics.actions";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { LeadSource } from "@/modules/analytics/types";

export function LeadSourceChart() {
  const { filters } = useDashboard();
  const [data, setData] = useState<LeadSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSources = async () => {
      setLoading(true);
      try {
        const sources = await getLeadSourcesAction(filters);
        setData(sources);
      } catch (error) {
        console.error("Failed to fetch sources", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSources();
  }, [filters]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6', '#f43f5e'];

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 h-[400px] flex flex-col">
      <h3 className="font-semibold text-foreground mb-6">Lead Sources</h3>
      <div className="flex-1 w-full relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            No source data for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="lead_count"
                nameKey="source_name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px"
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
