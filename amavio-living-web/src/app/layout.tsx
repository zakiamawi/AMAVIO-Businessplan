import type { Metadata } from "next";
import { SiteFooter } from "@/components/page-chrome";
import { getSiteUrl, hasProductionSiteUrl } from "@/lib/site-url";
import "./globals.css";

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
    <html lang="de">
      <body data-amavio-build="website-command-center-2026-08-07">
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
