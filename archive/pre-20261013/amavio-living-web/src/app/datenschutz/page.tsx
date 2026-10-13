import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Datenschutz – Pflichtangaben noch nicht vollständig",
  robots: { index: false, follow: true },
};

export default function DatenschutzPage() {
  return (
    <main className="legal-page">
      <BrandMark light />
      <h1>Datenschutz</h1>
      <p>
        Die Anfragefläche übermittelt die eingegebenen Daten nur dann an einen
        serverseitig konfigurierten HTTPS-Bearbeitungskanal. Ohne diese
        Konfiguration wird keine erfolgreiche Zustellung bestätigt.
      </p>
      <p>
        Verantwortlicher wird im finalen Datenschutztext mit den geprüften
        Pflichtdaten der {company.legalName} ergänzt.
      </p>
      <p>
        Angaben zu Empfänger, Rechtsgrundlage, Speicherdauer und Betroffenenrechten
        müssen vor dem öffentlichen Produktionsbetrieb anhand des tatsächlich
        eingesetzten Bearbeitungssystems verbindlich ergänzt werden.
      </p>
      <Link href="/">Zurück zur Website</Link>
    </main>
  );
}
