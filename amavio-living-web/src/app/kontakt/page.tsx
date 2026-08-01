import type { Metadata } from "next";
import { PageHeader, PageHero } from "@/components/page-chrome";
import { RequestPanel } from "@/components/request-panel";

export const metadata: Metadata = {
  title: "Kontakt und Anfrage",
  description:
    "Strukturierte Erstaufnahme für Arbeitgeberbedarf, Wohnraumanfragen und Partnerschaften.",
  alternates: { canonical: "/kontakt" },
};

export default function KontaktPage() {
  return (
    <main>
      <PageHeader />
      <PageHero
        eyebrow="Kontakt"
        title="Der beste nächste Schritt beginnt mit einer sauberen Einordnung."
        text="Nutzen Sie die strukturierte Erstaufnahme für Arbeitgeberbedarf, Wohnraumanfrage oder Partnerschaft. Die Anfrage wird an den konfigurierten Bearbeitungskanal zugestellt."
      />
      <RequestPanel />
    </main>
  );
}
