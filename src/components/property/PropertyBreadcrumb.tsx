import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { locations } from "@/data/locations";

interface PropertyBreadcrumbProps {
  city?: string | null;
  locality?: string | null;
  title: string;
}

export function PropertyBreadcrumb({ city, locality, title }: PropertyBreadcrumbProps) {
  const normalizedLocality = locality?.toLowerCase() ?? "";
  const normalizedCity = city?.toLowerCase() ?? "";

  const match = locations.find(
    (l) => {
      const lName = l.name.toLowerCase();
      return (normalizedLocality && lName === normalizedLocality) || 
             (normalizedCity && lName === normalizedCity);
    }
  );

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
      <Link href="/" className="hover:text-primary transition-colors flex items-center">
        <Home className="h-4 w-4" />
      </Link>
      <ChevronRight className="h-4 w-4 shrink-0" />
      <Link href="/properties" className="hover:text-primary transition-colors">
        Properties
      </Link>
      {match ? (
        <>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <Link href={`/locations/${match.slug}`} className="hover:text-primary transition-colors">
            {match.name}
          </Link>
        </>
      ) : city ? (
        <>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <Link href={`/properties?location=${normalizedCity.replace(/ /g, '-')}`} className="hover:text-primary transition-colors">
            {city}
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
