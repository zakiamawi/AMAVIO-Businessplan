import Image from "next/image";
import type { CSSProperties } from "react";
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
        <div className="premium-section-marker">01 Journey Control</div>
        <div className="premium-journey__head">
          <h2>Drei Wege. Ein Ziel. Verlässliche Integration.</h2>
          <p>
            AMAVIO trennt Arbeitgeberbedarf, Bewohnerankunft und Partnerfähigkeit
            früh, führt sie aber in einem gemeinsamen Operating Model zusammen.
          </p>
        </div>
        <div className="premium-journey__paths">
          {audiencePaths.map((path, index) => (
            <article key={path.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{path.label}</strong>
              <h3>{path.title}</h3>
              <p>{path.body}</p>
              <a href={path.href}>{path.cta}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="premium-rail" id="arbeitgeber" aria-label="AMAVIO Operating Rail">
        <div className="premium-section-marker">02 Operating Rail</div>
        <ol>
          {operatingSteps.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
              <p>{index === 0 ? "Bedarf präzisieren" : index === 1 ? "Optionen validieren" : index === 2 ? "Lösung sichern" : index === 3 ? "Onboarding steuern" : "Zufriedenheit sichern"}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="premium-services" aria-label="AMAVIO Leistungsarchitektur">
        <div className="premium-section-marker">03 Services</div>
        <div className="premium-services__copy">
          <h2>Entscheidungen treffen. Wir machen den Rest möglich.</h2>
          <p>
            Leistungen werden nicht als lose Pakete verkauft, sondern als
            belastbare Entscheidungsarchitektur: Strategie, Realisierung,
            Betrieb und Integration bleiben nachvollziehbar.
          </p>
        </div>
        <div className="premium-services__lanes">
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
        </div>
        <aside className="premium-radar">
          <span>Ein Ansprechpartner</span>
          <strong>volle Verantwortung</strong>
        </aside>
        <div className="premium-service-offers">
          {services.map((service) => (
            <article key={service.name}>
              <span>{service.name}</span>
              <p>{service.text}</p>
              <strong>{service.price}</strong>
              <small>{service.note}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="premium-campus" id="bewohner" aria-label="AMAVIO Campus und Community">
        <div className="premium-section-marker">04 Campus & Community</div>
        <div className="premium-campus__media">
          <Image
            src="/images/amavio-campus-premium.png"
            alt="AMAVIO Community Campus mit Wohnen, Arbeit, Essen und Begegnung"
            fill
            sizes="(max-width: 900px) 100vw, 62vw"
          />
        </div>
        <div className="premium-campus__copy">
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
        </div>
      </section>

      <section className="premium-intelligence" id="standorte" aria-label="Verfügbarkeit und Standortintelligenz">
        <div className="premium-section-marker">05 Verfügbarkeit & Standortintelligenz</div>
        <div className="premium-map" aria-label="Start- und Wachstumsregionen">
          {rolloutRegions.map((region, index) => (
            <span key={region} style={{ "--i": index } as CSSProperties}>
              {region}
            </span>
          ))}
        </div>
        <div className="premium-availability">
          {availabilityExamples.map((item) => (
            <article key={`${item.city}-${item.type}`}>
              <strong>{item.city}</strong>
              <span>{item.type}</span>
              <p>{item.status}</p>
              <small>{item.audience} · {item.timing} · {item.capacity}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="premium-economics" id="preise" aria-label="Ökonomie und Paketlogik">
        <div className="premium-section-marker">06 Ökonomie & Paketlogik</div>
        <div className="premium-donut" aria-label="Wirtschaftlichkeitsübersicht">
          <strong>Übersicht</strong>
        </div>
        <div className="premium-models">
          {livingModels.map((model) => (
            <article key={model.name}>
              <span>{model.name}</span>
              <strong>{model.range}</strong>
              <p>{model.text}</p>
            </article>
          ))}
        </div>
        <div className="premium-packages">
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
        </div>
      </section>

      <section className="premium-partner-platform" id="partner" aria-label="Partner Matrix und Platform OS">
        <div className="premium-section-marker">07 Partner Capability Matrix</div>
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
        <div className="premium-platform-orbit" id="plattform">
          <strong>AMAVIO OS</strong>
          {platformModules.map((module, index) => (
            <span key={module} style={{ "--i": index } as CSSProperties}>
              {module}
            </span>
          ))}
        </div>
        <div className="premium-partner-list">
          {partnerRoles.map((role) => (
            <span key={role}>{role}</span>
          ))}
        </div>
      </section>

      <section className="premium-trust" id="sicherheit" aria-label="Security und Trust Launch Gates">
        <SectionLabel
          eyebrow="08 Security & Trust Launch Gates"
          title="Innovativ im Erlebnis. Nüchtern bei Daten, Recht und Verantwortung."
          text="AMAVIO zeigt Kompetenz, ohne falsche Live-Versprechen zu erzeugen. Rollenmodell, Audit Trail und Portale bleiben echte P1-Gates."
        />
        <div className="premium-trust__gates">
          {launchGates.map((gate) => (
            <strong key={gate}>{gate}</strong>
          ))}
        </div>
        <div className="premium-trust__controls">
          {trustControls.map((control) => (
            <article key={control.label}>
              <span>{control.status}</span>
              <h3>{control.label}</h3>
              <p>{control.text}</p>
            </article>
          ))}
        </div>
      </section>

      <RequestPanel />

      <section className="premium-source-faq">
        <div>
          <SectionLabel
            eyebrow="09 Quellenlogik"
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
            eyebrow="10 FAQ"
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
