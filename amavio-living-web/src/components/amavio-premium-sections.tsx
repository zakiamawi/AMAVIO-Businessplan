import Image from "next/image";
import type { CSSProperties } from "react";
import { MotionReveal } from "@/components/animation/motion-reveal";
import { RequestPanel } from "@/components/request-panel";
import { SectionLabel } from "@/components/section-label";
import {
  audiencePaths,
  availabilityExamples,
  campusFeatures,
  faqs,
  integrationPackages,
  launchGates,
  livingModels,
  operatingSteps,
  partnerRoles,
  platformModules,
  rolloutRegions,
  services,
  sourceNotes,
  trustControls,
} from "@/lib/content";

const deliveryLanes = [
  {
    label: "Strategie",
    items: ["Bedarfsanalyse", "Konzept & Planung", "Standortstrategie", "Wirtschaftlichkeit"],
  },
  {
    label: "Realisierung",
    items: ["Akquise & Prüfung", "Verträge & Compliance", "Einrichtung & Qualität", "Go-Live Management"],
  },
  {
    label: "Betrieb",
    items: ["Facility & Unterhalt", "Kundenservice", "Finanzen & Reporting", "Qualitätsmanagement"],
  },
  {
    label: "Integration",
    items: ["Ankunftsservice", "Sprache & Kultur", "Alltag & Community", "Langfristige Bindung"],
  },
];

const partnerMatrixRows = [
  "AMAVIO Living",
  "Immobilienpartner",
  "Betreiber",
  "Integrationspartner",
  "Bildungspartner",
  "Sicherheitspartner",
];

const partnerMatrixColumns = ["Akquise", "Recht", "Finanzierung", "Betrieb", "Integration", "Technologie"];

export function AmavioPremiumSections() {
  return (
    <>
      <section className="premium-journey" id="wege" aria-label="AMAVIO Journey Control">
        <div className="premium-section-marker">Journey Control</div>
        <MotionReveal className="premium-journey__head">
          <h2>Drei Wege. Ein Ziel. Verlässliche Integration.</h2>
          <p>
            AMAVIO trennt Arbeitgeberbedarf, Bewohnerankunft und Partnerfähigkeit
            früh, führt sie aber in einem gemeinsamen Operating Model zusammen.
          </p>
        </MotionReveal>
        <MotionReveal className="premium-journey__paths" delay={0.12}>
          {audiencePaths.map((path, index) => (
            <article key={path.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{path.label}</strong>
              <h3>{path.title}</h3>
              <p>{path.body}</p>
              <a href={path.href}>{path.cta}</a>
            </article>
          ))}
        </MotionReveal>
      </section>

      <section className="premium-rail" id="arbeitgeber" aria-label="AMAVIO Operating Rail">
        <div className="premium-section-marker">Operating Rail</div>
        <MotionReveal>
        <ol>
          {operatingSteps.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
              <p>{index === 0 ? "Bedarf präzisieren" : index === 1 ? "Optionen validieren" : index === 2 ? "Lösung sichern" : index === 3 ? "Onboarding steuern" : "Zufriedenheit sichern"}</p>
            </li>
          ))}
        </ol>
        </MotionReveal>
      </section>

      <section className="premium-services" aria-label="AMAVIO Leistungsarchitektur">
        <div className="premium-section-marker">Services</div>
        <MotionReveal className="premium-services__copy">
          <h2>Entscheidungen treffen. Wir machen den Rest möglich.</h2>
          <p>
            Leistungen werden nicht als lose Pakete verkauft, sondern als
            belastbare Entscheidungsarchitektur: Strategie, Realisierung,
            Betrieb und Integration bleiben nachvollziehbar.
          </p>
        </MotionReveal>
        <MotionReveal className="premium-services__lanes" delay={0.1}>
          {deliveryLanes.map((lane) => (
            <article key={lane.label}>
              <strong>{lane.label}</strong>
              <ul>
                {lane.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </MotionReveal>
        <aside className="premium-radar">
          <span>Ein Ansprechpartner</span>
          <strong>volle Verantwortung</strong>
        </aside>
        <MotionReveal className="premium-service-offers" delay={0.16}>
          {services.map((service) => (
            <article key={service.name}>
              <span>{service.name}</span>
              <p>{service.text}</p>
              <strong>{service.price}</strong>
              <small>{service.note}</small>
            </article>
          ))}
        </MotionReveal>
      </section>

      <section className="premium-campus" id="bewohner" aria-label="AMAVIO Campus und Community">
        <div className="premium-section-marker">Campus & Community</div>
        <MotionReveal className="premium-campus__media">
          <Image
            src="/images/amavio-campus-premium.png"
            alt="AMAVIO Community Campus mit Wohnen, Arbeit, Essen und Begegnung"
            fill
            sizes="(max-width: 900px) 100vw, 62vw"
          />
        </MotionReveal>
        <MotionReveal className="premium-campus__copy" delay={0.12}>
          <h2>Nicht nur Zimmer. Ein Space, der Ankommen wirklich möglich macht.</h2>
          <p>
            Moderne Wohn- und Begegnungsbereiche verbinden Rückzug, Arbeit,
            Sprache, Essen, Alltagshilfe und Community zu einem wiederholbaren
            Ankunftsprozess.
          </p>
          <ul>
            {campusFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </MotionReveal>
      </section>

      <section className="premium-intelligence" id="standorte" aria-label="Verfügbarkeit und Standortintelligenz">
        <div className="premium-section-marker">Verfügbarkeit & Standortintelligenz</div>
        <MotionReveal className="premium-map" ariaLabel="Start- und Wachstumsregionen">
          {rolloutRegions.map((region, index) => (
            <span key={region} style={{ "--i": index } as CSSProperties}>
              {region}
            </span>
          ))}
        </MotionReveal>
        <MotionReveal className="premium-availability" delay={0.1}>
          {availabilityExamples.map((item) => (
            <article key={`${item.city}-${item.type}`}>
              <strong>{item.city}</strong>
              <span>{item.type}</span>
              <p>{item.status}</p>
              <small>{item.audience} · {item.timing} · {item.capacity}</small>
            </article>
          ))}
        </MotionReveal>
      </section>

      <section className="premium-economics" id="preise" aria-label="Ökonomie und Paketlogik">
        <div className="premium-section-marker">Ökonomie & Paketlogik</div>
        <MotionReveal className="premium-models">
          {livingModels.map((model) => (
            <article key={model.name}>
              <span>{model.name}</span>
              <strong>{model.range}</strong>
              <p>{model.text}</p>
            </article>
          ))}
        </MotionReveal>
        <MotionReveal className="premium-packages" delay={0.1}>
          {integrationPackages.map((pack) => (
            <article key={pack.name}>
              <div>
                <span>{pack.name}</span>
                <strong>{pack.price}</strong>
              </div>
              <ul>
                {pack.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </MotionReveal>
      </section>

      <section className="premium-partner-platform" id="partner" aria-label="Partner Matrix und Platform OS">
        <div className="premium-section-marker">Partner Capability Matrix</div>
        <div className="premium-matrix" role="table" aria-label="Partner Capability Matrix">
          <div className="premium-matrix__row premium-matrix__head" role="row">
            <span role="columnheader">Rolle</span>
            {partnerMatrixColumns.map((column) => (
              <span role="columnheader" key={column}>{column}</span>
            ))}
          </div>
          {partnerMatrixRows.map((row, rowIndex) => (
            <div className="premium-matrix__row" role="row" key={row}>
              <span role="rowheader">{row}</span>
              {partnerMatrixColumns.map((column, columnIndex) => (
                <i
                  aria-label={`${row} ${column}`}
                  key={`${row}-${column}`}
                  data-level={(rowIndex + columnIndex) % 3 === 0 ? "lead" : "support"}
                />
              ))}
            </div>
          ))}
        </div>
        <MotionReveal className="premium-platform-orbit" id="plattform">
          <strong>AMAVIO OS</strong>
          {platformModules.map((module, index) => (
            <span key={module} style={{ "--i": index } as CSSProperties}>
              {module}
            </span>
          ))}
        </MotionReveal>
        <MotionReveal className="premium-partner-list" delay={0.1}>
          {partnerRoles.map((role) => (
            <span key={role}>{role}</span>
          ))}
        </MotionReveal>
      </section>

      <section className="premium-trust" id="sicherheit" aria-label="Security und Trust Launch Gates">
        <SectionLabel
          eyebrow="Security & Trust Launch Gates"
          title="Innovativ im Erlebnis. Nüchtern bei Daten, Recht und Verantwortung."
          text="AMAVIO zeigt Kompetenz, ohne falsche Live-Versprechen zu erzeugen. Rollenmodell, Audit Trail und Portale bleiben echte P1-Gates."
        />
        <MotionReveal className="premium-trust__gates">
          {launchGates.map((gate) => (
            <strong key={gate}>{gate}</strong>
          ))}
        </MotionReveal>
        <MotionReveal className="premium-trust__controls" delay={0.1}>
          {trustControls.map((control) => (
            <article key={control.label}>
              <span>{control.status}</span>
              <h3>{control.label}</h3>
              <p>{control.text}</p>
            </article>
          ))}
        </MotionReveal>
      </section>

      <RequestPanel />

      <section className="premium-source-faq">
        <div>
          <SectionLabel
            eyebrow="Quellenlogik"
            title="Keine erfundenen Register-, Preis- oder Bestandsdaten."
          />
          <ul>
            {sourceNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
        <div>
          <SectionLabel
            eyebrow="FAQ"
            title="Klarheit vor Buchungsversprechen."
            text="Die wichtigsten Abgrenzungen für einen ehrlichen Start der Plattform."
          />
          <div className="premium-faq-list">
            {faqs.map((faq) => (
              <article key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
