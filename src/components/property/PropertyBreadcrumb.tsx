import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface PropertyBreadcrumbProps {
  city?: string | null;
  locality?: string | null;
  title: string;
  citySlug?: string | null;
  locationSlug?: string | null;
}

export function PropertyBreadcrumb({ city, locality, title, citySlug, locationSlug }: PropertyBreadcrumbProps) {
  const normalizedCity = city?.toLowerCase() ?? "";

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
      <Link href="/" className="hover:text-primary transition-colors flex items-center">
        <Home className="h-4 w-4" />
      </Link>
      <ChevronRight className="h-4 w-4 shrink-0" />
      <Link href="/properties" className="hover:text-primary transition-colors">
        Properties
      </Link>
      {city ? (
        <>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <Link 
            href={`/properties?${citySlug ? `city=${citySlug}` : `location=${normalizedCity.replace(/ /g, '-')}`}`} 
            className="hover:text-primary transition-colors"
          >
            {city}
          </Link>
        </>
      ) : null}
      {locality ? (
        <>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <Link 
            href={`/properties?${locationSlug ? `location=${locationSlug}` : `location=${locality.toLowerCase().replace(/ /g, '-')}`}`} 
            className="hover:text-primary transition-colors"
          >
            {locality}
          </Link>
        </>
      ) : null}
      <ChevronRight className="h-4 w-4 shrink-0" />
      <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
        {title}
      </span>
    </nav>
  );
}
