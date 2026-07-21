"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

// Map common route segments to readable names
const routeMap: Record<string, string> = {
  admin: "Dashboard",
  builders: "Builders",
  properties: "Properties",
  "property-types": "Property Types",
  amenities: "Amenities",
  locations: "Locations",
  media: "Media Library",
  leads: "Leads",
  "property-inquiries": "Property Inquiries",
  "site-visits": "Site Visits",
  careers: "Careers",
  jobs: "Jobs",
  applications: "Applications",
  testimonials: "Testimonials",
  faqs: "FAQs",
  blogs: "Blogs",
  banners: "Banners",
  users: "Users",
  settings: "Settings",
  profile: "Profile",
  new: "Add New",
  edit: "Edit",
};

export function AdminBreadcrumb() {
  const pathname = usePathname();
  
  // Exclude empty segments
  const segments = pathname.split("/").filter(Boolean);
  
  // Only show breadcrumbs in the /admin area
  if (segments[0] !== "admin") return null;

  return (
    <Breadcrumb className="hidden md:flex mb-4">
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = "/" + segments.slice(0, index + 1).join("/");
          
          // Try to map the segment to a readable name, fallback to title case
          let readableName = routeMap[segment];
          if (!readableName) {
            // For dynamic IDs like [id] or UUIDs, we might want to just show "Details" or truncate it
            if (segment.length > 20) {
              readableName = "Details";
            } else {
              readableName = segment.charAt(0).toUpperCase() + segment.slice(1);
            }
          }

          return (
            <Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{readableName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{readableName}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
