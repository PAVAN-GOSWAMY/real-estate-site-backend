import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist } from "next/font/google";
import { Toaster } from "sonner";
import { RootLayoutWrapper } from "@/components/layout/RootLayoutWrapper";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Premium Real Estate in Noida & NCR`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

import { SettingsService } from "@/modules/settings/services/settings.service";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await SettingsService.getSiteStatsSettings();
  
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, playfair.variable, "font-sans", geist.variable, "scroll-pt-16 md:scroll-pt-[72px]")}
    >
      <body className="min-h-full flex flex-col bg-background">
        <RootLayoutWrapper settings={settings}>
          {children}
        </RootLayoutWrapper>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
