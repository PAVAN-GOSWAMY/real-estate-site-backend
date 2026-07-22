"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/useDebounce";

interface PropertyFiltersProps {
  locations?: string[];
  builders?: string[];
  types?: string[];
  configs?: string[];
  statuses?: string[];
}

export function PropertyFilters({
  locations = [],
  builders = [],
  types = [],
  configs = [],
  statuses = []
}: PropertyFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for search to debounce it
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const debouncedSearch = useDebounce(searchQuery, 500);

  const updateFilter = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      
      // Reset page to 1 when changing filters
      params.set("page", "1");
      
      if (value === "all" || !value) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      
      router.push(pathname + "?" + params.toString(), { scroll: false });
    },
    [searchParams, pathname, router]
  );

  // Sync debounced search to URL
  useEffect(() => {
    if (debouncedSearch !== (searchParams.get("q") || "")) {
      updateFilter("q", debouncedSearch || "all");
    }
  }, [debouncedSearch, searchParams, updateFilter]);

  // Removed conflicting useEffect that was syncing searchParams to searchQuery
  // to prevent infinite render loops during navigation.

  const clearFilters = () => {
    setSearchQuery("");
    // Keep only the sort parameter if it exists
    const sort = searchParams.get("sort");
    if (sort) {
      router.push(`${pathname}?sort=${sort}`, { scroll: false });
    } else {
      router.push(pathname, { scroll: false });
    }
  };

  const getParam = (name: string) => searchParams.get(name) || "all";

  // Format helper
  const formatSlug = (str: string) => str.toLowerCase().replace(/ /g, '-');

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Project, location, or builder..." 
            className="pl-9 bg-background h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Location</Label>
        <Select value={getParam("location")} onValueChange={(val) => updateFilter("location", val)}>
          <SelectTrigger className="h-11 bg-background">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map(loc => (
              <SelectItem key={loc} value={formatSlug(loc)}>{loc}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Budget</Label>
        <Select value={getParam("budget")} onValueChange={(val) => updateFilter("budget", val)}>
          <SelectTrigger className="h-11 bg-background">
            <SelectValue placeholder="Any Budget" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Budget</SelectItem>
            <SelectItem value="under-3">Under ₹3 Cr</SelectItem>
            <SelectItem value="3-5">₹3 Cr - ₹5 Cr</SelectItem>
            <SelectItem value="5-10">₹5 Cr - ₹10 Cr</SelectItem>
            <SelectItem value="above-10">Above ₹10 Cr</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Property Type</Label>
        <Select value={getParam("type")} onValueChange={(val) => updateFilter("type", val)}>
          <SelectTrigger className="h-11 bg-background">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map(t => (
              <SelectItem key={t} value={formatSlug(t)}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Configuration</Label>
        <Select value={getParam("config")} onValueChange={(val) => updateFilter("config", val)}>
          <SelectTrigger className="h-11 bg-background">
            <SelectValue placeholder="All Configurations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Configurations</SelectItem>
            {configs.map(c => (
              <SelectItem key={c} value={formatSlug(c)}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Builder</Label>
        <Select value={getParam("builder")} onValueChange={(val) => updateFilter("builder", val)}>
          <SelectTrigger className="h-11 bg-background">
            <SelectValue placeholder="All Builders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Builders</SelectItem>
            {builders.map(b => (
              <SelectItem key={b} value={formatSlug(b)}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Status</Label>
        <Select value={getParam("status")} onValueChange={(val) => updateFilter("status", val)}>
          <SelectTrigger className="h-11 bg-background">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map(s => (
              <SelectItem key={s} value={formatSlug(s)}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {Array.from(searchParams.keys()).filter(k => k !== 'sort' && k !== 'page').length > 0 && (
        <Button variant="outline" className="w-full mt-4 h-11 border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" /> Clear All Filters
        </Button>
      )}
    </div>
  );
}
