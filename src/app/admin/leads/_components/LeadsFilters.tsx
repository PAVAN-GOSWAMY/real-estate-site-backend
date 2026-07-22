"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEAD_STATUSES, LEAD_SOURCES, LEAD_PRIORITIES } from "@/modules/leads/types";
import { useDebounce } from "@/hooks/use-debounce";

interface LeadsFiltersProps {
  initialFilters: {
    search: string;
    status: string;
    source: string;
    priority: string;
  };
}

export function LeadsFilters({ initialFilters }: LeadsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialFilters.search || "");
  const [status, setStatus] = useState(initialFilters.status || "all");
  const [source, setSource] = useState(initialFilters.source || "all");
  const [priority, setPriority] = useState(initialFilters.priority || "all");

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (debouncedSearch) params.set("search", debouncedSearch);
    else params.delete("search");

    if (status && status !== "all") params.set("status", status);
    else params.delete("status");

    if (source && source !== "all") params.set("source", source);
    else params.delete("source");

    if (priority && priority !== "all") params.set("priority", priority);
    else params.delete("priority");

    params.set("page", "1"); // Reset to page 1 on filter change
    
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedSearch, status, source, priority, pathname, router, searchParams]);

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setSource("all");
    setPriority("all");
  };

  const hasActiveFilters = search || status !== "all" || source !== "all" || priority !== "all";

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <Label htmlFor="search" className="sr-only">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            id="search"
            placeholder="Search leads by name, email, or phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background/50"
          />
        </div>
      </div>
      
      <div className="flex gap-2 flex-wrap md:flex-nowrap">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[160px] bg-background/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {LEAD_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={source} onValueChange={setSource}>
          <SelectTrigger className="w-[160px] bg-background/50">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {LEAD_SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-[140px] bg-background/50">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {LEAD_PRIORITIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
