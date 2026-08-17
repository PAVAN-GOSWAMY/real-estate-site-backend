"use client";

import { usePathname } from "next/navigation";
import { EnquiryModalProvider } from "@/contexts/EnquiryModalContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingContactWidget } from "@/components/contact/FloatingContactWidget";
import { EnquiryModal } from "@/components/common/EnquiryModal";
import { SiteStatsSettings } from "@/modules/settings/services/settings.service";

export function RootLayoutWrapper({ 
  children,
  settings
}: { 
  children: React.ReactNode;
  settings?: SiteStatsSettings;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isAuth = pathname?.startsWith("/login") || pathname?.startsWith("/forgot-password") || pathname?.startsWith("/reset-password");

  if (isAuth) {
    return <main className="flex-1">{children}</main>;
  }

  if (isAdmin) {
    return (
      <EnquiryModalProvider>
        <Navbar />
        <main className="flex-1 pt-[86px]">{children}</main>
        <EnquiryModal />
      </EnquiryModalProvider>
    );
  }

  return (
    <EnquiryModalProvider>
      <Navbar />
      <main className="flex-1 pt-[86px]">
        {children}
        <FloatingContactWidget />
      </main>
      <Footer settings={settings} />
      <EnquiryModal />
    </EnquiryModalProvider>
  );
}
