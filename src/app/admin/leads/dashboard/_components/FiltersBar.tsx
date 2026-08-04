"use client";

import { useDashboard } from "./DashboardProvider";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export function FiltersBar() {
  const { setDateRange, activePreset } = useDashboard();

  const presets = [
    { label: "Last 7 Days", value: "7days" },
    { label: "Last 30 Days", value: "30days" },
    { label: "Last 90 Days", value: "90days" },
    { label: "This Year", value: "thisYear" },
    { label: "All Time", value: "all" },
  ] as const;

  return (
    <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border/50 sticky top-0 z-10 shadow-sm mb-8">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
        <h2 className="text-sm font-medium">Date Range</h2>
      </div>
      
      <div className="flex items-center gap-2">
        {presets.map(preset => (
          <Button
            key={preset.value}
            variant={activePreset === preset.value ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange(preset.value)}
            className="rounded-full px-4 text-xs"
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
