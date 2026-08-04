import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingContactWidget } from "@/components/contact/FloatingContactWidget";
import { EnquiryModalProvider } from "@/contexts/EnquiryModalContext";
import { EnquiryModal } from "@/components/common/EnquiryModal";
import { Toaster } from "sonner";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, playfair.variable, "font-sans", geist.variable, "scroll-pt-16 md:scroll-pt-[72px]")}
    >
      <body className="min-h-full flex flex-col bg-background">
        <EnquiryModalProvider>
          <Navbar />
          <main className="flex-1 pt-[114px]">
            {children}
            <FloatingContactWidget />
          </main>
          <Footer />
          <EnquiryModal />
          <Toaster position="bottom-right" richColors />
        </EnquiryModalProvider>
      </body>
    </html>
  );
}
