"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import { AmavioArrivalField } from "@/components/amavio-arrival-field";
import {
  company,
  launchGates,
  operatingSignals,
  operatingSteps,
  trustControls,
} from "@/lib/content";

type RoleKey = "Arbeitgeber" | "Bewohner" | "Partner" | "Security";

const roleDeck: Record<
  RoleKey,
  {
    eyebrow: string;
    title: string;
    body: string;
    command: string;
    metrics: string[];
  }
> = {
  Arbeitgeber: {
    eyebrow: "Cohort Command",
    title: "Kohorten starten, bevor Wohnraum zum Recruiting-Risiko wird.",
    body: "AMAVIO verbindet Bedarf, Standort, Budget, Einzug, 90-Tage-Startphase und Begleitung bis Tag 180 zu einem geführten Delivery-System für HR, Kliniken und Recruitingpartner.",
    command: "Bedarf profilieren, Budgetpfad setzen, Partnerkapazität prüfen und Go/No-Go dokumentieren.",
    metrics: ["5 Readiness Gates", "90 Tage Start · bis Tag 180", "Pilot 5-20 Personen"],
  },
  Bewohner: {
    eyebrow: "Arrival Journey",
    title: "Ankommen fühlt sich einfacher an, wenn jeder nächste Schritt sichtbar ist.",
    body: "Bewohner sehen Orientierung, Wohnen, Community und offene Schritte als klare Reise statt als Papierchaos zwischen Vertrag, Stadt und Alltag.",
    command: "Einzug vorbereiten, lokale Orientierung aktivieren und offene Aufgaben priorisieren.",
    metrics: ["Einzug", "Orientierung", "Community"],
  },
  Partner: {
    eyebrow: "Supply Network",
    title: "Aus lokalen Partnern wird eine belastbare Lieferfähigkeit.",
    body: "Vermieter, Betreiber, Makler, Handwerk, Möblierung und Internet werden in Rollen, Kapazitäten und Übergabepunkte gegliedert.",
    command: "Kapazität qualifizieren, SLA-Lücken erkennen und Übergabequalität absichern.",
    metrics: ["Standortprüfung", "Capability Map", "Issue Log"],
  },
  Security: {
    eyebrow: "Trust Control",
    title: "Sicherheit, Datenschutz und Freigaben sind Teil des Produkts.",
    body: "Anfragen, Rollen, Daten, Webhook-Logik und Governance werden als Kontrollschicht geführt, bevor Prozesse skaliert werden.",
    command: "Daten minimieren, Zustimmungen trennen, Rollenmodell vorbereiten und Risiken sichtbar machen.",
    metrics: ["P0 Schutz", "RBAC Gate", "Audit Trail"],
  },
};

const journey = [
  { label: operatingSteps[0] ?? "Bedarf", x: 8, y: 66, detail: "Profile, Zeitfenster und Muss-Kriterien aufnehmen." },
  { label: "Standort", x: 27, y: 36, detail: "Region, Pendelwege, Bestand und Verfügbarkeit prüfen." },
  { label: operatingSteps[1] ?? "Wohnlösung", x: 48, y: 54, detail: "Wohnform, Ausstattung und Budgetroute matchen." },
  { label: operatingSteps[3] ?? "Ankunft", x: 68, y: 28, detail: "Einzug, Orientierung und lokale Übergaben koordinieren." },
  { label: operatingSteps[4] ?? "Stabilisierung", x: 89, y: 42, detail: "30/60/90-Tage-Status, Issues und Folgebedarf führen." },
];

const navLinks = [
  { href: "#arbeitgeber", label: "Arbeitgeber" },
  { href: "#bewohner", label: "Bewohner" },
  { href: "#partner", label: "Partner" },
  { href: "#sicherheit", label: "Sicherheit" },
];

export function AmavioOperatingStage() {
  const [activeRole, setActiveRole] = useState<RoleKey>("Arbeitgeber");
  const [activeStep, setActiveStep] = useState(0);
  const reducedMotion = useReducedMotion();

  const role = roleDeck[activeRole];
  const selectedStep = journey[activeStep] ?? journey[0];
  const gates = useMemo(
    () =>
      launchGates.map((gate, index) => ({
        label: gate,
        state: index < 3 ? "freigegeben" : index === 3 ? "prüfen" : "wartet",
      })),
    [],
  );

  return (
    <section
      className="amavio-os-stage"
      data-motion={reducedMotion ? "reduced" : "full"}
      aria-label="AMAVIO Arrival Operating System"
    >
      <div className="amavio-os-stage__media" aria-hidden="true">
        <Image
          src="/images/amavio-hero-os.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="amavio-os-stage__image"
        />
        <AmavioArrivalField />
      </div>
      <div className="amavio-os-stage__shade" aria-hidden="true" />

      <header className="amavio-os-stage__nav">
        <Link className="amavio-os-stage__brand" href="/" aria-label={`${company.brand} Startseite`}>
          <span>A</span>
          <strong>{company.brand}</strong>
        </Link>
        <nav aria-label="Startseitenbereiche">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="amavio-os-stage__nav-action" href="/kontakt">
          Anfrage
        </Link>
      </header>

      <div className="amavio-os-stage__grid">
        <div className="amavio-os-stage__copy">
          <p className="amavio-os-stage__eyebrow">{role.eyebrow}</p>
          <h1>
            <span>Arrival</span>
            <span>Operating System</span>
          </h1>
          <p className="amavio-os-stage__descriptor">Workforce Housing & Integration</p>
          <p className="amavio-os-stage__claim">{role.title}</p>
          <p className="amavio-os-stage__text">{role.body}</p>

          <div className="amavio-os-stage__actions" aria-label="Primäre Aktionen">
            <Link href="/kontakt">Readiness Discovery</Link>
            <Link href="#plattform">System erkunden</Link>
          </div>

          <div className="amavio-os-stage__role-dock" role="tablist" aria-label="AMAVIO Rollen">
            {(Object.keys(roleDeck) as RoleKey[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeRole === key}
                className={activeRole === key ? "is-active" : ""}
                onClick={() => setActiveRole(key)}
              >
                <span>{key.slice(0, 2).toUpperCase()}</span>
                {key}
              </button>
            ))}
          </div>
        </div>

        <div className="amavio-os-stage__workspace">
          <div className="amavio-os-stage__map" aria-label="Interaktiver AMAVIO Lieferpfad">
            <svg viewBox="0 0 100 72" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 8 66 C 18 36 34 28 48 54 S 67 24 89 42" />
            </svg>
            {journey.map((item, index) => (
              <button
                key={item.label}
                type="button"
                className="amavio-os-stage__node"
                style={{ "--x": `${item.x}%`, "--y": `${item.y}%` } as CSSProperties}
                data-active={activeStep === index}
                onClick={() => setActiveStep(index)}
                aria-label={`${item.label}: ${item.detail}`}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </button>
            ))}

            <article className="amavio-os-stage__live-card" aria-live="polite">
              <span>Live Step {String(activeStep + 1).padStart(2, "0")}</span>
              <strong>{selectedStep.label}</strong>
              <p>{selectedStep.detail}</p>
            </article>
          </div>

          <aside className="amavio-os-stage__console" aria-label="AMAVIO Systemkonsole">
            <div className="amavio-os-stage__console-head">
              <span>System online</span>
              <strong>{activeRole}</strong>
            </div>
            <p>{role.command}</p>
            <div className="amavio-os-stage__metrics">
              {role.metrics.map((metric) => (
                <span key={metric}>{metric}</span>
              ))}
            </div>
            <ol className="amavio-os-stage__gates">
              {gates.map((gate) => (
                <li key={gate.label}>
                  <span>{gate.label}</span>
                  <strong>{gate.state}</strong>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>

      <div className="amavio-os-stage__signal-shelf" aria-label="Operating Signals">
        {operatingSignals.map((signal) => (
          <article key={signal.label}>
            <span>{signal.label}</span>
            <strong>{signal.value}</strong>
            <p>{signal.text}</p>
          </article>
        ))}
        {trustControls.slice(0, 2).map((control) => (
          <article key={control.label}>
            <span>{control.status}</span>
            <strong>{control.label}</strong>
            <p>{control.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
