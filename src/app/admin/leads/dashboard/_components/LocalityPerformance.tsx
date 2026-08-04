"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "./DashboardProvider";
import { getLocalityPerformanceAction } from "@/modules/analytics/actions/analytics.actions";
import { LocalityPerformance as ILocalityPerformance } from "@/modules/analytics/types";

export function LocalityPerformance() {
  const { filters } = useDashboard();
  const [data, setData] = useState<ILocalityPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      setLoading(true);
      try {
        const perf = await getLocalityPerformanceAction(5, filters);
        setData(perf);
      } catch (error) {
        console.error("Failed to fetch locality performance", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, [filters]);

  return (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden flex flex-col">
      <div className="p-6 border-b border-border/50">
        <h3 className="font-semibold text-foreground">Top Localities</h3>
      </div>
      
      <div className="flex-1 overflow-x-auto relative min-h-[200px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            No locality data for this period
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-muted/50 uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">Locality</th>
                <th className="px-6 py-3 font-medium text-right">Properties</th>
                <th className="px-6 py-3 font-medium text-right">Leads</th>
                <th className="px-6 py-3 font-medium text-right">Won</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{item.locality_name}</td>
                  <td className="px-6 py-4 text-right text-muted-foreground">{item.property_count}</td>
                  <td className="px-6 py-4 text-right font-medium">{item.total_leads}</td>
                  <td className="px-6 py-4 text-right text-emerald-600 font-medium">{item.won_deals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
