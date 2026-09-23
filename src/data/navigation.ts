export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export const mainNav: NavItem[] = [
  { id: "nav-home", label: "Home", href: "/" },
  { id: "nav-properties", label: "Properties", href: "/properties" },
  { id: "nav-blog", label: "Blog", href: "/blog" },
  { id: "nav-about", label: "About", href: "/about" },
  { id: "nav-career", label: "Career", href: "/career" },
  { id: "nav-contact", label: "Contact", href: "/contact" },
];

export const footerQuickLinks: NavItem[] = [
  { id: "fq-home", label: "Home", href: "/" },
  { id: "fq-properties", label: "Properties", href: "/properties" },
  { id: "fq-blog", label: "Blog", href: "/blog" },
  { id: "fq-about", label: "About Us", href: "/about" },
  { id: "fq-contact", label: "Contact", href: "/contact" },
  { id: "fq-privacy", label: "Privacy Policy", href: "/privacy" },
];

export const footerLocations: NavItem[] = [
  { id: "fl-sector-150", label: "Sector 150, Noida", href: "/properties?location=sector-150" },
  { id: "fl-sector-128", label: "Sector 128, Noida", href: "/properties?location=sector-128" },
  { id: "fl-greater-noida-west", label: "Greater Noida West", href: "/properties?location=greater-noida-west" },
  { id: "fl-yamuna-expressway", label: "Yamuna Expressway", href: "/properties?location=yamuna-expressway" },
];

export const socialLinks: NavItem[] = [
  { id: "social-facebook", label: "Facebook", href: "#" },
  { id: "social-instagram", label: "Instagram", href: "#" },
  { id: "social-twitter", label: "Twitter", href: "#" },
  { id: "social-linkedin", label: "LinkedIn", href: "#" },
];
