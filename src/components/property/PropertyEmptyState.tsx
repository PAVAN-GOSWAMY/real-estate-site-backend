"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, XCircle } from "lucide-react";

export function PropertyEmptyState({ searchQuery }: { searchQuery?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-4 bg-background rounded-2xl border border-border/50 shadow-sm">
      <div className="bg-muted p-6 rounded-full mb-6">
        <Home className="h-12 w-12 text-muted-foreground" />
      </div>
      {searchQuery ? (
        <h3 className="font-heading text-2xl font-bold text-primary mb-3">No result found for {searchQuery}</h3>
      ) : (
        <h3 className="font-heading text-2xl font-bold text-primary mb-3">No Properties Found</h3>
      )}
      
      <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
        {searchQuery 
          ? `We couldn't find any properties matching "${searchQuery}". Try adjusting your filters or search for something else.`
          : "We couldn't find any properties matching your exact criteria. Try adjusting your filters or explore our complete collection."
        }
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="outline" 
          onClick={() => router.push(pathname)}
          className="h-12 px-6 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
        <Button 
          onClick={() => router.push(pathname)}
          className="h-12 px-8 bg-primary hover:bg-primary/90"
        >
          Browse All Properties
        </Button>
      </div>
    </div>
  );
}
