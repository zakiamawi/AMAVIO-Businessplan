import { Ban, CheckCircle2, ClipboardCheck, Database, FileWarning, KeyRound, ListChecks, LockKeyhole, PlayCircle, Scale, ShieldCheck, TimerReset } from "lucide-react";
import { useMemo, useState } from "react";
import { buildG1Readiness } from "../domain/analytics";
import { g1AccessAssuranceControls, g1DataClasses, g1InformationDutyArtifacts, g1RetentionSchedule, g1SourcePurposeChannelMatrix, g1StatusMeta } from "../domain/g1Governance";

const statusIcons = {
  verified: CheckCircle2,
  ready: ClipboardCheck,
  decided: CheckCircle2,
  external: Scale,
  blocked: Ban,
  open: FileWarning,
};

export function G1ReadinessPanel({ data, persistence, onRunControls, onRunRestoreDrill }) {
  const [tab, setTab] = useState("gates");
  const readiness = useMemo(() => buildG1Readiness(data, persistence), [data, persistence]);
  const runs = data.g1Governance?.controlRuns || [];
  const verified = readiness.gates.filter((gate) => gate.status === "verified_local").length;
  const decided = readiness.gates.filter((gate) => gate.status === "po_decided_local").length;
  const blocked = readiness.gates.filter((gate) => ["external_blocked", "technical_blocked", "po_blocked"].includes(gate.status)).length;

  return <section className="g1-readiness" aria-labelledby="g1-readiness-title">
    <header>
      <div><span className="workspace-kicker">Real Data Readiness</span><h2 id="g1-readiness-title">G1 · Eintrittsgates & Beschlusslage</h2><p>Lokale Nachweise, protokollierte Product-Owner-Arbeitsbeschlüsse und echte Freigabeblocker werden getrennt geführt. Dieser Bereich aktiviert weder Echtdaten noch Import, Versand oder externe Verbindungen.</p></div>
      <div className="g1-score"><strong>{readiness.locallyPrepared}/{readiness.total}</strong><span>lokal belegt oder PO-beschlossen</span><b><KeyRound aria-hidden="true" /> {readiness.label}</b></div>
    </header>

    <div className="g1-commandbar">
      <div className="g1-summary" aria-label="G1 Statuszusammenfassung">
        <Summary value={verified} label="lokal belegt" tone="verified" />
        <Summary value={decided} label="PO-beschlossen" tone="decided" />
        <Summary value={blocked} label="gesperrt" tone="blocked" />
        <Summary value={`${readiness.metrics.sourceCoverage}%`} label="Quellennachweis" tone="neutral" />
      </div>
      <button className="g1-run-button" onClick={onRunControls}><PlayCircle aria-hidden="true" /><span><strong>Lokale Prüfungen ausführen</strong><small>Sechs synthetische Prüfungen, keine Außenwirkung</small></span></button>
    </div>

    <nav className="g1-tabs" aria-label="G1 Prüfbereiche">
      <button className={tab === "gates" ? "active" : ""} onClick={() => setTab("gates")}><ListChecks aria-hidden="true" /> Gate-Übersicht</button>
      <button className={tab === "classes" ? "active" : ""} onClick={() => setTab("classes")}><ShieldCheck aria-hidden="true" /> Datenklassen</button>
      <button className={tab === "legal" ? "active" : ""} onClick={() => setTab("legal")}><Scale aria-hidden="true" /> Recht & Quellen</button>
      <button className={tab === "access" ? "active" : ""} onClick={() => setTab("access")}><LockKeyhole aria-hidden="true" /> Zugriff & Gerät</button>
      <button className={tab === "lifecycle" ? "active" : ""} onClick={() => setTab("lifecycle")}><TimerReset aria-hidden="true" /> Lebenszyklus</button>
      <button className={tab === "evidence" ? "active" : ""} onClick={() => setTab("evidence")}><ClipboardCheck aria-hidden="true" /> Prüfspur & Beschluss</button>
    </nav>

    {tab === "gates" ? <GateLedger gates={readiness.gates} /> : null}
    {tab === "classes" ? <DataClassLedger /> : null}
    {tab === "legal" ? <LegalAssuranceLedger /> : null}
    {tab === "access" ? <AccessAssuranceLedger governance={data.g1Governance} /> : null}
    {tab === "lifecycle" ? <LifecycleLedger governance={data.g1Governance} /> : null}
    {tab === "evidence" ? <EvidenceLedger readiness={readiness} runs={runs} governance={data.g1Governance} persistence={persistence} onRunRestoreDrill={onRunRestoreDrill} /> : null}

    <footer><ShieldCheck aria-hidden="true" /><span><strong>Unveränderliche Freigabegrenze:</strong> Reale Daten bleiben deaktiviert. Die vier Fachbeschlüsse ersetzen weder Rechtsprüfung noch Authentifizierung, Geräteschutz, externe Betriebsevidenz oder den gesonderten G1-10-Freigabebeschluss.</span></footer>
  </section>;
}

function Summary({ value, label, tone }) {
  return <div className={tone}><strong>{value}</strong><span>{label}</span></div>;
}

function GateLedger({ gates }) {
  return <div className="g1-ledger-section"><div className="g1-ledger-intro compact"><span>Steuerungsansicht</span><h3>Welche Freigabehürde steht wo?</h3><p>Diese Übersicht zeigt Status, Verantwortung und nächsten Schritt. Die zugrunde liegenden Regeln und Kontrollprotokolle stehen in den jeweiligen Fachregistern und in „Prüfspur & Beschluss“.</p></div><div className="g1-gates">{gates.map((gate) => {
    const meta = g1StatusMeta[gate.status];
    const Icon = statusIcons[meta.tone];
    return <article key={gate.id} className={meta.tone}>
      <span className="g1-index">{gate.id}</span><Icon aria-hidden="true" />
      <div><span className="g1-category">{gate.category} · Verantwortung: {gate.owner}</span><strong>{gate.label}</strong><p>{gate.detail}</p><details><summary>Nachweis & nächster Schritt</summary><dl><div><dt>Benötigt</dt><dd>{gate.requiredEvidence}</dd></div><div><dt>Nächster Schritt</dt><dd>{gate.nextAction}</dd></div></dl></details></div>
      <span className="g1-status">{meta.label}</span>
    </article>;
  })}</div></div>;
}

function DataClassLedger() {
  return <div className="g1-ledger-section"><div className="g1-ledger-intro"><span>Product-Owner-Arbeitsbeschluss · G1-01</span><h3>Datenumfang, Schutzbedarf und Ausschlüsse</h3><p>Der Erstumfang folgt Datenminimierung: Fünf geschäftlich erforderliche Klassen und sechs enge CRM-Zwecke sind lokal beschlossen. Besondere und private Daten sowie produktive Kontaktaufnahme bleiben ausgeschlossen; G1-03 bleibt separat zu prüfen.</p></div><div className="g1-table-wrap"><table className="g1-table"><thead><tr><th>Datenklasse</th><th>Schutz</th><th>Zweck</th><th>Zulässig</th><th>Nicht zulässig</th></tr></thead><tbody>{g1DataClasses.map((item) => <tr key={item.id}><th>{item.label}</th><td><span className={`data-level ${item.level}`}>{levelLabel(item.level)}</span></td><td>{item.purpose}</td><td>{item.allowed}</td><td>{item.excluded}</td></tr>)}</tbody></table></div></div>;
}

function LegalAssuranceLedger() {
  return <div className="g1-ledger-section assurance-ledger">
    <div className="g1-ledger-intro"><span>G1-03 · Prüfgrundlage, keine Rechtsfreigabe</span><h3>Quelle, Zweck, Kanal und Informationspflicht zusammen entscheiden</h3><p>Ein öffentlich auffindbarer Kontakt ist nicht automatisch für eine Ansprache freigegeben. Jeder Pfad hält Herkunft, Zweck, vorgesehenen Kanal, Nachweis und die noch ausstehende fachliche Prüfung getrennt fest.</p></div>
    <div className="g1-table-wrap"><table className="g1-table assurance-table"><thead><tr><th>Quelle</th><th>Zweck</th><th>Kanal</th><th>Entscheidungsstand</th><th>Erforderlicher Nachweis</th></tr></thead><tbody>{g1SourcePurposeChannelMatrix.map((item) => <tr key={item.id}><th>{item.source}</th><td>{item.purpose}</td><td>{item.channel}</td><td><AssuranceStatus value={item.contactDecision} /></td><td>{item.evidence}</td></tr>)}</tbody></table></div>
    <div className="assurance-artifacts" aria-label="Informationspflicht-Bausteine">{g1InformationDutyArtifacts.map((item) => <article key={item.id}><span>{item.legalReference}</span><strong>{item.label}</strong><p>{item.trigger}</p><dl><div><dt>Version</dt><dd>{item.version}</dd></div><div><dt>Nachweis</dt><dd>{item.evidence}</dd></div></dl><AssuranceStatus value={item.status} /></article>)}</div>
    <div className="assurance-boundary"><Ban aria-hidden="true" /><div><strong>Produktive Kontaktaufnahme bleibt gesperrt</strong><p>Die Matrix ist eine belastbare Prüfliste, aber keine Rechtsberatung und keine Einwilligung. E-Mail, Telefon und jede andere Außenkommunikation benötigen vor Aktivierung eine konkrete, dokumentierte Kanal- und Fallprüfung.</p></div></div>
  </div>;
}

function AccessAssuranceLedger({ governance }) {
  const local = g1AccessAssuranceControls.filter((item) => item.status === "verified_local").length;
  const missing = g1AccessAssuranceControls.length - local;
  const environment = governance?.localEnvironmentEvidence || {};
  return <div className="g1-ledger-section assurance-ledger">
    <div className="g1-ledger-intro"><span>G1-06 · Lokale Härtung und technische Negativprüfung</span><h3>Lokale Schutzgrenzen belegen, Geräte- und Identitätslücken sichtbar halten</h3><p>Die aktuelle Oberfläche ist ein lokaler Einzelarbeitsbereich ohne Login. Herkunftsschutz, restriktive Browserheader und eigentümergebundene Dateien ergänzen die vorhandenen Grenzen, ersetzen aber keine Authentifizierung, Autorisierung oder abgesicherte Betriebsumgebung.</p></div>
    <div className="assurance-scoreline"><div><strong>{local}</strong><span>lokal nachweisbar</span></div><div><strong>{missing}</strong><span>fehlend oder extern zu belegen</span></div><div className="blocked"><strong>0</strong><span>produktive Zugriffe freigegeben</span></div></div>
    <div className="access-control-grid">{g1AccessAssuranceControls.map((item) => <article key={item.id} className={item.status === "verified_local" ? "verified" : "blocked"}><div>{item.status === "verified_local" ? <CheckCircle2 aria-hidden="true" /> : <Ban aria-hidden="true" />}<span>{item.layer}</span></div><strong>{item.label}</strong><p>{item.evidence}</p><AssuranceStatus value={item.status} /></article>)}</div>
    <div className="assurance-artifacts" aria-label="Read-only beobachtete lokale Betriebsumgebung">
      <article><span>Read-only erhoben · {environment.observedAt || "–"}</span><strong>Betriebssystem</strong><p>{environment.operatingSystem || "Nicht erhoben"}</p><AssuranceStatus value="observed_only" /></article>
      <article><span>Geräteschutz</span><strong>Application Firewall</strong><p>Die Oberfläche wirkte aktiviert. Die aktuelle Betriebssystemprüfung meldet jedoch „Allow all incoming connections“ und State 0. Die Firewall ist deshalb nicht als wirksam belegt.</p><AssuranceStatus value="observed_blocker" /></article>
      <article><span>Geräteschutz</span><strong>Datenträgerverschlüsselung</strong><p>FileVault wird in den Systemeinstellungen als eingeschaltet angezeigt. Es wurden keine Schlüssel oder Zugangsdaten gelesen.</p><AssuranceStatus value="verified_local" /></article>
      <article><span>Geräteschutz</span><strong>Automatische Bildschirmsperre</strong><p>Nach fünf Minuten Inaktivität; Passwortanforderung aktiv und ohne Verzögerung.</p><AssuranceStatus value="verified_local" /></article>
    </div>
    <C1DecisionLedger c1={governance?.c1Readiness} />
    <div className="assurance-boundary"><LockKeyhole aria-hidden="true" /><div><strong>Keine Login- oder Sicherheitsbehauptung</strong><p>Eine Browseransicht, ein lokaler Port oder ein späterer Sichtschutz sind keine Authentifizierung. G1-06 kann erst nach nachgewiesener Geräteabsicherung und einer gesondert umgesetzten, negativ getesteten Identitäts- und Berechtigungsgrundlage geschlossen werden.</p></div></div>
  </div>;
}

function AssuranceStatus({ value }) {
  const labels = {
    external_review_required: "Externe Prüfung",
    blocked: "Gesperrt",
    locally_testable: "Lokal prüfbar",
    verified_local: "Lokal belegt",
    not_implemented: "Nicht implementiert",
    external_evidence_required: "Nachweis erforderlich",
    observed_only: "Beobachtung",
    observed_blocker: "Beobachteter Blocker",
    verification_conflict: "Widersprüchlicher Nachweis",
    unverified: "Nicht verifiziert",
  };
  const tone = value === "verified_local" || value === "locally_testable" ? "positive" : value === "blocked" || value === "not_implemented" || value === "observed_blocker" || value === "verification_conflict" ? "negative" : "review";
  return <span className={`assurance-status ${tone}`}>{labels[value] || value}</span>;
}

function C1DecisionLedger({ c1 = {} }) {
  const cards = [
    { title: "Technischer Betreiber", value: c1.technicalOperator?.confirmed ? c1.technicalOperator.name : "Offen", ok: c1.technicalOperator?.confirmed, note: "Für die spätere synthetische Plattformgrundlage benannt." },
    { title: "Vertretung", value: c1.delegate?.name || "Offen", ok: c1.delegate?.acceptanceVerified, note: c1.delegate?.name ? c1.delegateAcceptancePackagePrepared ? "Annahme- und Übergabeprotokoll vorbereitet; Bestätigung steht aus." : "Benannt; Annahme, Erreichbarkeit und Übergabe noch nachzuweisen." : "Noch nicht benannt." },
    { title: "Security Review", value: c1.securityReviewer?.name || "Nicht besetzt", ok: c1.securityReviewer?.assigned, note: c1.securityReviewPackagePrepared ? "Prüfbrief vorbereitet; unabhängige Person oder befristete Ausnahme fehlt." : "Unabhängige Prüfung oder befristete Ausnahme fehlt." },
    { title: "Datenschutz & Vertrag", value: c1.privacyContractReview?.internalOwner || "Offen", ok: false, note: c1.privacyContractReviewPackagePrepared ? "Externes Prüfbriefing vorbereitet; fachliche Annahme bleibt erforderlich." : "Interne Verantwortung bestätigt; externe Fachprüfung bleibt erforderlich." },
    { title: "Budgetrahmen", value: `${c1.budget?.targetMinMonthly || 0}–${c1.budget?.hardCapMonthly || 0} EUR brutto/Monat`, ok: Boolean(c1.budget?.hardCapMonthly), note: "Planungsrahmen bestätigt; Kauf und Add-ons nicht freigegeben." },
    { title: "Provider & Region", value: "Ausdrückliche Auswahl offen", ok: false, note: c1.providerRegionDecisionBriefPrepared ? `Entscheidungsbrief vorbereitet; ${c1.proposedProvider || "Provider"} · ${c1.proposedRegion || "Region"} bleiben nur vorgeschlagen.` : `${c1.proposedProvider || "Provider"} · ${c1.proposedRegion || "Region"} sind nur vorgeschlagen.` },
    { title: "Datenumfang", value: "Lokaler Import · schreibgeschützt", ok: true, note: "Importierte Organisationen und Kontakte sind lokal sichtbar. Versand, Cloud und Integrationen bleiben gesperrt." },
  ];
  return <section className="g1-po-decision-ledger" aria-labelledby="c1-decision-title"><div className="g1-ledger-intro compact"><span>{c1.decisionReference || "C1-Teilbeschluss"} · Plattformgrundlage</span><h3 id="c1-decision-title">Beschlossene Punkte und offene C1-Gates</h3><p>Die Prüf- und Übergabeunterlagen sind vorbereitet. Ohne tatsächliche Vertretungsannahme, unabhängiges Security Review, externe Datenschutz-/Vertragsprüfung sowie eindeutige Provider- und Regionsfreigabe wird keine Plattform angelegt und kein Kauf ausgelöst.</p></div><div>{cards.map((card) => <article key={card.title}>{card.ok ? <CheckCircle2 aria-hidden="true" /> : <Ban aria-hidden="true" />}<div><span>{card.ok ? "Bestätigt" : "Offen"}</span><strong>{card.title}</strong><p>{card.value}</p><small>{card.note}</small></div></article>)}</div></section>;
}

function LifecycleLedger({ governance }) {
  const policy = governance?.importPolicy || {};
  return <div className="g1-ledger-section"><div className="g1-ledger-intro"><span>Product-Owner-Arbeitsbeschluss · G1-05</span><h3>Lebenszyklus ohne vorzeitige Löschfreigabe</h3><p>Die Intervalle sind als Review- und Wiedervorlagepolitik beschlossen. Sie lösen eine Prüfung aus, keine automatische Löschung. Datenschutzabgleich, Anlass, Verantwortlichkeit und Vollzugsnachweis bleiben vor jeder späteren Löschung erforderlich.</p></div><div className="g1-lifecycle-grid"><div className="g1-table-wrap"><table className="g1-table"><thead><tr><th>Objekt</th><th>Startpunkt</th><th>Prüfung</th><th>Kontrollierte Aktion</th></tr></thead><tbody>{g1RetentionSchedule.map((item) => <tr key={item.object}><th>{item.object}</th><td>{item.trigger}</td><td>nach {item.reviewAfterDays} Tagen</td><td>{item.action}</td></tr>)}</tbody></table></div><aside className="g1-policy-card"><span>Import-Sicherheitsvertrag</span><h4>Kontrollierte lokale Einbindung</h4><Policy ok={policy.syntheticOnly}>Synthetischer Kern bleibt getrennt</Policy><Policy ok={policy.requirePreview}>Pflichtvorschau vor Übernahme</Policy><Policy ok={policy.quarantineOnUnknownSchema}>Unklare Datensätze bleiben im Hintergrund</Policy><Policy ok={policy.requireRollbackSnapshot}>Rollback-Snapshot vor Anwendung</Policy><Policy ok={policy.externalSourceApproved}>Produktive Quelle freigegeben</Policy></aside></div></div>;
}

function Policy({ ok, children }) {
  return <div className={ok ? "met" : "blocked"}>{ok ? <CheckCircle2 aria-hidden="true" /> : <Ban aria-hidden="true" />}<span>{children}</span></div>;
}

function EvidenceLedger({ readiness, runs, governance, persistence, onRunRestoreDrill }) {
  const [restoreBusy, setRestoreBusy] = useState(false);
  const [restoreError, setRestoreError] = useState("");
  const external = readiness.gates.filter((gate) => ["external_blocked", "technical_blocked", "po_blocked"].includes(gate.status));
  const latestRestore = runs.find((run) => run.kind === "restore_drill" && run.result === "passed");
  async function executeRestoreDrill() {
    setRestoreBusy(true);
    setRestoreError("");
    try { await onRunRestoreDrill(); } catch (error) { setRestoreError(error.message || "Restore-Probe konnte nicht ausgeführt werden."); } finally { setRestoreBusy(false); }
  }
  return <div className="g1-ledger-section"><DecisionLedger governance={governance} /><div className="g1-evidence-grid"><section><div className="g1-ledger-intro compact"><span>Lokale Kontrollspur</span><h3>Synthetische Prüfprotokolle</h3></div>{runs.length ? <div className="g1-run-ledger">{runs.map((run) => <article key={run.id}><CheckCircle2 aria-hidden="true" /><div><strong>{run.label}</strong><p>{run.evidence}</p><small>{formatTimestamp(run.executedAt)} · ausschließlich synthetisch</small></div><span>bestanden</span></article>)}</div> : <div className="g1-empty"><FileWarning aria-hidden="true" /><strong>Noch kein Kontrolllauf</strong><span>„Lokale Prüfungen ausführen“ erzeugt sechs nachvollziehbare synthetische Nachweise.</span></div>}</section><section><div className="g1-ledger-intro compact"><span>Nicht lokal schließbar</span><h3>Verbleibende Freigabeblocker</h3></div><div className="g1-blocker-ledger">{external.map((gate) => <article key={gate.id}><Ban aria-hidden="true" /><div><strong>{gate.id} · {gate.label}</strong><p>{gate.nextAction}</p><small>Verantwortung: {gate.owner}</small></div></article>)}</div></section></div><section className="g1-restore-assurance" aria-labelledby="g1-restore-title"><Database aria-hidden="true" /><div><span>G1-07 · Lokale Betriebsprobe</span><h3 id="g1-restore-title">Wiederherstellung isoliert prüfen</h3><p>Der aktuelle synthetische Zustand wird ausschließlich in einer temporären In-Memory-Datenbank geschrieben, gelesen und per Prüfsumme verglichen. Der laufende SQLite-Zustand bleibt unverändert.</p>{latestRestore ? <small><CheckCircle2 aria-hidden="true" /> Zuletzt bestanden: {formatTimestamp(latestRestore.executedAt)} · {latestRestore.evidence}</small> : <small><FileWarning aria-hidden="true" /> Noch keine isolierte Wiederherstellungsprobe protokolliert.</small>}{restoreError ? <small className="error" role="alert">{restoreError}</small> : null}</div><button onClick={executeRestoreDrill} disabled={restoreBusy || persistence.mode !== "sqlite" || !onRunRestoreDrill}>{restoreBusy ? "Prüfung läuft …" : "Isolierte Restore-Probe ausführen"}<small>{persistence.mode === "sqlite" ? "Keine Änderung am Live-Zustand" : "Erfordert lokalen SQLite-Start"}</small></button></section><div className="g1-decision-card"><div><span>Gesonderter G1-10-Freigabebeschluss</span><h3>Vier Fachbeschlüsse sind protokolliert – G1 bleibt nicht freigegeben</h3><p>G1-01, G1-05, G1-07 und G1-09 sind als lokale Arbeitsbeschlüsse dokumentiert. Rechtsprüfung, Zugriffsschutz, externe Betriebsevidenz und der ausdrückliche G1-10-Gesamtbeschluss bleiben offen; der technische Zustand ändert sich nicht.</p></div><strong>NO-GO</strong></div></div>;
}

function DecisionLedger({ governance }) {
  const decision = governance?.productOwnerDecision || {};
  const scope = governance?.approvedScope || {};
  const backup = governance?.backupPolicy || {};
  const incident = governance?.incidentPolicy || {};
  const cards = [
    { id: "G1-01", title: "Datenumfang & Zweck", decision: `${scope.allowedDataClassIds?.length || 0} zulässige Datenklassen · ${scope.purposes?.length || 0} enge CRM-Zwecke`, open: "Quellen- und Kanalprüfung bleibt G1-03." },
    { id: "G1-05", title: "Lebenszyklus", decision: "Reviewintervalle beschlossen · keine automatische Löschung", open: "Datenschutzabgleich und Vollzugsnachweis bleiben offen." },
    { id: "G1-07", title: "Sicherung & Restore", decision: `RPO ${backup.rpoHours || "–"} h · RTO ${backup.rtoHours || "–"} h · tägliche Sicherung`, open: "Verschlüsselung, Vertretung und Zielumgebungs-Restore bleiben offen." },
    { id: "G1-09", title: "Vorfall & Rückabwicklung", decision: "Product Owner / CRM-Administration koordiniert den Erstablauf", open: "Vertretung, Erreichbarkeit und rechtliche Fristen bleiben offen." },
  ];
  return <section className="g1-po-decision-ledger" aria-labelledby="g1-po-decision-title"><div className="g1-ledger-intro compact"><span>{decision.reference || "Product-Owner-Beschluss"} · {decision.decisionDate || "–"}</span><h3 id="g1-po-decision-title">Vier lokale Fachbeschlüsse protokolliert</h3><p>Beschlossen ist die interne Arbeitslogik. Nicht beschlossen sind Echtdatennutzung, Kontaktkanäle, Security-Freigabe oder G1-10.</p></div><div>{cards.map((card) => <article key={card.id}><CheckCircle2 aria-hidden="true" /><div><span>{card.id}</span><strong>{card.title}</strong><p>{card.decision}</p><small>Offen: {card.open}</small></div></article>)}</div></section>;
}

function levelLabel(value) { return ({ intern: "Intern", vertraulich: "Vertraulich", nicht_zulaessig: "Nicht zulässig" })[value] || value; }
function formatTimestamp(value) { return value ? new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "–"; }
