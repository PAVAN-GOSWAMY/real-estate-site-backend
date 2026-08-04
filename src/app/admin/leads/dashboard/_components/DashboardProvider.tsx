"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { AnalyticsFilters } from "@/modules/analytics/types";
import { subDays } from "date-fns";

interface DashboardContextType {
  filters: AnalyticsFilters;
  setFilters: React.Dispatch<React.SetStateAction<AnalyticsFilters>>;
  setDateRange: (range: "7days" | "30days" | "90days" | "thisYear" | "all") => void;
  activePreset: string;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activePreset, setActivePreset] = useState("30days");
  
  // Default to last 30 days
  const [filters, setFilters] = useState<AnalyticsFilters>({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  });

  const setDateRange = (range: "7days" | "30days" | "90days" | "thisYear" | "all") => {
    setActivePreset(range);
    const today = new Date();
    
    switch (range) {
      case "7days":
        setFilters({ startDate: subDays(today, 7), endDate: today });
        break;
      case "30days":
        setFilters({ startDate: subDays(today, 30), endDate: today });
        break;
      case "90days":
        setFilters({ startDate: subDays(today, 90), endDate: today });
        break;
      case "thisYear":
        setFilters({ startDate: new Date(today.getFullYear(), 0, 1), endDate: today });
        break;
      case "all":
        setFilters({ startDate: undefined, endDate: undefined });
        break;
    }
  };

  return (
    <DashboardContext.Provider value={{ filters, setFilters, setDateRange, activePreset }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
