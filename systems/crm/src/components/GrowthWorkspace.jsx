import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { ArchiveRestore, Ban, CheckCircle2, Database, Download, FileSearch, Mail, Plus, RefreshCw, Save, SearchCheck, ShieldCheck, Upload } from "lucide-react";
import { contactName, contactRestriction, findDuplicateHints, organizationName } from "../domain/crmDomain";
import { AccessibleDialog } from "./AccessibleDialog";
import { G1ReadinessPanel } from "./G1ReadinessPanel";
import { OperationalReadinessPanel } from "./OperationalReadinessPanel";

const today = () => new Date().toISOString().slice(0, 10);

export function GrowthWorkspace({ data, api, persistence, workspace = "growth", openEntity = () => {}, onNavigate = () => {} }) {
  const [tab, setTab] = useState("research");
  const [dialog, setDialog] = useState(null);
  const [backups, setBackups] = useState([]);
  const [importPreview, setImportPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState("");

  const activeResearch = data.researchItems.filter((item) => !item.archivedAt);
  const activeDrafts = data.outreachDrafts.filter((item) => !item.archivedAt);
  const blockedContacts = data.contacts.filter((contact) => contactRestriction(contact).blocked).length;
  const approvedDrafts = activeDrafts.filter((draft) => draft.status === "approved_local").length;

  async function refreshBackups() {
    setLocalError("");
    try {
      const result = await api.listBackups();
      setBackups(result.backups || []);
    } catch (error) {
      setLocalError(error.message);
    }
  }

  useEffect(() => {
    if (workspace === "system" && persistence.mode === "sqlite") refreshBackups();
  }, [workspace, persistence.mode]);

  async function createBackup() {
    setBusy(true); setLocalError("");
    try { await api.createBackup(); await refreshBackups(); } catch (error) { setLocalError(error.message); } finally { setBusy(false); }
  }

  async function restoreBackup(id) {
    setBusy(true); setLocalError("");
    try { await api.restoreBackup(id); await refreshBackups(); } catch (error) { setLocalError(error.message); } finally { setBusy(false); }
  }

  async function readImport(file) {
    setLocalError(""); setImportPreview(null);
    try {
      const payload = JSON.parse(await file.text());
      const preview = await api.previewImport(payload);
      setImportPreview(preview);
    } catch (error) {
      setLocalError(`Importvorschau fehlgeschlagen: ${error.message}`);
    }
  }

  async function applyImport() {
    if (!importPreview?.state) return;
    setBusy(true); setLocalError("");
    try { await api.applyImport(importPreview.state); setImportPreview(null); await refreshBackups(); } catch (error) { setLocalError(error.message); } finally { setBusy(false); }
  }

  if (workspace === "system") return <div className="page-view system-workspace">
    <header className="page-header system-header">
      <div><p>AMAVIO One · Lokale Betriebsgrundlage</p><h1>System & Freigaben</h1><span>Sicherungen verwalten, den Datenvertrag prüfen und Freigabegates nachvollziehbar vorbereiten.</span></div>
      <div className="growth-maturity"><strong>Lokaler synthetischer Betrieb</strong><span>Produktive Nutzung gesperrt</span></div>
    </header>
    <DataPanel data={data} api={api} persistence={persistence} backups={backups} busy={busy} localError={localError} importPreview={importPreview} onBackup={createBackup} onRestore={restoreBackup} onExport={api.exportState} onImport={readImport} onApplyImport={applyImport} onRefresh={refreshBackups} />
  </div>;

  return <div className="page-view growth-workspace">
    <header className="page-header growth-header">
      <div><p>AMAVIO One · Vertriebsentwicklung</p><h1>Recherche & Outreach</h1><span>Zielkunden qualifizieren, Quellen belegen und Kontaktentwürfe kontrolliert vorbereiten.</span></div>
      <div className="growth-maturity"><strong>Kontrollierte Vorbereitung</strong><span>Außenaktionen gesperrt</span></div>
    </header>

    <section className="growth-metrics" aria-label="Growth-Überblick">
      <Metric label="Zielsegmente" value={data.targetSegments.filter((item) => !item.archivedAt).length} />
      <Metric label="Rechercheeinträge" value={activeResearch.length} />
      <Metric label="Outreach-Entwürfe" value={activeDrafts.length} />
      <Metric label="Lokal freigegeben" value={approvedDrafts} />
      <Metric label="Kontaktsperren" value={blockedContacts} attention={blockedContacts > 0} />
    </section>

    <nav className="journal-tabs growth-tabs" aria-label="Growth-Bereiche">
      <button className={tab === "research" ? "active" : ""} onClick={() => setTab("research")}><FileSearch aria-hidden="true" /> <span>Lead Research</span></button>
      <button className={tab === "outreach" ? "active" : ""} onClick={() => setTab("outreach")}><Mail aria-hidden="true" /> <span>Outreach-Entwürfe</span></button>
      <button className={tab === "readiness" ? "active" : ""} onClick={() => setTab("readiness")}><ShieldCheck aria-hidden="true" /> <span>Kontaktfreigabe</span></button>
    </nav>

    {tab === "research" ? <ResearchPanel data={data} api={api} items={activeResearch} onCreate={(kind) => setDialog(kind)} /> : null}
    {tab === "outreach" ? <OutreachPanel data={data} api={api} drafts={activeDrafts} onCreate={() => setDialog("outreach")} onSuppress={(contactId) => setDialog({ kind: "suppression", contactId })} /> : null}
    {tab === "readiness" ? <OperationalReadinessPanel data={data} api={api} openEntity={openEntity} onNavigate={onNavigate} /> : null}

    {dialog ? <GrowthDialog kind={dialog} data={data} api={api} onClose={() => setDialog(null)} /> : null}
  </div>;
}

function Metric({ label, value, attention = false }) {
  return <div className={attention ? "attention" : ""}><span>{label}</span><strong>{value}</strong></div>;
}

function ResearchPanel({ data, api, items, onCreate }) {
  return <section className="growth-panel">
    <div className="section-command"><div><span>01 · Kontrollierte Quellenarbeit</span><h2>Recherchewarteschlange</h2><p>Öffentliche Unternehmensinformationen werden mit Quelle, Zeitpunkt und Qualitätsstatus dokumentiert. Es findet kein Live-Scraping statt.</p></div><div><button onClick={() => onCreate("segment")}><Plus aria-hidden="true" /> Zielsegment</button><button className="primary-action" onClick={() => onCreate("research")}><Plus aria-hidden="true" /> Rechercheeintrag</button></div></div>
    <div className="research-ledger">
      {items.length ? items.map((item) => <article key={item.id}>
        <div className="research-score" aria-label={`Passung ${item.fitScore || 0} Prozent`}><strong>{item.fitScore || 0}</strong><span>Fit</span></div>
        <div><span className="eyebrow">{researchStatus(item.status)} · {item.sourceType}</span><h3>{item.organizationHint}</h3><p>{item.fitNote || "Passung noch nicht dokumentiert."}</p><small>{segmentName(data, item.targetSegmentId)} · Quelle vom {formatDate(item.researchedAt)}</small></div>
        <div className="research-actions"><a href={item.sourceUrl} target="_blank" rel="noreferrer">Quelle prüfen</a><button disabled={item.status === "converted"} onClick={() => api.convertResearch(item.id)}><SearchCheck aria-hidden="true" /> {item.status === "converted" ? "Als Lead übernommen" : "Als Lead übernehmen"}</button></div>
      </article>) : <Empty title="Keine Rechercheeinträge" text="Ein synthetischer Rechercheeintrag kann mit belegter Quelle angelegt werden." />}
    </div>
    <div className="boundary-note"><strong>Recherchegrenze</strong><p>Kein Login-, Paywall- oder CAPTCHA-Bypass, kein automatischer Personenimport und keine unmittelbare Außenaktion. Gefundene Daten bleiben bis zur Prüfung unbestätigt.</p></div>
  </section>;
}

function OutreachPanel({ data, api, drafts, onCreate, onSuppress }) {
  return <section className="growth-panel">
    <div className="section-command"><div><span>02 · Menschlich freigegebene Vorbereitung</span><h2>Outreach-Workbench</h2><p>Entwürfe, Kontaktstatus und Sperren werden zusammengeführt. „Lokal freigegeben“ ist ausdrücklich kein Versandstatus.</p></div><button className="primary-action" onClick={onCreate}><Plus aria-hidden="true" /> Entwurf</button></div>
    <div className="outreach-ledger">
      {drafts.length ? drafts.map((draft) => {
        const contact = data.contacts.find((item) => item.id === draft.contactId);
        const restriction = contactRestriction(contact);
        return <article key={draft.id} className={restriction.blocked ? "blocked" : ""}>
          <header><div><span className="eyebrow">{outreachStatus(draft.status)}</span><h3>{draft.subject}</h3><p>{contactName(contact)} · {organizationName(data, draft.organizationId)}</p></div><span className={`eligibility ${restriction.blocked ? "blocked" : "review"}`}>{restriction.blocked ? restriction.reason : consentLabel(contact?.consentStatus)}</span></header>
          <pre>{draft.body}</pre>
          <footer><span>{draft.purpose} · {data.providerAdapters.find((item) => item.id === draft.providerAdapterId)?.label || "Kein Anbieter"}</span><div><button onClick={() => onSuppress(draft.contactId)}><Ban aria-hidden="true" /> Kontakt sperren</button><button onClick={() => api.approveOutreach(draft.id)} disabled={draft.status === "approved_local" || restriction.blocked}><ShieldCheck aria-hidden="true" /> Lokal freigeben</button><button disabled title="Produktiver Versand ist technisch gesperrt"><Mail aria-hidden="true" /> Versand gesperrt</button></div></footer>
        </article>;
      }) : <Empty title="Keine Outreach-Entwürfe" text="Ein synthetischer Entwurf kann ohne Außenwirkung vorbereitet werden." />}
    </div>
    <CostGuardrails data={data} api={api} />
  </section>;
}

function CostGuardrails({ data, api }) {
  const [draft, setDraft] = useState(data.costGuardrails);
  useEffect(() => setDraft(data.costGuardrails), [data.costGuardrails]);
  return <section className="cost-guardrails"><div><span>Lokale Kostenbremse</span><h3>Anbieter- und Versandlimits</h3><p>Die Werte sind Planungsgrenzen. Da kein Anbieter verbunden ist, bleibt die technische Versandkapazität immer null.</p></div><div className="guardrail-fields"><label>Tageslimit<input type="number" min="0" value={draft.dailySendLimit} onChange={(event) => setDraft({ ...draft, dailySendLimit: event.target.value })} /></label><label>Monatslimit<input type="number" min="0" value={draft.monthlySendLimit} onChange={(event) => setDraft({ ...draft, monthlySendLimit: event.target.value })} /></label><label>Budget/Monat €<input type="number" min="0" step="1" value={draft.monthlyBudgetEur} onChange={(event) => setDraft({ ...draft, monthlyBudgetEur: event.target.value })} /></label><button onClick={() => api.updateCostGuardrails(draft)}><Save aria-hidden="true" /> Grenzen speichern</button></div></section>;
}

function DataPanel({ data, api, persistence, backups, busy, localError, importPreview, onBackup, onRestore, onExport, onImport, onApplyImport, onRefresh }) {
  const fileInput = useRef(null);
  return <section className="growth-panel data-panel">
    <div className="section-command"><div><span>Lokale Datenkontrolle</span><h2>Sicherung & Datenvertrag</h2><p>Sicherungen, kontrollierte synthetische Importe und der tatsächlich aktive Speichermodus werden hier verwaltet. Freigabefragen folgen darunter als eigener Governance-Bereich.</p></div><span className={`persistence-badge ${persistence.mode}`}>{persistence.status === "saving" ? "Speichert …" : persistence.label}</span></div>
    {localError ? <div className="contract-alert danger" role="alert"><Ban aria-hidden="true" /><span><strong>Lokale Aktion nicht abgeschlossen</strong><small>{localError}</small></span></div> : null}
    <div className="data-actions">
      <button onClick={onBackup} disabled={busy || persistence.mode !== "sqlite"}><Database aria-hidden="true" /><span><strong>SQLite-Sicherung</strong><small>Versionierter Snapshot plus lokaler JSON-Export</small></span></button>
      <button onClick={onExport}><Download aria-hidden="true" /><span><strong>JSON exportieren</strong><small>Synthetischer Zustand als portable Datei</small></span></button>
      <button onClick={() => fileInput.current?.click()}><Upload aria-hidden="true" /><span><strong>Import prüfen</strong><small>Nur freigegebene synthetische Sicherungsdateien</small></span></button>
      <input ref={fileInput} className="visually-hidden" type="file" accept="application/json,.json" onChange={(event) => event.target.files?.[0] && onImport(event.target.files[0])} />
    </div>
    {importPreview ? <div className="import-preview"><CheckCircle2 aria-hidden="true" /><div><strong>Synthetischer Import ist vertraglich lesbar</strong><p>Schema {importPreview.schemaVersion || importPreview.state?.meta?.schemaVersion}; {Object.entries(importPreview.summary || {}).map(([key, value]) => `${key}: ${value}`).join(" · ") || "lokal geprüft"}</p></div><button onClick={onApplyImport} disabled={busy}>Kontrolliert übernehmen</button></div> : null}
    <div className="backup-head"><h3>Versionierte Sicherungen</h3><button onClick={onRefresh} disabled={persistence.mode !== "sqlite"}><RefreshCw aria-hidden="true" /> Aktualisieren</button></div>
    <div className="backup-list">{backups.length ? backups.map((backup) => <article key={backup.id}><span><strong>{backup.label}</strong><small>{formatTimestamp(backup.createdAt)} · Schema {backup.schemaVersion}</small></span><button onClick={() => onRestore(backup.id)} disabled={busy}><ArchiveRestore aria-hidden="true" /> Wiederherstellen</button></article>) : <Empty title="Noch keine versionierte Sicherung" text={persistence.mode === "sqlite" ? "Erstelle die erste lokale Sicherung." : "Starte das CRM mit npm start, um SQLite-Sicherungen zu verwalten."} />}</div>
    <div className="data-contract"><h3>Aktiver Datenvertrag</h3><dl><div><dt>Schema</dt><dd>v{data.meta.schemaVersion}</dd></div><div><dt>Datentyp</dt><dd>{data.meta.synthetic ? "synthetisch" : "nicht freigegeben"}</dd></div><div><dt>Speichermodus</dt><dd>{persistence.label}</dd></div><div><dt>Letzte lokale Änderung</dt><dd>{formatTimestamp(data.meta.updatedAt)}</dd></div></dl></div>
    <G1ReadinessPanel data={data} persistence={persistence} onRunControls={api.runG1Controls} onRunRestoreDrill={api.runRestoreDrill} />
  </section>;
}

function GrowthDialog({ kind, data, api, onClose }) {
  const normalized = kind && typeof kind === "object" ? kind.kind : kind;
  const firstRef = useRef(null);
  const initial = useMemo(() => {
    if (normalized === "segment") return { name: "", sector: "Gesundheit & Pflege", region: "Nordrhein-Westfalen", fitCriteria: "", exclusionCriteria: "", ownerId: "usr-za", status: "active" };
    if (normalized === "research") return { organizationHint: "", website: "", sourceUrl: "", sourceType: "public_company_website", researchedAt: today(), researchedBy: "usr-za", ownerId: "usr-za", targetSegmentId: data.targetSegments[0]?.id || "", status: "reviewing", fitScore: 50, fitNote: "", contactHint: "", personalDataIncluded: false, termsReviewed: false, convertedLeadId: "" };
    if (normalized === "outreach") return { contactId: data.contacts[0]?.id || "", organizationId: data.contacts[0]?.organizationId || "", ownerId: "usr-za", purpose: "Bedarfsqualifizierung", channel: "email", subject: "", body: "", status: "review_required", providerAdapterId: "provider-brevo-disabled", legalReviewNote: "Versandgrundlage und Kanal müssen vor jeder Außenaktion separat geprüft werden.", approvedAt: null, approvedBy: "", sentAt: null };
    return { reason: "Widerspruch oder interner Sperrentscheid" };
  }, [normalized, data]);
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const duplicateHints = useMemo(() => normalized === "research" ? findDuplicateHints("researchItems", draft, data) : [], [normalized, draft, data]);
  useEffect(() => { setDraft(initial); setError(""); }, [initial]);
  function save(event) {
    event.preventDefault(); setError("");
    try {
      if (normalized === "suppression") api.suppressContact(kind.contactId, draft.reason);
      else api.create(normalized === "segment" ? "targetSegments" : normalized === "research" ? "researchItems" : "outreachDrafts", normalized === "outreach" ? { ...draft, organizationId: data.contacts.find((item) => item.id === draft.contactId)?.organizationId || "" } : draft);
      onClose();
    } catch (saveError) { setError(saveError.message); }
  }

  const titles = { segment: "Zielsegment anlegen", research: "Rechercheeintrag anlegen", outreach: "Outreach-Entwurf anlegen", suppression: "Kontakt lokal sperren" };
  return <AccessibleDialog open title={titles[normalized]} description="Alle Eingaben bleiben synthetisch und lokal; es erfolgt keine Außenaktion." onClose={onClose} initialFocusRef={firstRef} size="large"><form className="growth-form" onSubmit={save}>{error ? <p className="form-error" role="alert">{error}</p> : null}{normalized === "segment" ? <>
    <Field ref={firstRef} label="Segmentname *" value={draft.name} onChange={(value) => setDraft({ ...draft, name: value })} />
    <Field label="Branche" value={draft.sector} onChange={(value) => setDraft({ ...draft, sector: value })} />
    <Field label="Region" value={draft.region} onChange={(value) => setDraft({ ...draft, region: value })} />
    <Field wide textarea label="Passungskriterien *" value={draft.fitCriteria} onChange={(value) => setDraft({ ...draft, fitCriteria: value })} />
    <Field wide textarea label="Ausschlusskriterien" value={draft.exclusionCriteria} onChange={(value) => setDraft({ ...draft, exclusionCriteria: value })} />
  </> : null}{normalized === "research" ? <>
    <Field ref={firstRef} label="Organisation / Hinweis *" value={draft.organizationHint} onChange={(value) => setDraft({ ...draft, organizationHint: value })} />
    <Field label="Webseite" type="url" value={draft.website} onChange={(value) => setDraft({ ...draft, website: value })} />
    <Field wide label="Quellen-URL *" type="url" value={draft.sourceUrl} onChange={(value) => setDraft({ ...draft, sourceUrl: value })} />
    <label>Quellenart *<select value={draft.sourceType} onChange={(event) => setDraft({ ...draft, sourceType: event.target.value })}><option value="public_company_website">Öffentliche Unternehmenswebseite</option><option value="public_directory">Öffentliches Verzeichnis</option><option value="manual_referral">Manueller Hinweis</option></select></label>
    <label>Zielsegment<select value={draft.targetSegmentId} onChange={(event) => setDraft({ ...draft, targetSegmentId: event.target.value })}>{data.targetSegments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    <label>Passung 0–100<input type="number" min="0" max="100" value={draft.fitScore} onChange={(event) => setDraft({ ...draft, fitScore: event.target.value })} /></label>
    <Field wide textarea label="Passungsnotiz" value={draft.fitNote} onChange={(value) => setDraft({ ...draft, fitNote: value })} />
    <Field wide label="Ansprechpartnerhinweis" value={draft.contactHint} onChange={(value) => setDraft({ ...draft, contactHint: value })} />
    {duplicateHints.length ? <div className="contract-alert warning wide" role="status"><SearchCheck aria-hidden="true" /><span><strong>Dublettenhinweis</strong><small>{duplicateHints.join(" · ")}</small></span></div> : null}
  </> : null}{normalized === "outreach" ? <>
    <label ref={firstRef}>Kontakt *<select value={draft.contactId} onChange={(event) => setDraft({ ...draft, contactId: event.target.value })}>{data.contacts.filter((item) => !item.archivedAt).map((item) => <option key={item.id} value={item.id}>{contactName(item)} · {organizationName(data, item.organizationId)}</option>)}</select></label>
    <Field label="Kontaktzweck *" value={draft.purpose} onChange={(value) => setDraft({ ...draft, purpose: value })} />
    <Field wide label="Betreff *" value={draft.subject} onChange={(value) => setDraft({ ...draft, subject: value })} />
    <Field wide textarea label="Entwurfstext *" value={draft.body} onChange={(value) => setDraft({ ...draft, body: value })} />
    <Field wide textarea label="Versand- und Kanalprüfung *" value={draft.legalReviewNote} onChange={(value) => setDraft({ ...draft, legalReviewNote: value })} />
  </> : null}{normalized === "suppression" ? <Field ref={firstRef} wide textarea label="Sperrgrund *" value={draft.reason} onChange={(value) => setDraft({ ...draft, reason: value })} /> : null}<footer className="dialog-actions"><button type="button" onClick={onClose}>Abbrechen</button><button className="primary-action" type="submit">Lokal speichern</button></footer></form></AccessibleDialog>;
}

const Field = forwardRef(function Field({ label, value, onChange, textarea = false, wide = false, type = "text" }, ref) {
  return <label className={wide ? "wide" : ""}>{label}{textarea ? <textarea ref={ref} value={value} onChange={(event) => onChange(event.target.value)} rows="4" /> : <input ref={ref} type={type} value={value} onChange={(event) => onChange(event.target.value)} />}</label>;
});

function Empty({ title, text }) { return <div className="empty-state"><strong>{title}</strong><span>{text}</span></div>; }
function segmentName(data, id) { return data.targetSegments.find((item) => item.id === id)?.name || "Ohne Zielsegment"; }
function researchStatus(value) { return ({ captured: "Erfasst", reviewing: "In Prüfung", qualified: "Qualifiziert", rejected: "Verworfen", converted: "Als Lead übernommen" })[value] || value; }
function outreachStatus(value) { return ({ draft: "Entwurf", review_required: "Prüfung erforderlich", approved_local: "Lokal freigegeben · nicht versendet", blocked: "Gesperrt", cancelled: "Beendet" })[value] || value; }
function consentLabel(value) { return ({ unknown: "Kontaktgrundlage offen", documented: "Status dokumentiert", not_required_review: "Gesondert geprüft", withdrawn: "Widerrufen", blocked: "Gesperrt" })[value] || "Status offen"; }
function formatDate(value) { return value ? new Intl.DateTimeFormat("de-DE").format(new Date(`${value}T12:00:00`)) : "–"; }
function formatTimestamp(value) { return value ? new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "–"; }
