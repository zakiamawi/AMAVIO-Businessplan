import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, PageHero } from "@/components/page-chrome";
import { housingConcepts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Wohnformen",
  description:
    "AMAVIO Wohnkonzepte nach Wohnform und vorhandenen Konzeptdaten durchsuchen und anschließend die Verfügbarkeit anfragen.",
  alternates: { canonical: "/wohnen" },
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  q?: string | string[];
  type?: string | string[];
}>;

export default async function WohnenPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const requestedType = typeof params.type === "string" ? params.type : "";
  const type = housingConcepts.some((concept) => concept.slug === requestedType)
    ? requestedType
    : "";
  const normalizedQuery = query.toLocaleLowerCase("de");
  const filteredConcepts = housingConcepts.filter((concept) => {
    const matchesType = !type || concept.slug === type;
    const searchableText = [
      concept.title,
      concept.location,
      concept.audience,
      concept.description,
      ...concept.features,
    ]
      .join(" ")
      .toLocaleLowerCase("de");

    return matchesType && (!normalizedQuery || searchableText.includes(normalizedQuery));
  });

  return (
    <main>
      <PageHeader />
      <PageHero
        eyebrow="Wohnen"
        title="Wohnraum finden, ohne falsche Verfügbarkeiten zu versprechen."
        text="Diese erste Version zeigt Wohnformen als geprüfte Konzept- und Anfragepfade. Reale Standorte, Einheiten und Preise werden erst nach Verfügbarkeit und Projektprüfung bestätigt."
      />
      <form className="listing-tools" action="/wohnen" method="get">
        <label>
          Suchbegriff in den Konzeptdaten
          <input
            name="q"
            defaultValue={query}
            placeholder="z. B. möbliert, Kohorten, Privatsphäre"
            maxLength={80}
          />
        </label>
        <label>
          Wohnform
          <select name="type" defaultValue={type}>
            <option value="">Alle Wohnformen</option>
            {housingConcepts.map((concept) => (
              <option key={concept.slug} value={concept.slug}>
                {concept.title}
              </option>
            ))}
          </select>
        </label>
        <div className="listing-actions">
          <button className="primary-action" type="submit">
            Konzepte filtern
          </button>
          <Link href="/wohnen">Zurücksetzen</Link>
        </div>
      </form>
      <p className="listing-result" aria-live="polite">
        {filteredConcepts.length} von {housingConcepts.length} Konzepten angezeigt.
        Die Filterung betrifft nur vorhandene Konzeptdaten, nicht reale Verfügbarkeit.
      </p>
      <section className="concept-grid">
        {filteredConcepts.map((concept) => (
          <article className="concept-card" key={concept.slug}>
            <span>{concept.badge}</span>
            <h2>{concept.title}</h2>
            <p>{concept.description}</p>
            <small>{concept.location} · {concept.audience}</small>
            <Link href={`/wohnen/${concept.slug}`}>Details und Anfrage</Link>
          </article>
        ))}
        {filteredConcepts.length === 0 ? (
          <div className="empty-result">
            <h2>Kein passendes Konzept gefunden.</h2>
            <p>Bitte ändern Sie den Suchbegriff oder zeigen Sie alle Wohnformen.</p>
            <Link href="/wohnen">Alle Konzepte anzeigen</Link>
          </div>
        ) : null}
      </section>
    </main>
  );
}
