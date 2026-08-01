import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, PageHero } from "@/components/page-chrome";
import { services, launchGates } from "@/lib/content";

export const metadata: Metadata = {
  title: "Für Arbeitgeber",
  description:
    "Wohnbedarf, Bezugsfertigkeit, Ankunft und Stabilisierung internationaler Mitarbeitender als strukturierter Projektpfad.",
  alternates: { canonical: "/arbeitgeber" },
};

export default function ArbeitgeberPage() {
  return (
    <main>
      <PageHeader />
      <PageHero
        eyebrow="Für Arbeitgeber"
        title="Internationale Mitarbeitende sollen nicht nur unterschreiben, sondern starten können."
        text="AMAVIO strukturiert Wohnbedarf, Standortprüfung, Bezugsfertigkeit, Ankunft und Stabilisierung als verantworteten Projektpfad."
      />
      <section className="service-grid subpage-grid">
        {services.map((service) => (
          <article className="service-card" key={service.name}>
            <div>
              <h2>{service.name}</h2>
              <p>{service.text}</p>
            </div>
            <footer>
              <strong>{service.price}</strong>
              <span>{service.note}</span>
            </footer>
          </article>
        ))}
      </section>
      <section className="open-process">
        <h2>Freigaben vor Geschwindigkeit.</h2>
        <div>
          {launchGates.map((gate) => (
            <span key={gate}>{gate}</span>
          ))}
        </div>
        <Link className="primary-action" href="/kontakt">Arbeitgeberanfrage starten</Link>
      </section>
    </main>
  );
}
