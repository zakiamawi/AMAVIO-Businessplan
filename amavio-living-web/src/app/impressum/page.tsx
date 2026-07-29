import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { company } from "@/lib/content";

export default function ImpressumPage() {
  return (
    <main className="legal-page">
      <BrandMark />
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
      <Link href="/">Zurück zur Website</Link>
    </main>
  );
}
