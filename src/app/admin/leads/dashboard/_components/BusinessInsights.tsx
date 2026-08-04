"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "./DashboardProvider";
import { 
  getBuilderPerformanceAction,
  getPropertyPerformanceAction,
  getLocalityPerformanceAction,
  getCrmKpisAction
} from "@/modules/analytics/actions/analytics.actions";
import { Trophy, TrendingUp, AlertCircle, Building2, MapPin } from "lucide-react";

export function BusinessInsights() {
  const { filters } = useDashboard();
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const [kpis, properties, builders, localities] = await Promise.all([
          getCrmKpisAction(filters),
          getPropertyPerformanceAction(5, filters),
          getBuilderPerformanceAction(5, filters),
          getLocalityPerformanceAction(5, filters)
        ]);

        const newInsights = [];

        if (properties && properties.length > 0) {
          newInsights.push({
            icon: Trophy,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            title: "Top Performing Property",
            description: `${properties[0].property_name} generated ${properties[0].total_leads} leads with a ${properties[0].conversion_rate}% conversion rate.`
          });
        }

        if (builders && builders.length > 0) {
          newInsights.push({
            icon: Building2,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            title: "Top Builder",
            description: `${builders[0].builder_name} leads the chart with ${builders[0].total_leads} total enquiries.`
          });
        }

        if (localities && localities.length > 0) {
          newInsights.push({
            icon: MapPin,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            title: "Highest Demand Locality",
            description: `${localities[0].locality_name} is highly requested, drawing ${localities[0].total_leads} leads across ${localities[0].property_count} properties.`
          });
        }

        if (kpis) {
          if (kpis.conversion_rate > 10) {
            newInsights.push({
              icon: TrendingUp,
              color: "text-green-500",
              bg: "bg-green-500/10",
              title: "Healthy Pipeline",
              description: `Overall conversion rate is sitting at a healthy ${kpis.conversion_rate}%.`
            });
          } else {
            newInsights.push({
              icon: AlertCircle,
              color: "text-rose-500",
              bg: "bg-rose-500/10",
              title: "Pipeline Warning",
              description: `Overall conversion rate is low at ${kpis.conversion_rate}%. Review follow-up strategies.`
            });
          }
        }

        setInsights(newInsights);
      } catch (error) {
        console.error("Failed to fetch insights", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [filters]);

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 h-full">
      <h3 className="font-semibold text-foreground mb-6">Business Insights</h3>
      
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : insights.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">Not enough data for insights</div>
        ) : (
          insights.map((insight, index) => (
            <div key={index} className="flex gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className={`shrink-0 p-2 rounded-full h-fit ${insight.bg}`}>
                <insight.icon className={`h-5 w-5 ${insight.color}`} />
              </div>
              <div>
                <h4 className="font-medium text-sm text-foreground mb-1">{insight.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
