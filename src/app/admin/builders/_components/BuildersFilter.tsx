"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";

export function BuildersFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state for instant typing feedback
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Sync local search term with URL if it changes externally
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || !value) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      // Reset to page 1 on any filter change
      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

  // Push search changes to URL when debounced value updates
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (debouncedSearch !== currentSearch) {
      startTransition(() => {
        router.push(`${pathname}?${createQueryString("search", debouncedSearch)}`);
      });
    }
  }, [debouncedSearch, pathname, router, createQueryString, searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString(key, value)}`);
    });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    startTransition(() => {
      router.push(pathname); // Removes all query params
    });
  };

  const removeFilter = (key: string) => {
    if (key === "search") setSearchTerm("");
    handleFilterChange(key, "");
  };

  const activeFilter = searchParams.get("active");
  const featuredFilter = searchParams.get("featured");
  const hasFilters = searchTerm || activeFilter || featuredFilter;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search builders..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search builders"
            data-testid="builder-search-input"
          />
        </div>
        
        <div className="flex gap-4">
          <Select
            value={activeFilter || "all"}
            onValueChange={(val) => handleFilterChange("active", val)}
          >
            <SelectTrigger className="w-[140px]" aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={featuredFilter || "all"}
            onValueChange={(val) => handleFilterChange("featured", val)}
          >
            <SelectTrigger className="w-[140px]" aria-label="Filter by featured">
              <SelectValue placeholder="Featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Featured</SelectItem>
              <SelectItem value="false">Not Featured</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Active Filter Chips */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">Active filters:</span>
          
          {searchTerm && (
            <Badge variant="secondary" className="px-3 py-1 font-normal capitalize">
              Search: &quot;{searchTerm}&quot;
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-2 hover:bg-transparent rounded-full" 
                onClick={() => removeFilter("search")}
                aria-label="Clear search filter"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {activeFilter && (
            <Badge variant="secondary" className="px-3 py-1 font-normal capitalize">
              Status: {activeFilter === "true" ? "Active" : "Inactive"}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-2 hover:bg-transparent rounded-full" 
                onClick={() => removeFilter("active")}
                aria-label="Clear status filter"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {featuredFilter && (
            <Badge variant="secondary" className="px-3 py-1 font-normal capitalize">
              {featuredFilter === "true" ? "Featured" : "Not Featured"}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-2 hover:bg-transparent rounded-full" 
                onClick={() => removeFilter("featured")}
                aria-label="Clear featured filter"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Screen Reader Loading Announcement */}
      <div aria-live="polite" className="sr-only">
        {isPending ? "Updating results..." : ""}
      </div>
    </div>
  );
}
