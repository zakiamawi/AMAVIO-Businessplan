import { useMemo, useState } from "react";
import { AlertTriangle, Archive, ArrowRight, CalendarClock, FileText, MessageSquareText, NotebookPen, Plus, Save, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { activeRecords, getAgingSignals, normalizeText, operationalEntityTypes, operationalTypeMeta, organizationName } from "../domain/crmDomain";

const icons = {
  notes: NotebookPen,
  conversations: MessageSquareText,
  appointments: CalendarClock,
  followUps: CalendarClock,
  offers: FileText,
  decisions: SlidersHorizontal,
  documentReferences: FileText,
};

export function WorkJournalView({ data, onOpen, onCreate, onArchiveView, onUpdateAgingRules }) {
  const [activeType, setActiveType] = useState("notes");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [includeArchived, setIncludeArchived] = useState(false);
  const [selectedViewId, setSelectedViewId] = useState("");
  const [rules, setRules] = useState(() => ({ ...data.agingRules }));
  const agingActive = activeType === "aging";

  const records = useMemo(() => {
    if (agingActive) return [];
    return activeRecords(data[activeType] || [], includeArchived).filter((item) => {
      const matchesQuery = !query.trim() || normalizeText(recordSearchText(activeType, item, data)).includes(normalizeText(query));
      return matchesQuery && (status === "all" || item.status === status);
    });
  }, [activeType, agingActive, data, includeArchived, query, status]);

  const statuses = useMemo(() => agingActive ? [] : [...new Set((data[activeType] || []).map((item) => item.status).filter(Boolean))], [activeType, agingActive, data]);
  const savedViews = useMemo(() => (data.savedViews || []).filter((item) => !item.archivedAt), [data.savedViews]);
  const signals = useMemo(() => getAgingSignals(data, "2026-10-10"), [data]);

  function selectType(type) {
    setActiveType(type);
    setStatus("all");
    setQuery("");
    setSelectedViewId("");
  }

  function loadSavedView(id) {
    setSelectedViewId(id);
    if (!id) return;
    const view = savedViews.find((item) => item.id === id);
    if (!view) return;
    setActiveType(view.entityType);
    setQuery(view.query || "");
    setStatus(view.status || "all");
    setIncludeArchived(false);
  }

  return <div className="page-view work-journal-view">
    <header className="page-header">
      <div>
        <p>AMAVIO One · verbundenes Arbeitsjournal</p>
        <h1>Arbeitsjournal</h1>
        <span>Notizen, Gespräche, Termine, Wiedervorlagen, Angebote, Entscheidungen und Dokumentreferenzen – synthetisch, verbunden und auditierbar.</span>
      </div>
      <div className="page-header-actions">
        <strong>{agingActive ? `${signals.length} Hinweise` : `${records.length} Einträge`}</strong>
        {!agingActive ? <button className="primary-action" onClick={() => onCreate(activeType)}><Plus aria-hidden="true" /> {operationalTypeMeta[activeType].label}</button> : null}
      </div>
    </header>

    <nav className="journal-tabs" aria-label="Arbeitsjournal-Bereiche">
      {operationalEntityTypes.map((type) => {
        const Icon = icons[type];
        return <button key={type} className={activeType === type ? "active" : ""} onClick={() => selectType(type)} aria-current={activeType === type ? "page" : undefined}><Icon aria-hidden="true" /><span>{operationalTypeMeta[type].plural}</span></button>;
      })}
      <button className={agingActive ? "active" : ""} onClick={() => selectType("aging")} aria-current={agingActive ? "page" : undefined}><AlertTriangle aria-hidden="true" /><span>Steuerung</span></button>
    </nav>

    {!agingActive ? <>
      <div className="saved-view-rail">
        <label>Gespeicherte lokale Ansicht
          <select value={selectedViewId} onChange={(event) => loadSavedView(event.target.value)}>
            <option value="">Keine Ansicht gewählt</option>
            {savedViews.map((view) => <option key={view.id} value={view.id}>{view.name}</option>)}
          </select>
        </label>
        <button onClick={() => onCreate("savedViews", { entityType: activeType, query, status })}><Save aria-hidden="true" /> Aktuelle Filter speichern</button>
        {selectedViewId ? <button className="quiet-danger" onClick={() => { onArchiveView(selectedViewId); setSelectedViewId(""); }}><Trash2 aria-hidden="true" /> Ansicht entfernen</button> : null}
        <span>Nur lokal gespeichert; keine Freigabe, Synchronisierung oder Mehrbenutzerwirkung.</span>
      </div>

      <div className="view-toolbar journal-toolbar">
        <label className="inline-search"><Search aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`${operationalTypeMeta[activeType].plural} durchsuchen …`} /></label>
        <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Status filtern"><option value="all">Alle Status</option>{statuses.map((value) => <option key={value} value={value}>{statusLabel(value)}</option>)}</select>
        <label className="archive-toggle"><input type="checkbox" checked={includeArchived} onChange={(event) => setIncludeArchived(event.target.checked)} /><Archive aria-hidden="true" /> Archivierte</label>
      </div>

      <div className="journal-ledger" aria-live="polite">
        {records.length ? records.map((record) => {
          const Icon = icons[activeType];
          return <button key={record.id} className={record.archivedAt ? "archived-row" : ""} onClick={() => onOpen(activeType, record.id)}>
            <span className="journal-icon"><Icon aria-hidden="true" /></span>
            <span className="journal-primary"><strong>{recordTitle(activeType, record)}</strong><small>{recordSubtitle(activeType, record, data)}</small></span>
            <span className="journal-status"><b>{statusLabel(record.status) || "Dokumentiert"}</b><small>{recordDate(activeType, record)}</small></span>
            <ArrowRight aria-hidden="true" />
          </button>;
        }) : <div className="empty-state"><strong>Keine Einträge in dieser Ansicht.</strong><span>Filter anpassen oder einen neuen synthetischen Datensatz anlegen.</span></div>}
      </div>
    </> : <AgingControl rules={rules} setRules={setRules} signals={signals} onSave={() => onUpdateAgingRules(rules)} onOpen={onOpen} />}

    <div className="boundary-note"><strong>Lokale Fachgrenze</strong><p>Keine Kalender-, E-Mail-, Datei- oder Dokumentenspeicherverbindung. „Als versendet markiert“ dokumentiert ausschließlich einen synthetischen internen Zustand und löst keinen Versand aus.</p></div>
  </div>;
}

function AgingControl({ rules, setRules, signals, onSave, onOpen }) {
  const fields = [
    ["opportunityInactivityDays", "Chance ohne Aktivität melden"],
    ["followUpWarningDays", "Wiedervorlage vorwarnen"],
    ["offerExpiryWarningDays", "Angebotsgültigkeit vorwarnen"],
  ];
  return <div className="aging-layout">
    <section className="aging-rules">
      <h2>Lokale Alterungsregeln</h2>
      <p>Die Grenzwerte erzeugen ausschließlich Hinweise im synthetischen Arbeitszustand. Es werden keine Nachrichten oder Automationen ausgelöst.</p>
      {fields.map(([field, label]) => <label key={field}>{label}<input type="number" min="0" max="365" aria-label={label} value={rules[field] ?? ""} onChange={(event) => setRules((current) => ({ ...current, [field]: Number(event.target.value) }))} /><span>Tage</span></label>)}
      <button className="primary-action" onClick={onSave}><Save aria-hidden="true" /> Regeln lokal speichern</button>
    </section>
    <section className="aging-signals" aria-label="Aktuelle lokale Hinweise">
      <h2>Aktuelle Hinweise</h2>
      <p>{signals.length ? `${signals.length} Hinweise auf Basis des synthetischen Stands.` : "Keine Hinweise für die gewählten Grenzwerte."}</p>
      {signals.map((signal) => <button key={signal.id} className={signal.severity} onClick={() => onOpen(signal.entityType, signal.entityId)}><AlertTriangle aria-hidden="true" /><span><strong>{signal.title}</strong><small>Bezugsdatum: {formatDate(signal.dueDate)}</small></span><ArrowRight aria-hidden="true" /></button>)}
    </section>
  </div>;
}

function recordTitle(type, record) {
  if (type === "conversations") return record.subject;
  if (type === "offers") return `Angebot ${record.versionLabel}`;
  return record.title;
}

function recordSubtitle(type, record, data) {
  const opportunity = data.opportunities.find((item) => item.id === record.opportunityId);
  const organizationId = record.organizationId || opportunity?.organizationId;
  if (type === "documentReferences") return `${record.documentType} · ${record.reference}`;
  return `${opportunity?.title || organizationName(data, organizationId)} · ${organizationName(data, organizationId)}`;
}

function recordSearchText(type, record, data) {
  return [recordTitle(type, record), record.body, record.summary, record.nextStep, record.agenda, record.description, record.scopeSummary, record.rationale, record.reference, record.documentType, record.versionLabel, record.status, recordSubtitle(type, record, data)].join(" ");
}

function recordDate(type, record) {
  return formatDate(({ notes: record.occurredAt, conversations: record.occurredAt, appointments: record.startsAt, followUps: record.dueDate, offers: record.validUntil, decisions: record.decisionDate || record.createdAt, documentReferences: record.updatedAt })[type]);
}

function statusLabel(value) {
  return ({ planned: "Geplant", completed: "Erledigt", cancelled: "Abgesagt", open: "Offen", draft: "Entwurf", reviewed: "Intern geprüft", marked_sent: "Als versendet markiert", accepted: "Angenommen", rejected: "Abgelehnt", expired: "Abgelaufen", pending: "Offen", approved: "Freigegeben", declined: "Abgelehnt", deferred: "Vertagt", current: "Aktuell", superseded: "Ersetzt", archived: "Archiviert" })[value] || value || "";
}

function formatDate(value) {
  if (!value) return "–";
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${String(value).slice(0, 10)}T12:00:00`));
}
