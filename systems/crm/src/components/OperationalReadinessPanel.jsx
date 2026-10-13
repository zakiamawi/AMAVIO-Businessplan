import { ArrowRight, CircleCheck, CircleHelp, CircleX, Clock3, LockKeyhole, MailCheck, ShieldCheck } from "lucide-react";
import { useMemo } from "react";
import { buildContactabilityDecision, buildFutureGatePreparation, buildOperationalSignals, buildOutreachPreflight } from "../domain/outreachReadiness";

export function OperationalReadinessPanel({ data, api, openEntity, onNavigate }) {
  const primaryOpportunity = useMemo(() => activeOpportunity(data), [data]);
  const contactability = useMemo(() => buildContactabilityDecision(data, primaryOpportunity?.primaryContactId), [data, primaryOpportunity?.primaryContactId]);
  const outreachDraft = data.outreachDrafts.find((item) => !item.archivedAt && item.contactId === primaryOpportunity?.primaryContactId);
  const preflight = useMemo(() => outreachDraft ? buildOutreachPreflight(data, outreachDraft.id) : null, [data, outreachDraft?.id]);
  const operationalSignals = useMemo(() => buildOperationalSignals(data, primaryOpportunity?.id || ""), [data, primaryOpportunity?.id]);
  const futureGates = useMemo(() => buildFutureGatePreparation(data), [data]);

  return <section className="operational-readiness readiness-workspace" aria-labelledby="operational-readiness-title">
    <div className="operational-heading">
      <div><span className="section-kicker">Konkreter Datensatz & nächste Handlung</span><h2 id="operational-readiness-title">Kontaktfreigabe im Arbeitsfall</h2><p>Hier wird ein konkreter Kontakt samt Entwurf und offenen Nachweisen geprüft. Grundsatzregeln für Quellen, Kanäle und Informationspflichten bleiben getrennt unter „System & Freigaben“.</p></div>
      <button className="decision-link" onClick={() => onNavigate("tasks")}>Offene Aufgaben <ArrowRight aria-hidden="true" /></button>
    </div>

    <div className="operational-grid">
      <article className="readiness-panel contactability-panel">
        <header><div><MailCheck aria-hidden="true" /><span>Kontaktentscheidung</span></div><span className={`readiness-state ${contactability.state}`}>{contactability.answer}</span></header>
        <h3>Darf kontaktiert werden?</h3>
        <p>{contactability.contactName} · {contactability.summary}</p>
        <div className="readiness-checks">{contactability.checks.map((check) => <div className={check.met ? "met" : "open"} key={check.id}>{check.met ? <CircleCheck aria-hidden="true" /> : <CircleHelp aria-hidden="true" />}<span><strong>{check.label}</strong><small>{check.detail}</small></span></div>)}</div>
        <button className="decision-link panel-link" onClick={() => contactability.contactId && openEntity("contacts", contactability.contactId)} disabled={!contactability.contactId}>Kontaktdetails prüfen <ArrowRight aria-hidden="true" /></button>
      </article>

      <article className="readiness-panel preflight-panel">
        <header><div><ShieldCheck aria-hidden="true" /><span>Outreach-Preflight</span></div><span className={`readiness-state ${preflight?.state || "review_required"}`}>{preflight?.label || "Kein Entwurf"}</span></header>
        <h3>Vor jeder späteren Außenaktion</h3>
        <p>Kontaktstatus, Sperre, Nachweise, Entwurf und menschliche Freigabe werden gemeinsam geprüft.</p>
        <div className="readiness-checks compact">{(preflight?.checks || []).map((check) => <div className={check.met ? "met" : "open"} key={check.id}>{check.met ? <CircleCheck aria-hidden="true" /> : <CircleX aria-hidden="true" />}<span><strong>{check.label}</strong><small>{check.detail}</small></span></div>)}</div>
        <div className="send-lock" aria-label="Produktiver Versand ist gesperrt"><LockKeyhole aria-hidden="true" /><span><strong>Produktiver Versand gesperrt</strong><small>{preflight?.providerStatus || "Kein Provider verbunden"}</small></span></div>
      </article>

      <article className="readiness-panel work-orders-panel">
        <header><div><Clock3 aria-hidden="true" /><span>Arbeitsaufträge</span></div><b>{operationalSignals.length}</b></header>
        <h3>Offene Punkte nachverfolgen</h3>
        <p>Jeder Hinweis ist aus dem lokalen Zustand abgeleitet und kann genau einmal als Aufgabe angelegt werden.</p>
        <div className="work-order-list">{operationalSignals.map((signal) => <div key={signal.readinessKey} data-readiness-key={signal.readinessKey}><span><strong>{signal.title}</strong><small>{signal.detail}</small></span><button className="work-order-action" disabled={Boolean(signal.existingTaskId)} onClick={() => api.createReadinessTask(signal)}>{signal.existingTaskId ? "Aufgabe vorhanden" : "Als Aufgabe anlegen"}</button></div>)}</div>
      </article>
    </div>

    <div className="future-gate-strip" aria-label="Vorbereitung künftiger Produktivgates"><span className="gate-strip-label">Nächste Freigaben</span>{futureGates.map((gate) => <div key={gate.id}><strong>{gate.label}</strong><span>{gate.status}</span><small>{gate.detail}</small></div>)}</div>
    <p className="readiness-boundary"><LockKeyhole aria-hidden="true" /> Ausschließlich lokal und synthetisch. Keine Rechtsfreigabe, kein Live Research, kein Connector und keine Versandfunktion.</p>
  </section>;
}

function activeOpportunity(data) {
  const active = data.opportunities.filter((item) => !item.archivedAt && item.status === "active");
  return active.find((item) => item.primaryContactId && data.outreachDrafts.some((draft) => !draft.archivedAt && draft.contactId === item.primaryContactId)) || active.find((item) => item.primaryContactId) || active[0];
}
