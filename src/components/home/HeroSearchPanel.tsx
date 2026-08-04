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

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-4 md:p-6 w-full border border-white/20 relative z-20">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 md:gap-5 items-end">

        {/* City Select */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-accent" /> City
          </label>
          <Select value={cityId} onValueChange={setCityId}>
            <SelectTrigger className="w-full bg-muted/30 border-input h-14 text-base focus:ring-accent rounded-xl">
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
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-accent" /> Location
          </label>
          <Select value={locationId} onValueChange={setLocationId} disabled={cityId === "all"}>
            <SelectTrigger className="w-full bg-muted/30 border-input h-14 text-base focus:ring-accent rounded-xl">
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

        {/* Builder Select */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <HardHat className="w-3.5 h-3.5 text-accent" /> Builder
          </label>
          <Select value={builder} onValueChange={setBuilder}>
            <SelectTrigger className="w-full bg-muted/30 border-input h-14 text-base focus:ring-accent rounded-xl">
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
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-1 xl:col-start-auto">
          <Button
            type="submit"
            className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold group transition-all rounded-xl shadow-lg"
          >
            Search
            <Search className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </form>
    </div>
  );
}
