import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, PageHero } from "@/components/page-chrome";
import { campusFeatures } from "@/lib/content";

export const metadata: Metadata = {
  title: "Für Bewohner",
  description:
    "Möbliertes Wohnen, Orientierung, Community und klare nächste Schritte für Menschen, die in Deutschland ankommen.",
  alternates: { canonical: "/bewohner" },
};

export default function BewohnerPage() {
  return (
    <main>
      <PageHeader />
      <PageHero
        eyebrow="Für Bewohner"
        title="Ein neues Zuhause soll sich nicht wie ein Formularstapel anfühlen."
        text="AMAVIO verbindet möbliertes Wohnen, Orientierung, Community und klare nächste Schritte für Menschen, die in Deutschland ankommen."
      />
      <section className="feature-list long">
        {campusFeatures.map((feature) => (
          <span key={feature}>{feature}</span>
        ))}
      </section>
      <section className="open-process">
        <h2>Von der Anfrage zum Einzug.</h2>
        <p>
          Bedarf vormerken, Standort prüfen, Wohnform auswählen, Unterlagen
          vorbereiten, Ankunft begleiten und Community aktivieren.
        </p>
        <Link className="primary-action" href="/wohnen">Wohnformen ansehen</Link>
      </section>
    </main>
  );
}
