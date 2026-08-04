"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "./DashboardProvider";
import { getBuilderPerformanceAction } from "@/modules/analytics/actions/analytics.actions";
import { BuilderPerformance as IBuilderPerformance } from "@/modules/analytics/types";

export function BuilderPerformance() {
  const { filters } = useDashboard();
  const [data, setData] = useState<IBuilderPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      setLoading(true);
      try {
        const perf = await getBuilderPerformanceAction(5, filters);
        setData(perf);
      } catch (error) {
        console.error("Failed to fetch builder performance", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, [filters]);

  return (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden flex flex-col">
      <div className="p-6 border-b border-border/50">
        <h3 className="font-semibold text-foreground">Top Builders</h3>
      </div>
      
      <div className="flex-1 overflow-x-auto relative min-h-[200px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            No builder data for this period
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-muted/50 uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">Builder</th>
                <th className="px-6 py-3 font-medium text-right">Leads</th>
                <th className="px-6 py-3 font-medium text-right">Won</th>
                <th className="px-6 py-3 font-medium text-right">Conv. Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {data.map((item) => (
                <tr key={item.builder_id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{item.builder_name}</td>
                  <td className="px-6 py-4 text-right font-medium">{item.total_leads}</td>
                  <td className="px-6 py-4 text-right text-emerald-600 font-medium">{item.won_deals}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-green-500/10 text-green-600 text-xs font-medium">
                      {item.conversion_rate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
