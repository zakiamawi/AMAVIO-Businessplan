"use client";

import { useState } from "react";

type DepartmentKey =
  | "HR"
  | "Finance"
  | "Legal"
  | "Operations"
  | "Backoffice"
  | "Frontoffice"
  | "Security";

const departments: Record<
  DepartmentKey,
  {
    area: string;
    mission: string;
    risk: string;
    solution: string;
    data: string;
    output: string;
    next: string;
    workflow: string[];
    gates: string[];
  }
> = {
  HR: {
    area: "Workforce Intake",
    mission: "Kohortenbedarf, Startfenster und Kandidatenstatus in eine belastbare Arrival-Route übersetzen.",
    risk: "Einstellung gelingt, aber Wohnraum, Pendellogik und Ankunft sind nicht rechtzeitig entscheidungsfähig.",
    solution: "AMAVIO führt Bedarf, Standort, Budget, Ankunft und 90-Tage-Stabilisierung als gemeinsamen HR-Prozess.",
    data: "Rolle, Startdatum, Personenanzahl, Schichtlogik, Standort, Muss-Kriterien.",
    output: "Readiness Brief, Kohortenprofil, Go/No-Go-Gates, Startplan.",
    next: "Readiness Discovery mit HR und operativer Leitung.",
    workflow: ["Bedarf erfassen", "Kohorte clustern", "Startfenster sichern", "Onboarding übergeben"],
    gates: ["Scope klar", "Startdatum realistisch", "5-20 Pilot prüfbar"],
  },
  Finance: {
    area: "Budget Control",
    mission: "Kostenrahmen, Fremdkosten, Setup und wiederkehrende Leistungen vor dem Pilot sauber trennen.",
    risk: "Projekt wirkt günstig, wird aber durch Objekt-, Möblierungs-, Neben- oder Change-Kosten unklar.",
    solution: "AMAVIO baut eine Kostenroute mit Freigaben, Annahmen und separater Fremdkostenlogik.",
    data: "Budgetrahmen, Laufzeit, Kostenträger, Freigabeweg, Fremdkosten-Toleranz.",
    output: "Budgetpfad, Fremdkostenliste, Angebotslogik, Change-Freigabe.",
    next: "Finance-Check vor Objektbindung.",
    workflow: ["Kostenrahmen setzen", "Fremdkosten trennen", "Freigaben dokumentieren", "Change steuern"],
    gates: ["Budget freigegeben", "Fremdkosten sichtbar", "Zahlungslogik definiert"],
  },
  Legal: {
    area: "Compliance Route",
    mission: "Datenschutz, Vertragsrollen und operative Verantwortlichkeiten früh klären.",
    risk: "Wohn-, Arbeits-, Daten- und Partnerrollen vermischen sich und erzeugen späte Freigabeblocker.",
    solution: "AMAVIO zeigt Rollen, Datenbedarf, Dokumente und Grenzen als eigenen Legal-Track.",
    data: "Verantwortliche, Empfänger, Zwecke, Dokumenttypen, Einwilligungen, Aufbewahrung.",
    output: "Datenbedarf, Rollenmatrix, Dokumentenliste, offene Rechtsfragen.",
    next: "Legal- und Datenschutzprüfung vor Portal- oder Dokumentenupload.",
    workflow: ["Rollen klären", "Daten minimieren", "Dokumente trennen", "Freigaben halten"],
    gates: ["Datenbedarf minimal", "Rechtsgrundlagen offen markiert", "Portal erst mit RBAC"],
  },
  Operations: {
    area: "Delivery Control",
    mission: "Wohnlösung, Bezugsfertigkeit, Partnerstatus und Einzug in einem Takt halten.",
    risk: "Einzelne Partner liefern, aber niemand sieht den Gesamtstatus bis zum ersten Arbeitstag.",
    solution: "AMAVIO führt Standort, Objekt, Möblierung, Internet, Übergabe und Issues in einem Operating Board.",
    data: "Objektstatus, Verfügbarkeit, Übergabetermin, Partner-SLA, offene Issues.",
    output: "Launchplan, Issue Log, Übergabeprotokoll, Eskalationspfad.",
    next: "Operations-Kickoff mit Partner- und Objektstatus.",
    workflow: ["Standort prüfen", "Partner takten", "Bezugsfertigkeit sichern", "Issue Log führen"],
    gates: ["Kapazität bestätigt", "Übergabe terminierbar", "Eskalation benannt"],
  },
  Backoffice: {
    area: "Evidence Desk",
    mission: "Nachweise, Versionen, Kontakte und interne Entscheidungen auffindbar halten.",
    risk: "Gute Arbeit entsteht, aber Nachweise, Dateistände und Verantwortlichkeiten bleiben verstreut.",
    solution: "AMAVIO strukturiert Dokumente, Quellen, Versionen und QA-Gates für Businessplan und Betrieb.",
    data: "Kontaktrolle, Datei, Version, Quelle, Freigabe, Status, offene Frage.",
    output: "Datenraum-Index, QA-Protokoll, Kontaktmatrix, Entscheidungslog.",
    next: "Backoffice-Struktur für Pilot und Abgabepaket finalisieren.",
    workflow: ["Dateien inventarisieren", "Quellen halten", "Freigaben loggen", "QA prüfen"],
    gates: ["Quelle bekannt", "Version eindeutig", "Freigabe dokumentiert"],
  },
  Frontoffice: {
    area: "Arrival Office",
    mission: "Anfragen, Bewohnerfragen und Arbeitgeberkommunikation ruhig und nachvollziehbar führen.",
    risk: "Interessenten bekommen schnelle Antworten, aber keine klare Erwartung zu Verfügbarkeit und nächstem Schritt.",
    solution: "AMAVIO trennt Erstkontakt, Bedarf, Verfügbarkeit, Erwartungsmanagement und Support-Grenzen.",
    data: "Profil, Anliegen, Zeitraum, Standort, Dringlichkeit, bevorzugter Kontaktweg.",
    output: "Anfrageklassifizierung, Antwortpfad, Terminbriefing, Support-Abgrenzung.",
    next: "Kontaktstrecken nach Profil erweitern.",
    workflow: ["Anfrage klassifizieren", "Antwortpfad setzen", "Termin vorbereiten", "Grenzen erklären"],
    gates: ["Profil erkannt", "Kein falsches Zimmer-Versprechen", "Antwortweg definiert"],
  },
  Security: {
    area: "Trust Layer",
    mission: "Website, Anfrage, spätere Portale und Integrationen nur mit klaren Schutzschichten öffnen.",
    risk: "Innovative Oberflächen wirken stark, aber ohne Security-Gates entsteht reales Betriebsrisiko.",
    solution: "AMAVIO führt Datenminimierung, Webhook-Schutz, Rollenmodell, Audit Trail und Motion-Safety als Launch-Gates.",
    data: "Formularfelder, Consent, Übermittlung, Rollen, Logs, technische Grenzen.",
    output: "Trust Center, Security-Gates, Portal-P1-Kriterien, Scan- und QA-Protokoll.",
    next: "Trust-Seite und Security-QA vor produktiver Freigabe.",
    workflow: ["Daten minimieren", "Webhook schützen", "RBAC planen", "Audit vorbereiten"],
    gates: ["P0 Datensparsamkeit", "P1 RBAC", "QA vor Launch"],
  },
};

const departmentKeys = Object.keys(departments) as DepartmentKey[];

export function AmavioCommandCenter() {
  const [activeDepartment, setActiveDepartment] = useState<DepartmentKey>("HR");
  const department = departments[activeDepartment];
  const activeIndex = departmentKeys.indexOf(activeDepartment);

  const selectRelativeDepartment = (offset: number) => {
    const nextIndex = (activeIndex + offset + departmentKeys.length) % departmentKeys.length;
    setActiveDepartment(departmentKeys[nextIndex]);
  };

  return (
    <section
      className="amavio-command-center"
      id="command"
      aria-label="AMAVIO Department Command Center"
      data-amavio-component="department-command-center"
    >
      <div className="amavio-command-center__motion" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="amavio-command-center__intro">
        <p className="eyebrow">Department Command</p>
        <h2>Die Website muss wie ein Unternehmen funktionieren, nicht wie eine Broschüre.</h2>
        <p>
          AMAVIO führt die relevanten Abteilungen in einer gemeinsamen Logik:
          Bedarf, Budget, Recht, Betrieb, Frontoffice, Backoffice und Sicherheit
          greifen ineinander, bevor ein Pilot versprochen wird.
        </p>
      </div>

      <div className="amavio-command-center__shell">
        <div className="amavio-command-center__tabs" role="tablist" aria-label="AMAVIO Abteilungen">
          {departmentKeys.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeDepartment === key}
              aria-controls="amavio-command-panel"
              data-active={activeDepartment === key}
              onClick={() => setActiveDepartment(key)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                  event.preventDefault();
                  selectRelativeDepartment(1);
                }

                if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                  event.preventDefault();
                  selectRelativeDepartment(-1);
                }
              }}
            >
              <span aria-hidden="true">{key.slice(0, 2).toUpperCase()}</span>
              {key}
            </button>
          ))}
        </div>

        <article
          className="amavio-command-center__detail"
          id="amavio-command-panel"
          role="tabpanel"
          aria-live="polite"
        >
          <div className="amavio-command-center__detail-head">
            <span>{activeDepartment}</span>
            <strong>{department.area}</strong>
          </div>
          <p>{department.mission}</p>
          <div className="amavio-command-center__decision">
            <div>
              <span>Risiko</span>
              <p>{department.risk}</p>
            </div>
            <div>
              <span>AMAVIO Antwort</span>
              <p>{department.solution}</p>
            </div>
          </div>
        </article>

        <div className="amavio-command-center__workflow" aria-label="Workflow">
          {department.workflow.map((step, index) => (
            <div key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>

        <div className="amavio-command-center__evidence">
          <article>
            <span>Benötigte Daten</span>
            <p>{department.data}</p>
          </article>
          <article>
            <span>Output</span>
            <p>{department.output}</p>
          </article>
          <article>
            <span>Nächster Schritt</span>
            <p>{department.next}</p>
          </article>
        </div>

        <aside className="amavio-command-center__gates" aria-label="Department Gates">
          <span>Gate Stack</span>
          {department.gates.map((gate) => (
            <strong key={gate}>{gate}</strong>
          ))}
        </aside>
      </div>
    </section>
  );
}
