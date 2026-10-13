import { useEffect, useMemo, useState } from "react";
import { Archive, ArrowLeft, ArrowRight, Check, Circle, Clock3, Handshake, Plus, Route, Search } from "lucide-react";
import { activeRecords, contactName, normalizeText, organizationName, ownerById, pipelineStages, stageById } from "../domain/crmDomain";
import { importedCrmRecordsApi } from "../services/importedCrmRecords";
import { OpportunityTable } from "./OpportunityTable";
import { PipelineRail } from "./PipelineRail";

const money = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

function PageHeader({ title, description, meta, action }) {
  return <header className="page-header"><div><p>AMAVIO One · CRM-Arbeitsbereich</p><h1>{title}</h1><span>{description}</span></div><div className="page-header-actions">{meta ? <strong>{meta}</strong> : null}{action}</div></header>;
}

function ViewToolbar({ query, setQuery, placeholder, includeArchived, setIncludeArchived, showArchive = true, children }) {
  return <div className="view-toolbar"><label className="inline-search"><Search aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} /></label>{children}{showArchive ? <label className="archive-toggle"><input type="checkbox" checked={includeArchived} onChange={(event) => setIncludeArchived(event.target.checked)} /><Archive aria-hidden="true" /> Archivierte</label> : null}</div>;
}

export function PipelineView({ data, stageFilter, setStageFilter, ownerFilter, setOwnerFilter, openOpportunity, onCreate }) {
  const [query, setQuery] = useState("");
  const [includeArchived, setIncludeArchived] = useState(false);
  const filtered = useMemo(() => activeRecords(data.opportunities, includeArchived).filter((item) => {
    const haystack = normalizeText([item.title, organizationName(data, item.organizationId), item.nextAction, item.sourceLabel].join(" "));
    return (!query.trim() || haystack.includes(normalizeText(query))) && (stageFilter === "all" || item.stageId === stageFilter) && (ownerFilter === "all" || item.ownerId === ownerFilter);
  }), [data, includeArchived, ownerFilter, query, stageFilter]);
  const total = filtered.reduce((sum, item) => sum + Number(item.potential || 0), 0);
  return <div className="page-view">
    <PageHeader title="Pipeline" description="Vom ersten Signal bis zur kontrollierten kommerziellen Entscheidung." meta={`${money.format(total)} sichtbares Potenzial`} action={<button className="primary-action" onClick={() => onCreate("opportunities")}><Plus aria-hidden="true" /> Neue Chance</button>} />
    <PipelineRail opportunities={data.opportunities} selected={stageFilter} onSelect={setStageFilter} />
    <ViewToolbar query={query} setQuery={setQuery} placeholder="Pipeline durchsuchen …" includeArchived={includeArchived} setIncludeArchived={setIncludeArchived}>
      <select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)} aria-label="Nach Verantwortlichem filtern"><option value="all">Alle Verantwortlichen</option>{data.users.map((owner) => <option key={owner.id} value={owner.id}>{owner.name}</option>)}</select>
    </ViewToolbar>
    <div className="pipeline-board" aria-label="Pipeline Board">{pipelineStages.map((stage) => { const items = filtered.filter((item) => item.stageId === stage.id); return <section key={stage.id}><header><h2>{stage.label}</h2><span>{items.length}</span></header>{items.length ? items.map((item) => <button key={item.id} onClick={() => openOpportunity(item.id)}><strong>{organizationName(data, item.organizationId)}</strong><span>{item.title}</span><small>{money.format(item.potential)} · {ownerById[item.ownerId]?.name}</small><ArrowRight aria-hidden="true" /></button>) : <p className="column-empty">Keine Chancen</p>}</section>; })}</div>
    <div className="pipeline-list-section"><h2>Listenansicht</h2><OpportunityTable opportunities={filtered} data={data} onOpen={openOpportunity} /></div>
  </div>;
}

export function OrganizationsView({ data, onOpen, onOpenImported, onCreate }) {
  const [query, setQuery] = useState("");
  const [includeArchived, setIncludeArchived] = useState(false);
  const [source, setSource] = useState("all");
  const [page, setPage] = useState(1);
  const visible = activeRecords(data.organizations, includeArchived).filter((item) => normalizeText([item.displayName, item.sector, item.region, item.notes].join(" ")).includes(normalizeText(query)));
  const imported = useImportedRecords("organizations", query, page, source !== "local");
  const visibleLocal = source === "imported" ? [] : visible;
  const visibleImported = source === "local" ? [] : imported.rows;
  const total = visibleLocal.length + (source === "local" ? 0 : imported.total);
  return <div className="page-view">
    <PageHeader title="Organisationen" description="Alle Unternehmen und Einrichtungen in einer gemeinsamen CRM-Arbeitsansicht." meta={`${formatCount(total)} Organisationen`} action={<button className="primary-action" onClick={() => onCreate("organizations")}><Plus aria-hidden="true" /> Organisation</button>} />
    <ViewToolbar query={query} setQuery={(value) => { setQuery(value); setPage(1); }} placeholder="Organisation, Segment oder Region …" includeArchived={includeArchived} setIncludeArchived={setIncludeArchived} showArchive={source !== "imported"}>
      <SourceFilter value={source} onChange={(value) => { setSource(value); setPage(1); }} noun="Organisationen" />
    </ViewToolbar>
    {source !== "local" ? <p className="directory-origin-note"><span>Importierte Organisationen</span> sind hier direkt eingebunden und vorerst schreibgeschützt.</p> : null}
    <div className="directory-list canonical-directory">{visibleLocal.map((organization) => {
      const contacts = data.contacts.filter((item) => item.organizationId === organization.id && !item.archivedAt).length;
      const opportunities = data.opportunities.filter((item) => item.organizationId === organization.id && !item.archivedAt).length;
      return <button className={organization.archivedAt ? "archived-row" : ""} key={organization.id} onClick={() => onOpen("organizations", organization.id)}><div className="directory-avatar">{initials(organization.displayName)}</div><div><h2>{organization.displayName}</h2><p>{organization.sector} · {organization.region}</p><span>{ownerById[organization.ownerId]?.name} · <b className="origin-label">Lokal</b></span></div><div className="directory-context"><strong>{contacts} Kontakte</strong><span>{opportunities} Chancen</span></div><ArrowRight aria-hidden="true" /></button>;
    })}
    {visibleImported.map((organization) => <button key={organization.id} onClick={() => onOpenImported("organization", organization.id)}><div className="directory-avatar imported">{initials(organization.name)}</div><div><h2>{organization.name}</h2><p>{organization.segment || "Segment nicht angegeben"} · {locationLabel(organization)}</p><span>{organization.central_email || "Keine E-Mail"} · <b className="origin-label imported">Importiert</b></span></div><div className="directory-context"><strong>{organization.contact_candidates || 0} Kontakte</strong><span>Schreibgeschützt</span></div><ArrowRight aria-hidden="true" /></button>)}
    {!visibleLocal.length && !visibleImported.length && !imported.loading ? <Empty title="Keine Organisationen gefunden." text="Suche oder Datenquelle anpassen oder eine Organisation anlegen." /> : null}
    {imported.loading && source !== "local" ? <DirectoryLoading text="Organisationen werden geladen …" /> : null}
    {imported.error && source !== "local" ? <DirectoryError text={imported.error} /> : null}</div>
    {source !== "local" && imported.pages > 1 ? <DirectoryPagination page={imported.page} pages={imported.pages} total={imported.total} onPage={setPage} /> : null}
  </div>;
}

export function ContactsView({ data, onOpen, onOpenImported, onCreate }) {
  const [query, setQuery] = useState("");
  const [includeArchived, setIncludeArchived] = useState(false);
  const [source, setSource] = useState("all");
  const [page, setPage] = useState(1);
  const visible = activeRecords(data.contacts, includeArchived).filter((contact) => normalizeText([contactName(contact), organizationName(data, contact.organizationId), contact.role, contact.email].join(" ")).includes(normalizeText(query)));
  const imported = useImportedRecords("contacts", query, page, source !== "local");
  const visibleLocal = source === "imported" ? [] : visible;
  const visibleImported = source === "local" ? [] : imported.rows;
  const total = visibleLocal.length + (source === "local" ? 0 : imported.total);
  return <div className="page-view">
    <PageHeader title="Kontakte" description="Alle Ansprechpartner mit direktem Bezug zu ihrer Organisation." meta={`${formatCount(total)} Kontakte`} action={<button className="primary-action" onClick={() => onCreate("contacts")}><Plus aria-hidden="true" /> Kontakt</button>} />
    <ViewToolbar query={query} setQuery={(value) => { setQuery(value); setPage(1); }} placeholder="Name, Organisation, Funktion oder E-Mail …" includeArchived={includeArchived} setIncludeArchived={setIncludeArchived} showArchive={source !== "imported"}>
      <SourceFilter value={source} onChange={(value) => { setSource(value); setPage(1); }} noun="Kontakte" />
    </ViewToolbar>
    {source !== "local" ? <p className="directory-origin-note"><span>Importierte Kontakte</span> sind hier direkt eingebunden. Ohne Freigabe bleiben sie für Außenkontakt gesperrt.</p> : null}
    <div className="directory-list canonical-directory">{visibleLocal.map((contact) => {
      const related = data.opportunities.filter((item) => item.primaryContactId === contact.id || item.participantContactIds?.includes(contact.id));
      return <button className={contact.archivedAt ? "archived-row" : ""} key={contact.id} onClick={() => onOpen("contacts", contact.id)}><div className="directory-avatar">{initials(contactName(contact))}</div><div><h2>{contactName(contact)}</h2><p>{contact.role || "Funktion offen"} · {organizationName(data, contact.organizationId)}</p><span>{contact.email || "Keine E-Mail"} · {contact.phone || "Kein Telefon"} · <b className="origin-label">Lokal</b></span></div><div className="directory-context"><strong>{contact.contactStatus === "do_not_contact" ? "Nicht kontaktieren" : relationshipLabel(contact.relationshipRole)}</strong><span>{related.length} verknüpfte Chance{related.length === 1 ? "" : "n"}</span></div><ArrowRight aria-hidden="true" /></button>;
    })}
    {visibleImported.map((contact) => <button key={contact.id} onClick={() => onOpenImported("contact", contact.id)}><div className="directory-avatar imported">{initials(importedContactName(contact))}</div><div><h2>{importedContactName(contact)}</h2><p>{contact.original_role || contact.target_role || "Funktion nicht angegeben"} · {contact.organization_name || "Organisation nicht zugeordnet"}</p><span>{contact.email || "Keine E-Mail"} · {contact.phone || "Kein Telefon"} · <b className="origin-label imported">Importiert</b></span></div><div className="directory-context"><strong className="contact-blocked">Nicht kontaktieren</strong><span>Schreibgeschützt</span></div><ArrowRight aria-hidden="true" /></button>)}
    {!visibleLocal.length && !visibleImported.length && !imported.loading ? <Empty title="Keine Kontakte gefunden." text="Suche oder Datenquelle anpassen oder einen Kontakt anlegen." /> : null}
    {imported.loading && source !== "local" ? <DirectoryLoading text="Kontakte werden geladen …" /> : null}
    {imported.error && source !== "local" ? <DirectoryError text={imported.error} /> : null}</div>
    {source !== "local" && imported.pages > 1 ? <DirectoryPagination page={imported.page} pages={imported.pages} total={imported.total} onPage={setPage} /> : null}
  </div>;
}

export function LeadsView({ data, onOpen, onCreate }) {
  const [query, setQuery] = useState("");
  const [includeArchived, setIncludeArchived] = useState(false);
  const [status, setStatus] = useState("active");
  const visible = activeRecords(data.leads, includeArchived).filter((lead) => {
    const matchesQuery = normalizeText([lead.title, lead.organizationHint, organizationName(data, lead.organizationId), lead.needSummary, lead.sourceLabel].join(" ")).includes(normalizeText(query));
    const matchesStatus = status === "all" || (status === "active" ? !["converted", "disqualified"].includes(lead.status) : lead.status === status);
    return matchesQuery && matchesStatus;
  });
  return <div className="page-view">
    <PageHeader title="Leads" description="Ungeprüfte Signale bleiben außerhalb der Pipeline, bis Organisation, Bedarf, Zuständigkeit und nächster Schritt nachvollziehbar dokumentiert sind." meta={`${visible.length} Leads`} action={<button className="primary-action" onClick={() => onCreate("leads")}><Plus aria-hidden="true" /> Lead</button>} />
    <ViewToolbar query={query} setQuery={setQuery} placeholder="Lead, Organisation oder Quelle …" includeArchived={includeArchived} setIncludeArchived={setIncludeArchived}><select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Leadstatus filtern"><option value="active">In Prüfung</option><option value="new">Neu</option><option value="reviewing">Prüfung</option><option value="qualified">Qualifiziert</option><option value="converted">Konvertiert</option><option value="disqualified">Nicht qualifiziert</option><option value="all">Alle Status</option></select></ViewToolbar>
    <div className="directory-list canonical-directory lead-directory">{visible.length ? visible.map((lead) => <button className={lead.archivedAt ? "archived-row" : ""} key={lead.id} onClick={() => onOpen("leads", lead.id)}><div className="directory-avatar"><Route aria-hidden="true" /></div><div><h2>{lead.title}</h2><p>{lead.organizationId ? organizationName(data, lead.organizationId) : lead.organizationHint}</p><span>{lead.sourceLabel} · {ownerById[lead.ownerId]?.name}</span></div><div className="directory-context"><strong>{leadStatus(lead.status)}</strong><span>{lead.nextAction || "Nächster Schritt offen"}</span></div><ArrowRight aria-hidden="true" /></button>) : <Empty title="Keine Leads in dieser Ansicht." text="Filter anpassen oder ein synthetisches Signal anlegen." />}</div>
    <div className="boundary-note"><strong>Lead-Grenze</strong><p>Ein Lead ist noch keine Chance. Die Umwandlung wird erst bei erfüllten Qualifizierungskriterien angeboten und bleibt vollständig lokal.</p></div>
  </div>;
}

export function PartnersView({ data, onOpen, onCreate }) {
  const [query, setQuery] = useState("");
  const [includeArchived, setIncludeArchived] = useState(false);
  const visible = activeRecords(data.partnerOrganizations, includeArchived).filter((partner) => normalizeText([partner.displayName, partner.category, partner.nextAction].join(" ")).includes(normalizeText(query)));
  return <div className="page-view">
    <PageHeader title="Partner & Quellen" description="Beziehungspfade bleiben vom Leistungsversprechen und von Arbeitgeber-Organisationen getrennt." meta={`${visible.length} Partnerpfade`} action={<button className="primary-action" onClick={() => onCreate("partnerOrganizations")}><Plus aria-hidden="true" /> Partner</button>} />
    <ViewToolbar query={query} setQuery={setQuery} placeholder="Partner oder Kategorie …" includeArchived={includeArchived} setIncludeArchived={setIncludeArchived} />
    <div className="partner-ledger"><div className="ledger-head"><span>Partner</span><span>Kategorie</span><span>Status</span><span>Kontakte</span><span>Verantwortlich</span><span>Nächster Schritt</span></div>{visible.length ? visible.map((partner) => { const contacts = data.partnerContacts.filter((item) => item.partnerOrganizationId === partner.id && !item.archivedAt).length; return <button className={partner.archivedAt ? "archived-row" : ""} key={partner.id} onClick={() => onOpen("partnerOrganizations", partner.id)}><div><Handshake aria-hidden="true" /><span><strong>{partner.displayName}</strong><small>Synthetischer Partnerpfad</small></span></div><span>{partner.category}</span><b>{partnerStatus(partner.relationshipStatus)}</b><b>{contacts}</b><b>{ownerById[partner.ownerId]?.initials}</b><span>{partner.nextAction}</span></button>; }) : <Empty title="Keine Partner gefunden." text="Suche oder Archivfilter anpassen oder einen synthetischen Partner anlegen." />}</div>
    <div className="boundary-note"><strong>Beschlossene Partner-Governance</strong><p>Interne lokale Pflege ist möglich. Ein Eintrag belegt weiterhin keine Kooperation, Verfügbarkeit oder Leistungszusage; ein Partnerlogin existiert nicht.</p></div>
  </div>;
}

export function TasksView({ data, onOpen, onCreate, onSetStatus }) {
  const [query, setQuery] = useState("");
  const [includeArchived, setIncludeArchived] = useState(false);
  const [status, setStatus] = useState("active");
  const visible = activeRecords(data.tasks, includeArchived).filter((task) => {
    const opportunity = data.opportunities.find((item) => item.id === task.opportunityId);
    const matchesQuery = normalizeText([task.title, opportunity?.title, organizationName(data, task.organizationId)].join(" ")).includes(normalizeText(query));
    const matchesStatus = status === "all" || (status === "active" ? task.status !== "completed" : task.status === status);
    return matchesQuery && matchesStatus;
  }).sort((a, b) => Number(a.status === "completed") - Number(b.status === "completed") || a.dueDate.localeCompare(b.dueDate));
  return <div className="page-view">
    <PageHeader title="Aufgaben" description="Verantwortete nächste Handlungen mit Beziehungen, Fälligkeit und Status." meta={`${data.tasks.filter((task) => !task.archivedAt && task.status !== "completed").length} offen`} action={<button className="primary-action" onClick={() => onCreate("tasks")}><Plus aria-hidden="true" /> Aufgabe</button>} />
    <ViewToolbar query={query} setQuery={setQuery} placeholder="Aufgabe, Organisation oder Chance …" includeArchived={includeArchived} setIncludeArchived={setIncludeArchived}><select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Aufgabenstatus filtern"><option value="active">Offen und in Arbeit</option><option value="open">Nur offen</option><option value="in_progress">Nur in Arbeit</option><option value="completed">Erledigt</option><option value="all">Alle Status</option></select></ViewToolbar>
    <div className="task-worklist">{visible.length ? visible.map((task) => { const opportunity = data.opportunities.find((item) => item.id === task.opportunityId); return <article key={task.id} className={`${task.status === "completed" ? "done" : ""} ${task.archivedAt ? "archived-row" : ""}`}><button className="task-check-button" onClick={() => onSetStatus(task.id, task.status === "completed" ? "open" : "completed")} aria-label={task.status === "completed" ? `${task.title} wieder öffnen` : `${task.title} abschließen`} disabled={Boolean(task.archivedAt)}><span className="task-check">{task.status === "completed" ? <Check aria-hidden="true" /> : <Circle aria-hidden="true" />}</span></button><button className="task-main" onClick={() => onOpen("tasks", task.id)}><span><strong>{task.title}</strong><small>{opportunity?.title || "Ohne Chance"} · {organizationName(data, task.organizationId)}</small></span><span className="task-due"><Clock3 aria-hidden="true" />{formatDate(task.dueDate)}</span><span className="avatar small">{ownerById[task.ownerId]?.initials}</span><ArrowRight aria-hidden="true" /></button></article>; }) : <Empty title="Keine Aufgaben in dieser Ansicht." text="Filter anpassen oder eine synthetische Aufgabe anlegen." />}</div>
  </div>;
}

function Empty({ title, text }) { return <div className="empty-state"><strong>{title}</strong><span>{text}</span></div>; }
function DirectoryLoading({ text }) { return <div className="directory-load-state" role="status">{text}</div>; }
function DirectoryError({ text }) { return <div className="directory-load-state is-error" role="alert">{text}</div>; }
function SourceFilter({ value, onChange, noun }) { return <select value={value} onChange={(event) => onChange(event.target.value)} aria-label={`${noun} nach Datenquelle filtern`}><option value="all">Alle CRM-Daten</option><option value="local">Lokal angelegt</option><option value="imported">Importiert</option></select>; }
function DirectoryPagination({ page, pages, total, onPage }) { return <nav className="directory-pagination" aria-label="Seitennavigation"><button disabled={page <= 1} onClick={() => onPage(page - 1)}><ArrowLeft aria-hidden="true" /> Zurück</button><span>Seite {formatCount(page)} von {formatCount(pages)} · {formatCount(total)} importiert</span><button disabled={page >= pages} onClick={() => onPage(page + 1)}>Weiter <ArrowRight aria-hidden="true" /></button></nav>; }
function useImportedRecords(type, query, page, enabled) {
  const [state, setState] = useState({ rows: [], total: 0, page: 1, pages: 1, loading: enabled, error: "" });
  useEffect(() => {
    if (!enabled) { setState({ rows: [], total: 0, page: 1, pages: 1, loading: false, error: "" }); return undefined; }
    let active = true;
    setState((current) => ({ ...current, loading: true, error: "" }));
    const timer = window.setTimeout(() => {
      importedCrmRecordsApi[type]({ search: query, page, pageSize: 40 })
        .then((result) => active && setState({ ...result, loading: false, error: "" }))
        .catch((error) => active && setState({ rows: [], total: 0, page, pages: 1, loading: false, error: error.message }));
    }, 180);
    return () => { active = false; window.clearTimeout(timer); };
  }, [enabled, page, query, type]);
  return state;
}
function initials(value) { return String(value || "?").split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase(); }
function importedContactName(contact) { return contact.source_full_name || [contact.first_name, contact.last_name].filter(Boolean).join(" ") || "Kontakt ohne Namen"; }
function locationLabel(organization) { return [organization.postalCode, organization.city, organization.state].filter(Boolean).join(" ") || "Standort nicht angegeben"; }
function formatCount(value) { return new Intl.NumberFormat("de-DE").format(Number(value || 0)); }
function formatDate(value) { return value ? new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "short" }).format(new Date(`${value}T12:00:00`)) : "–"; }
function relationshipLabel(value) { return ({ decision_maker: "Entscheidung", champion: "Sponsor/Champion", budget_contact: "Budgetkontakt", specialist: "Fachkontakt", first_contact: "Erstkontakt" })[value] || "Kontakt"; }
function partnerStatus(value) { return ({ prospect: "Prüfen", qualified: "Qualifiziert", active: "Aktiv", paused: "Pausiert" })[value] || value; }
function leadStatus(value) { return ({ new: "Neu", reviewing: "In Prüfung", qualified: "Qualifiziert", converted: "Konvertiert", disqualified: "Nicht qualifiziert" })[value] || value; }
