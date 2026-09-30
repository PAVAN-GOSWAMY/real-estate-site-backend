"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export function PropertySort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const sort = searchParams.get("sort") || "recommended";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Reset pagination on sort change
    
    if (value === "recommended") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-brand-blue whitespace-nowrap hidden sm:inline-block">Sort by:</span>
      <Select value={sort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px] bg-white border-brand-slate h-10 focus:ring-brand-red">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recommended">Recommended</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="possession">Possession Date</SelectItem>
          <SelectItem value="newest">Newest Projects</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
