import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { company } from "@/lib/content";

export default function DatenschutzPage() {
  return (
    <main className="legal-page">
      <BrandMark />
      <h1>Datenschutz</h1>
      <p>
        Diese V1 speichert keine Formulardaten serverseitig. Die Anfragefläche
        demonstriert den späteren Prozess für Arbeitgeber-, Bewohner- und
        Partneranfragen.
      </p>
      <p>
        Verantwortlicher wird im finalen Datenschutztext mit den geprüften
        Pflichtdaten der {company.legalName} ergänzt.
      </p>
      <Link href="/">Zurück zur Website</Link>
    </main>
  );
}
