import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { RequestPanel } from "@/components/request-panel";
import { SectionLabel } from "@/components/section-label";
import {
  audiencePaths,
  availabilityExamples,
  campusFeatures,
  company,
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
} from "@/lib/content";

export default function Home() {
  return (
    <main id="top">
      <header className="site-header">
        <BrandMark />
        <nav aria-label="Hauptnavigation">
          <a href="#arbeitgeber">Arbeitgeber</a>
          <a href="#campus">Campus</a>
          <a href="#bewohner">Bewohner</a>
          <a href="#preise">Modelle</a>
          <a href="#partner">Partner</a>
          <a href="#plattform">Plattform</a>
        </nav>
        <a className="nav-action" href="#anfrage">
          Anfrage
        </a>
      </header>

      <section className="hero-section" aria-label="AMAVIO Living Start">
        <div className="hero-copy">
          <p className="eyebrow">{company.descriptor}</p>
          <h1>{company.brand}</h1>
          <p className="hero-claim">{company.claim}</p>
          <p className="hero-text">
            AMAVIO baut die nächste Generation von Workforce Living: möblierte
            Räume, Community-Campus, digitale Prozesse und Integration, die im
            Alltag wirklich funktioniert.
          </p>
          <div className="hero-actions" aria-label="Primäre Aktionen">
            <a className="primary-action" href="#anfrage">
              Readiness Discovery
            </a>
            <a className="secondary-action" href="#wege">
              passenden Weg wählen
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-label="Visuelle AMAVIO Prozessfläche">
          <Image
            src="/images/amavio-room.svg"
            alt="Bildmotiv-Platzhalter für einen modernen möblierten Wohnraum"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 52vw"
          />
          <div className="hero-status">
            <span>Projektpfad</span>
            <strong>Bedarf → Einzug → 90 Tage</strong>
          </div>
          <div className="availability-chip">
            <span>Zukunftsbasis</span>
            <strong>Wohnen + Community + Plattform</strong>
          </div>
        </div>
      </section>

      <section className="wayfinder" id="wege">
        <SectionLabel
          eyebrow="Nutzerführung"
          title="Drei Wege, ein Betriebssystem."
          text="Die Startseite trennt früh zwischen Arbeitgeberbedarf, Bewohneranfrage und Partnerfähigkeit."
        />
        <div className="path-grid">
          {audiencePaths.map((path) => (
            <article className="path-card" key={path.label} id={path.label.toLowerCase()}>
              <p>{path.kicker}</p>
              <h3>{path.title}</h3>
              <span>{path.body}</span>
              <a href={path.href}>{path.cta}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="operating-system" id="arbeitgeber">
        <div>
          <p className="eyebrow">Arbeitgeber</p>
          <h2>Der Arbeitsvertrag löst die operative Frage noch nicht.</h2>
          <p>
            Zwischen Zusage und erstem Arbeitstag müssen Bedarf, Wohnlösung,
            Bezugsfertigkeit, Ankunft und Stabilisierung zusammengeführt werden.
            AMAVIO steuert Status und Schnittstellen; Verträge, Genehmigungen
            und Fremdkosten bleiben bei den zuständigen Parteien.
          </p>
        </div>
        <ol className="step-rail">
          {operatingSteps.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="service-band">
        <SectionLabel
          eyebrow="Leistungen"
          title="Vom Blueprint bis zum wiederkehrenden Arrival Office."
          text="Preise werden öffentlich bewusst nicht als Shop dargestellt; die Quellenwerte bleiben als interne Referenz dokumentiert."
        />
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.name}>
              <div>
                <h3>{service.name}</h3>
                <p>{service.text}</p>
              </div>
              <footer>
                <strong>{service.price}</strong>
                <span>{service.note}</span>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="campus-section" id="campus">
        <div className="campus-visual">
          <Image
            src="/images/amavio-campus.svg"
            alt="Visualisierung eines AMAVIO Community-Campus mit Co-Working, Café, Shared Kitchen, langer Tafel und Pflanzen"
            fill
            sizes="(max-width: 900px) 100vw, 54vw"
          />
        </div>
        <div className="campus-copy">
          <p className="eyebrow">Community Campus</p>
          <h2>Nicht nur Zimmer. Ein Space, in dem Menschen Anschluss finden.</h2>
          <p>
            Die Gebäude sollen sich wie moderne, warme Living-Hubs anfühlen:
            Arbeiten, Kaffee, Kochen, Essen, Sprache, Freundschaften und
            Orientierung liegen nicht nebeneinander, sondern greifen ineinander.
          </p>
          <ul className="feature-orbit">
            {campusFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="availability-section" id="bewohner">
        <div className="image-stack">
          <Image
            src="/images/amavio-community.svg"
            alt="Bildmotiv-Platzhalter für internationale Community und Ankommen"
            width={760}
            height={520}
            sizes="(max-width: 900px) 100vw, 42vw"
          />
          <Image
            src="/images/amavio-city.svg"
            alt="Bildmotiv-Platzhalter für urbane Standorte und Pendellogik"
            width={760}
            height={520}
            sizes="(max-width: 900px) 100vw, 32vw"
          />
        </div>
        <div>
          <p className="eyebrow">Bewohner & Verfügbarkeit</p>
          <h2>Start nur dort, wo AMAVIO Verfügbarkeit real prüfen kann.</h2>
          <p>
            Die erste Version verspricht keine leeren Standorte. Sie sammelt
            Bedarfe, prüft verfügbare AMAVIO-Standorte und macht transparent,
            ob ein Pilot mit 5-20 Mitarbeitenden realistisch gestartet werden kann.
          </p>
          <div className="availability-list">
            {availabilityExamples.map((item) => (
              <article key={`${item.city}-${item.type}`}>
                <div>
                  <strong>{item.city}</strong>
                  <span>{item.type}</span>
                </div>
                <p>{item.status}</p>
                <small>
                  {item.audience} · {item.timing} · {item.capacity}
                </small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="living-economics" id="preise">
        <SectionLabel
          eyebrow="Wohnmodelle & Pakete"
          title="Transparent genug für Entscheidung, flexibel genug für echte Projekte."
          text="Die Werte sind als Orientierungsrahmen formuliert. Finaler Umfang, Nebenkosten, Setup und Plattformleistungen hängen vom Standort und Mandat ab."
        />
        <div className="living-layout">
          <div className="living-models">
            {livingModels.map((model) => (
              <article key={model.name}>
                <span>{model.name}</span>
                <strong>{model.range}</strong>
                <small>{model.unit}</small>
                <p>{model.text}</p>
              </article>
            ))}
          </div>
          <div className="package-flow">
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
        </div>
        <p className="pricing-note">
          Setup, Sonderleistungen und Plattformgebühren werden bewusst nicht als
          pauschale öffentliche Zusage dargestellt. Sie werden im Angebot nach
          Standort, Kohorte, Serviceumfang und Daten-/Portalbedarf ausgewiesen.
        </p>
      </section>

      <section className="partner-section" id="partner">
        <SectionLabel
          eyebrow="Partner"
          title="Lokale Kompetenz braucht einen verlässlichen Rahmen."
          text="AMAVIO baut keine lange Partnerliste, sondern projektbezogene Lieferfähigkeit mit klarer Rolle, Kapazität und Übergabe."
        />
        <div className="partner-grid">
          {partnerRoles.map((role) => (
            <article key={role}>{role}</article>
          ))}
        </div>
      </section>

      <section className="platform-section" id="plattform">
        <div>
          <p className="eyebrow">Produktbasis</p>
          <h2>Digital, skalierbar und zukunftssicher statt analoger Wohnungsverwaltung.</h2>
          <p>
            AMAVIO wird als Betriebssystem für Ankommen gedacht: von der
            Arbeitgeberanfrage über Standortprüfung und Matching bis zu Einzug,
            Community, Dokumenten und Reporting.
          </p>
          <div className="rollout-line" aria-label="Start- und Wachstumsregionen">
            {rolloutRegions.map((region) => (
              <span key={region}>{region}</span>
            ))}
          </div>
        </div>
        <div className="platform-showcase" aria-label="AMAVIO Plattformvorschau">
          <Image
            src="/images/amavio-platform.svg"
            alt="Abstrakte AMAVIO Plattformoberfläche mit Standortnetz und Statuspunkten"
            width={720}
            height={463}
            sizes="(max-width: 900px) 100vw, 42vw"
          />
        </div>
        <div className="platform-panel" aria-label="AMAVIO Prozessmodule">
          <div className="panel-topline">
            <span>AMAVIO OS</span>
            <strong>vom Bedarf zur Zugehörigkeit</strong>
          </div>
          <div className="module-grid">
            {platformModules.map((module) => (
              <span key={module}>{module}</span>
            ))}
          </div>
          <div className="metric-row">
            <span>Freigabe-Gates</span>
            <strong>{launchGates.join(" · ")}</strong>
          </div>
          <div className="metric-row">
            <span>Startlogik</span>
            <strong>keine Objektbindung ohne geprüfte Nachfrage</strong>
          </div>
        </div>
      </section>

      <RequestPanel />

      <section className="source-section">
        <SectionLabel
          eyebrow="Quellenlogik"
          title="Keine erfundenen Register-, Preis- oder Bestandsdaten."
        />
        <ul>
          {sourceNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section className="faq-section">
        <SectionLabel
          eyebrow="FAQ"
          title="Klarheit vor Buchungsversprechen."
          text="Die wichtigsten Abgrenzungen für einen ehrlichen Start der Plattform."
        />
        <div className="faq-list">
          {faqs.map((faq) => (
            <article key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <BrandMark />
        <p>
          {company.legalName} · {company.location}. Anbieterkennzeichnung wird
          ergänzt, sobald der vollständige Handelsregisterauszug mit Adresse,
          Registergericht, Registernummer und vertretungsberechtigter Person als
          geprüfte Quelle vorliegt.
        </p>
        <div>
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Datenschutz</Link>
        </div>
      </footer>
    </main>
  );
}
