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
import { PropertyStatus, PropertyType } from "@/modules/properties/types/enums";
import { Builder } from "@/modules/builders/types/builder";

interface PropertiesFilterProps {
  builders: Builder[];
}

export function PropertiesFilter({ builders }: PropertiesFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchTerm, 400);

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
      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

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
      router.push(pathname);
    });
  };

  const removeFilter = (key: string) => {
    if (key === "search") setSearchTerm("");
    handleFilterChange(key, "");
  };

  const statusFilter = searchParams.get("status");
  const typeFilter = searchParams.get("propertyType");
  const builderFilter = searchParams.get("builderId");
  const featuredFilter = searchParams.get("featured");
  const hasFilters = searchTerm || statusFilter || typeFilter || builderFilter || featuredFilter;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col xl:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties by title, code..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Select
            value={statusFilter || "all"}
            onValueChange={(val) => handleFilterChange("status", val)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.values(PropertyStatus).map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={typeFilter || "all"}
            onValueChange={(val) => handleFilterChange("propertyType", val)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.values(PropertyType).map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={builderFilter || "all"}
            onValueChange={(val) => handleFilterChange("builderId", val)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Builder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Builders</SelectItem>
              {builders.map(b => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={featuredFilter || "all"}
            onValueChange={(val) => handleFilterChange("featured", val)}
          >
            <SelectTrigger className="w-[140px]">
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
              <Button variant="ghost" size="icon" className="h-4 w-4 ml-2 rounded-full" onClick={() => removeFilter("search")}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {statusFilter && (
            <Badge variant="secondary" className="px-3 py-1 font-normal capitalize">
              Status: {statusFilter}
              <Button variant="ghost" size="icon" className="h-4 w-4 ml-2 rounded-full" onClick={() => removeFilter("status")}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {typeFilter && (
            <Badge variant="secondary" className="px-3 py-1 font-normal capitalize">
              Type: {typeFilter}
              <Button variant="ghost" size="icon" className="h-4 w-4 ml-2 rounded-full" onClick={() => removeFilter("propertyType")}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {builderFilter && (
            <Badge variant="secondary" className="px-3 py-1 font-normal capitalize">
              Builder: {builders.find(b => b.id === builderFilter)?.name || "Unknown"}
              <Button variant="ghost" size="icon" className="h-4 w-4 ml-2 rounded-full" onClick={() => removeFilter("builderId")}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {featuredFilter && (
            <Badge variant="secondary" className="px-3 py-1 font-normal capitalize">
              {featuredFilter === "true" ? "Featured" : "Not Featured"}
              <Button variant="ghost" size="icon" className="h-4 w-4 ml-2 rounded-full" onClick={() => removeFilter("featured")}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7 text-xs text-muted-foreground">
            Clear all
          </Button>
        </div>
      )}

      <div aria-live="polite" className="sr-only">
        {isPending ? "Updating results..." : ""}
      </div>
    </div>
  );
}
