import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, PageHero } from "@/components/page-chrome";
import { partnerRoles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Für Immobilienpartner",
  description:
    "AMAVIO prüft Wohnraum, Umnutzung, Betrieb, Ausstattung und Übergabe realistisch, bevor aus einer Objektidee ein Projektversprechen wird.",
  alternates: { canonical: "/immobilienpartner" },
};

export default function ImmobilienpartnerPage() {
  return (
    <main>
      <PageHeader />
      <PageHero
        eyebrow="Für Immobilienpartner"
        title="Objekte werden nicht nur vermietet, sondern in Ankunftsinfrastruktur verwandelt."
        text="AMAVIO prüft Wohnraum, Umnutzung, Betrieb, Ausstattung und Übergabe realistisch, bevor aus einer Objektidee ein Projektversprechen wird."
      />
      <section className="partner-grid subpage-grid">
        {partnerRoles.map((role) => (
          <article key={role}>{role}</article>
        ))}
      </section>
      <section className="open-process">
        <h2>Objekt anbieten.</h2>
        <p>
          In der ersten Version wird das Objektangebot als strukturierte Anfrage
          vorbereitet. Datei-Upload und Partnerportal sind für die nächste
          Produktstufe vorgesehen.
        </p>
        <Link className="primary-action" href="/kontakt">Objekt prüfen lassen</Link>
      </section>
    </main>
  );
}
