"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, IndianRupee, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { budgets } from "@/data/search"; // We only keep static budgets

interface HeroSearchPanelProps {
  filterOptions: { locations: string[]; types: string[]; configs: string[]; builders: string[]; statuses: string[] };
}

export function HeroSearchPanel({ filterOptions }: HeroSearchPanelProps) {
  const router = useRouter();
  
  const [location, setLocation] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [config, setConfig] = useState<string>("all");
  const [budget, setBudget] = useState<string>("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (location && location !== "all") params.set('location', location);
    if (type && type !== "all") params.set('type', type);
    if (config && config !== "all") params.set('config', config);
    if (budget && budget !== "all") params.set('budget', budget);

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-4 md:p-6 w-full border border-white/20 relative z-20">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5 items-end">
        
        {/* Location Select */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-accent" /> Location
          </label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full bg-muted/30 border-input h-14 text-base focus:ring-accent rounded-xl">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {filterOptions.locations.map((loc) => {
                const val = loc.toLowerCase().replace(/ /g, '-');
                return (
                  <SelectItem key={val} value={val}>
                    {loc}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Property Type Select */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-accent" /> Property Type
          </label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full bg-muted/30 border-input h-14 text-base focus:ring-accent rounded-xl">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {filterOptions.types.map((t) => {
                const val = t.toLowerCase().replace(/ /g, '-');
                return (
                  <SelectItem key={val} value={val}>
                    {t}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Configuration Field */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-accent" /> Configuration
          </label>
          <Select value={config} onValueChange={setConfig}>
            <SelectTrigger className="w-full bg-muted/30 border-input h-14 text-base focus:ring-accent rounded-xl">
              <SelectValue placeholder="Any BHK" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Configuration</SelectItem>
              {filterOptions.configs.map((c) => {
                const val = c.toLowerCase().replace(/ /g, '-');
                return (
                  <SelectItem key={val} value={val}>
                    {c}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Budget Field */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-accent" /> Budget
          </label>
          <Select value={budget} onValueChange={setBudget}>
            <SelectTrigger className="w-full bg-muted/30 border-input h-14 text-base focus:ring-accent rounded-xl">
              <SelectValue placeholder="Any Budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Budget</SelectItem>
              {budgets.map((b) => (
                <SelectItem key={b.value} value={b.value}>
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 lg:col-span-1">
          <Button 
            type="submit" 
            className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold group transition-all rounded-xl shadow-lg"
          >
            Search Properties
            <Search className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </form>
    </div>
  );
}
