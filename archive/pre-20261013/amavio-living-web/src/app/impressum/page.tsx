import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Impressum – Pflichtangaben noch nicht vollständig",
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return (
    <main className="legal-page">
      <BrandMark light />
      <h1>Impressum</h1>
      <p>
        Anbieter: {company.legalName}, {company.location}.
      </p>
      <p>
        Der vollständige Handelsregisterauszug wurde in den verfügbaren
        Textquellen nicht mit allen Pflichtangaben extrahiert. Adresse,
        Registergericht, Registernummer und vertretungsberechtigte Person werden
        hier erst ergänzt, wenn sie aus der verbindlichen Registerquelle geprüft
        wurden.
      </p>
      <p>
        Diese Seite ist daher noch nicht für einen öffentlichen
        Produktionsbetrieb mit vollständiger Anbieterkennzeichnung freigegeben.
      </p>
      <Link href="/">Zurück zur Website</Link>
    </main>
  );
}
