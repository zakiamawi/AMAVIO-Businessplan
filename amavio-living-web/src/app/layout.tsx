import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
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
  title: "AMAVIO Living | Workforce Housing & Integration",
  description:
    "AMAVIO Living organisiert Wohnen, Bezugsfertigkeit und Ankunft für Arbeitgeber mit internationalem Fachkräftebedarf.",
  metadataBase: new URL("https://amavio-living.example"),
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
      <body>{children}</body>
    </html>
  );
}
