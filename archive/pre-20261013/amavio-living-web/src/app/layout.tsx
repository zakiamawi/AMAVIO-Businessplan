import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { SiteFooter } from "@/components/page-chrome";
import { getSiteUrl, hasProductionSiteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AMAVIO Living | Workforce Housing & Integration",
    template: "%s | AMAVIO Living",
  },
  description:
    "AMAVIO Living organisiert Wohnen, Bezugsfertigkeit und Ankunft für Arbeitgeber mit internationalem Fachkräftebedarf.",
  metadataBase: getSiteUrl(),
  robots: hasProductionSiteUrl()
    ? { index: true, follow: true }
    : { index: false, follow: false, noarchive: true },
  openGraph: {
    title: "AMAVIO Living",
    description: "Wohnen. Ankommen. Dazugehören.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable}`}>
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
