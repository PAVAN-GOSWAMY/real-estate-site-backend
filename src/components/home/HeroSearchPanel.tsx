"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, IndianRupee, Layers, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { budgets } from "@/data/search"; // We only keep static budgets
import { getLocationsByCityAction } from "@/modules/locations/locations.actions";

interface HeroSearchPanelProps {
  filterOptions: { cities: { id: string; name: string; slug: string }[]; types: string[]; configs: string[]; builders: string[]; statuses: string[] };
}

export function HeroSearchPanel({ filterOptions }: HeroSearchPanelProps) {
  const router = useRouter();

  const [cityId, setCityId] = useState<string>("all");
  const [locationId, setLocationId] = useState<string>("all");
  const [locations, setLocations] = useState<{ id: string; name: string; type: string; slug: string }[]>([]);

  const [type, setType] = useState<string>("all");
  const [config, setConfig] = useState<string>("all");
  const [budget, setBudget] = useState<string>("all");
  const [builder, setBuilder] = useState<string>("all");

  React.useEffect(() => {
    if (cityId && cityId !== "all") {
      getLocationsByCityAction(cityId).then(data => setLocations(data));
    } else {
      setLocations([]);
    }
    setLocationId("all");
  }, [cityId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (cityId && cityId !== "all") {
      const cityData = filterOptions.cities.find(c => c.id === cityId);
      if (cityData) params.set('city', cityData.slug);
    }

    if (locationId && locationId !== "all") {
      const locData = locations.find(l => l.id === locationId);
      if (locData) params.set('location', locData.slug);
    }

    if (type && type !== "all") params.set('type', type);
    if (config && config !== "all") params.set('config', config);
    if (budget && budget !== "all") params.set('budget', budget);
    if (builder && builder !== "all") params.set('builder', builder);

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="bg-[#f8f9fa]/95 backdrop-blur-md rounded-[32px] shadow-xl p-3 md:p-4 w-full border border-white/20 relative z-20 mx-auto max-w-7xl">
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 items-end">

        {/* City Select */}
        <div className="space-y-1.5 px-1">
          <label className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5 ml-2">
            <MapPin className="w-3 h-3 text-muted-foreground/40" /> CITY
          </label>
          <Select value={cityId} onValueChange={setCityId}>
            <SelectTrigger className="w-full bg-white/60 border-slate-200/60 shadow-sm h-[46px] text-sm focus:ring-slate-400 rounded-full px-4 hover:bg-white transition-colors">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {filterOptions.cities.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Select */}
        <div className="space-y-1.5 px-1">
          <label className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5 ml-2">
            <MapPin className="w-3 h-3 text-muted-foreground/40" /> LOCATION
          </label>
          <Select value={locationId} onValueChange={setLocationId} disabled={cityId === "all"}>
            <SelectTrigger className="w-full bg-white/60 border-slate-200/60 shadow-sm h-[46px] text-sm focus:ring-slate-400 rounded-full px-4 hover:bg-white transition-colors">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Property Type Select */}
        <div className="space-y-1.5 px-1">
          <label className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5 ml-2">
            <Home className="w-3 h-3 text-muted-foreground/40" /> PROPERTY TYPE
          </label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full bg-white/60 border-slate-200/60 shadow-sm h-[46px] text-sm focus:ring-slate-400 rounded-full px-4 hover:bg-white transition-colors">
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

        {/* Builder Select */}
        <div className="space-y-1.5 px-1">
          <label className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5 ml-2">
            <HardHat className="w-3 h-3 text-muted-foreground/40" /> BUILDER
          </label>
          <Select value={builder} onValueChange={setBuilder}>
            <SelectTrigger className="w-full bg-white/60 border-slate-200/60 shadow-sm h-[46px] text-sm focus:ring-slate-400 rounded-full px-4 hover:bg-white transition-colors">
              <SelectValue placeholder="All Builders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Builders</SelectItem>
              {filterOptions.builders.map((b) => {
                const val = b.toLowerCase().replace(/ /g, '-');
                return (
                  <SelectItem key={val} value={val}>
                    {b}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Configuration Field */}
        <div className="space-y-1.5 px-1">
          <label className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5 ml-2">
            <Layers className="w-3 h-3 text-muted-foreground/40" /> CONFIGURATION
          </label>
          <Select value={config} onValueChange={setConfig}>
            <SelectTrigger className="w-full bg-white/60 border-slate-200/60 shadow-sm h-[46px] text-sm focus:ring-slate-400 rounded-full px-4 hover:bg-white transition-colors">
              <SelectValue placeholder="Any Configuration" />
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
        <div className="space-y-1.5 px-1">
          <label className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5 ml-2">
            <IndianRupee className="w-3 h-3 text-muted-foreground/40" /> BUDGET
          </label>
          <Select value={budget} onValueChange={setBudget}>
            <SelectTrigger className="w-full bg-white/60 border-slate-200/60 shadow-sm h-[46px] text-sm focus:ring-slate-400 rounded-full px-4 hover:bg-white transition-colors">
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
        <div className="px-1 xl:pb-[1px]">
          <Button
            type="submit"
            className="w-full h-[46px] bg-[#1a1a1a] text-white hover:bg-black text-sm font-semibold group transition-all rounded-full shadow-md mt-6 xl:mt-0"
          >
            Search
            <Search className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
          </Button>
        </div>
      </form>
    </div>
  );
}
