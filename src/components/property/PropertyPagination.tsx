"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyPaginationProps {
  totalPages: number;
  currentPage: number;
}

export function PropertyPagination({ totalPages, currentPage }: PropertyPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    router.push(createPageUrl(page), { scroll: true });
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="h-10 w-10 border-brand-slate text-brand-navy hover:bg-brand-surface hover:text-brand-navy-hover"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous Page</span>
      </Button>
      
      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1;
        const isActive = page === currentPage;
        
        return (
          <Button
            key={page}
            variant={isActive ? "default" : "outline"}
            onClick={() => handlePageChange(page)}
            className={`h-10 w-10 ${isActive ? 'bg-brand-red text-white pointer-events-none border-brand-red' : 'hover:bg-brand-surface border-brand-slate text-brand-navy hover:text-brand-navy-hover'}`}
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="h-10 w-10 border-brand-slate text-brand-navy hover:bg-brand-surface hover:text-brand-navy-hover"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next Page</span>
      </Button>
    </div>
  );
}
