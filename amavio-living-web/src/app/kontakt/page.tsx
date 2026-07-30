import { PageHeader, PageHero } from "@/components/page-chrome";
import { RequestPanel } from "@/components/request-panel";

export default function KontaktPage() {
  return (
    <main>
      <PageHeader />
      <PageHero
        eyebrow="Kontakt"
        title="Der beste nächste Schritt beginnt mit einer sauberen Einordnung."
        text="Nutzen Sie die strukturierte Erstaufnahme für Arbeitgeberbedarf, Wohnraumanfrage oder Partnerschaft. Terminbuchung und Kalenderintegration sind als P0-Schnittstelle vorbereitet."
      />
      <RequestPanel />
    </main>
  );
}
