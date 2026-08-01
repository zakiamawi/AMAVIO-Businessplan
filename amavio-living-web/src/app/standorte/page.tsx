import type { Metadata } from "next";
import { PageHeader, PageHero } from "@/components/page-chrome";
import { rolloutRegions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Standorte",
  description:
    "AMAVIO Start- und Wachstumsregionen mit transparenter Prüf- statt Verfügbarkeitslogik.",
  alternates: { canonical: "/standorte" },
};

export default function StandortePage() {
  return (
    <main>
      <PageHeader />
      <PageHero
        eyebrow="Standorte"
        title="AMAVIO startet mit geprüften Regionen statt leerer Kartenpunkte."
        text="Standorte werden erst als buchbar oder verfügbar gezeigt, wenn Objekt, Partner, Nutzung, Wirtschaftlichkeit und Kapazität belastbar geprüft sind."
      />
      <section className="region-map">
        {rolloutRegions.map((region, index) => (
          <article key={region}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{region}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}
