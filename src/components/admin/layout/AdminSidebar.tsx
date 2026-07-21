"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Home,
  Users,
  Briefcase,
  Settings,
  User,
  MessageSquare,
  FileText,
  MapPin,
  Image as ImageIcon,
  HeartHandshake
} from "lucide-react";
import { siteConfig } from "@/config/site";

const sidebarNav = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Property Management",
    items: [
      { title: "Properties", href: "/admin/properties", icon: Home },
      { title: "Property Types", href: "/admin/property-types", icon: Building2 },
      { title: "Amenities", href: "/admin/amenities", icon: HeartHandshake },
      { title: "Locations", href: "/admin/locations", icon: MapPin },
      { title: "Media Library", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    title: "Builder Management",
    items: [
      { title: "Builders", href: "/admin/builders", icon: Building2 },
    ],
  },
  {
    title: "Lead Management",
    items: [
      { title: "Contact Leads", href: "/admin/leads", icon: Users },
      { title: "Property Inquiries", href: "/admin/property-inquiries", icon: MessageSquare },
      { title: "Site Visits", href: "/admin/site-visits", icon: MapPin },
    ],
  },
  {
    title: "Careers",
    items: [
      { title: "Jobs", href: "/admin/jobs", icon: Briefcase },
      { title: "Applications", href: "/admin/applications", icon: FileText },
    ],
  },
  {
    title: "Content",
    items: [
      { title: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
      { title: "FAQs", href: "/admin/faqs", icon: FileText },
      { title: "Blogs", href: "/admin/blogs", icon: FileText },
      { title: "Banners", href: "/admin/banners", icon: ImageIcon },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Users", href: "/admin/users", icon: Users },
      { title: "Settings", href: "/admin/settings", icon: Settings },
      { title: "Profile", href: "/admin/profile", icon: User },
    ],
  },
];

interface AdminSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function AdminSidebar({ className, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col h-full bg-background border-r", className)}>
      <div className="flex h-14 items-center border-b px-6 font-semibold">
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-2">
          <span>{siteConfig.name} Admin</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-6 px-4">
          {sidebarNav.map((group, index) => (
            <div key={index} className="flex flex-col gap-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                {group.title}
              </h4>
              <div className="flex flex-col gap-1">
                {group.items.map((item, itemIndex) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={itemIndex}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
