import Link from "next/link";
import { PageHeader, PageHero } from "@/components/page-chrome";
import { housingConcepts } from "@/lib/content";

export default function WohnenPage() {
  return (
    <main>
      <PageHeader />
      <PageHero
        eyebrow="Wohnen"
        title="Wohnraum finden, ohne falsche Verfügbarkeiten zu versprechen."
        text="Diese erste Version zeigt Wohnformen als geprüfte Konzept- und Anfragepfade. Reale Standorte, Einheiten und Preise werden erst nach Verfügbarkeit und Projektprüfung bestätigt."
      />
      <section className="listing-tools" aria-label="Wohnraum Suche">
        <label>
          Stadt oder Region
          <input placeholder="z. B. Düsseldorf, Ruhrgebiet, München" />
        </label>
        <label>
          Einzug
          <input type="month" />
        </label>
        <label>
          Wohnform
          <select defaultValue="">
            <option value="">Alle Wohnformen</option>
            {housingConcepts.map((concept) => (
              <option key={concept.slug}>{concept.title}</option>
            ))}
          </select>
        </label>
      </section>
      <section className="concept-grid">
        {housingConcepts.map((concept) => (
          <article className="concept-card" key={concept.slug}>
            <span>{concept.badge}</span>
            <h2>{concept.title}</h2>
            <p>{concept.description}</p>
            <small>{concept.location} · {concept.audience}</small>
            <Link href={`/wohnen/${concept.slug}`}>Details und Anfrage</Link>
          </article>
        ))}
      </section>
    </main>
  );
}
