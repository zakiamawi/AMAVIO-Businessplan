import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Database,
  FileSearch,
  Link2,
  LockKeyhole,
  Search,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { AccessibleDialog } from "./AccessibleDialog";
import { realDataStagingApi } from "../services/realDataStaging";

const number = new Intl.NumberFormat("de-DE");

const tabs = [
  ["overview", "Altdaten-Pool"],
  ["verified", "Bestätigt aktuell"],
  ["organizations", "Organisationen"],
  ["contacts", "Ansprechpartner"],
  ["queue", "Prüfqueue / Quarantäne"],
  ["sources", "Quellen / Sperren"],
];

const reviewLabels = {
  confirmed_current: "Bestätigt – aktuell",
  official_dated: "Offizieller datierter Stand",
  historical_open: "Historisch – Aktualität offen",
  changed_legacy: "Geändert / alter Datensatz",
  ambiguous: "Nicht eindeutig bestätigt",
  general_review: "Allgemeine Prüfung",
};

const emptyFilters = { search: "", segment: "all", status: "all", quality: "all", suppression: "blocked", region: "", source: "" };

export function LegacyStagingWorkspace() {
  const [tab, setTab] = useState("overview");
  const [summary, setSummary] = useState(null);
  const [sources, setSources] = useState(null);
  const [result, setResult] = useState({ rows: [], total: 0, page: 1, pageSize: 40, pages: 1 });
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [queueMode, setQueueMode] = useState("review");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selection, setSelection] = useState(null);
  const [detail, setDetail] = useState(null);
  const closeSelection = useCallback(() => setSelection(null), []);

  useEffect(() => {
    let active = true;
    Promise.all([realDataStagingApi.summary(), realDataStagingApi.sources()])
      .then(([summaryData, sourceData]) => {
        if (!active) return;
        setSummary(summaryData);
        setSources(sourceData);
        setError("");
      })
      .catch((loadError) => active && setError(loadError.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (["overview", "sources"].includes(tab)) return undefined;
    let active = true;
    setLoading(true);
    const parameters = { ...filters, page, pageSize: 40 };
    let request;
    if (tab === "verified") request = realDataStagingApi.contacts({ ...parameters, dataset: "verified" });
    if (tab === "organizations") request = realDataStagingApi.organizations({ ...parameters, dataset: "pool" });
    if (tab === "contacts") request = realDataStagingApi.contacts({ ...parameters, dataset: "pool" });
    if (tab === "queue") request = queueMode === "review" ? realDataStagingApi.reviewQueue(parameters) : realDataStagingApi.quarantine(parameters);
    request?.then((payload) => {
      if (!active) return;
      setResult(payload);
      setError("");
    }).catch((loadError) => active && setError(loadError.message)).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [filters, page, queueMode, tab]);

  useEffect(() => {
    if (!selection) {
      setDetail(null);
      return undefined;
    }
    let active = true;
    realDataStagingApi.detail(selection.type, selection.id)
      .then((payload) => active && setDetail(payload))
      .catch((loadError) => active && setError(loadError.message));
    return () => { active = false; };
  }, [selection]);

  function changeTab(nextTab) {
    setTab(nextTab);
    setFilters(emptyFilters);
    setPage(1);
    setQueueMode("review");
  }

  function changeFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
    setPage(1);
  }

  if (loading && !summary) return <StagingLoading />;
  if (!summary) return <StagingUnavailable error={error} />;

  return (
    <section className="staging-workspace" aria-label="Lokales Echtdaten-Staging">
      <header className="staging-hero">
        <div>
          <p>AMAVIO One · Lokaler Arbeitsbereich</p>
          <h1>Altdaten-Pool</h1>
          <span>Bereinigte Organisations- und Kontaktdaten mit Herkunft, Prüfstatus und wirksamer Kontaktsperre.</span>
        </div>
        <div className="staging-boundary" role="status">
          <LockKeyhole aria-hidden="true" />
          <span><strong>Lokales Echtdaten-Staging</strong><small>Keine Kontaktfreigabe · kein Versand · keine Cloud-Synchronisierung</small></span>
        </div>
      </header>

      <nav className="staging-tabs" aria-label="Altdaten-Staging Bereiche">
        {tabs.map(([id, label]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => changeTab(id)} aria-current={tab === id ? "page" : undefined}>{label}</button>)}
      </nav>

      {error ? <div className="staging-error" role="alert"><AlertTriangle aria-hidden="true" /> {error}</div> : null}
      {tab === "overview" ? <StagingOverview summary={summary} onNavigate={changeTab} /> : null}
      {tab === "sources" ? <SourcesAndSuppressions summary={summary} data={sources} /> : null}
      {!["overview", "sources"].includes(tab) ? <>
        <StagingFilters tab={tab} queueMode={queueMode} setQueueMode={(value) => { setQueueMode(value); setPage(1); }} filters={filters} onChange={changeFilter} total={result.total} summary={summary} />
        <StagingTable tab={tab} queueMode={queueMode} rows={result.rows} loading={loading} onOpen={setSelection} />
        <Pagination result={result} onPage={setPage} />
      </> : null}

      <StagingDetailDialog detail={detail} open={Boolean(selection)} onClose={closeSelection} />
    </section>
  );
}

function StagingOverview({ summary, onNavigate }) {
  const poolTotal = summary.counts.poolOrganizations + summary.counts.poolContacts;
  const current = summary.reviewBuckets.find((item) => item.label === "confirmed_current")?.count || 0;
  const legacy = summary.counts.reviewQueue - current;
  const maxSegment = Math.max(...summary.segments.map((item) => item.count), 1);
  return <div className="staging-overview">
    <section className="staging-metric-band" aria-label="Bestandskennzahlen">
      <Metric value={summary.counts.poolOrganizations} label="Organisationen" detail="vollständiger bereinigter Pool" icon={Building2} />
      <Metric value={summary.counts.poolContacts} label="Kontaktkandidaten" detail="mit Quelle und Prüfstatus" icon={UsersRound} />
      <Metric value={summary.counts.verifiedContacts} label="bestätigte Kontakte" detail={`${summary.counts.verifiedRelationships} Beziehungen`} icon={CheckCircle2} />
      <Metric value={summary.counts.quarantineItems} label="Quarantänehinweise" detail={`${summary.counts.duplicateSignals} Dublettensignale`} icon={FileSearch} />
    </section>

    <div className="staging-analysis-grid">
      <section className="staging-analysis-panel">
        <header><div><p>Bestandsmix</p><h2>Segmente im Organisationspool</h2></div><strong>{number.format(summary.counts.poolOrganizations)}</strong></header>
        <div className="segment-bars">{summary.segments.map((item) => <div key={item.label}><span><b>{item.label}</b><small>{number.format(item.count)}</small></span><i><em style={{ width: `${Math.max(2, item.count / maxSegment * 100)}%` }} /></i></div>)}</div>
        <button className="text-action" onClick={() => onNavigate("organizations")}>Organisationen prüfen <ArrowRight aria-hidden="true" /></button>
      </section>
      <section className="staging-analysis-panel review-panel">
        <header><div><p>407er-Prüfstruktur</p><h2>Aktualität bleibt differenziert</h2></div><strong>{number.format(summary.counts.reviewQueue)}</strong></header>
        <div className="review-flow">{summary.reviewBuckets.map((item) => <button key={item.label} onClick={() => onNavigate("queue")}><i className={`review-${item.label}`} /><span><b>{number.format(item.count)}</b><small>{reviewLabels[item.label] || item.label}</small></span></button>)}</div>
        <div className="review-split"><span><strong>{number.format(current)}</strong> aktuell bestätigt</span><span><strong>{number.format(legacy)}</strong> Review / Legacy</span></div>
      </section>
    </div>

    <section className="staging-confirmed-band">
      <div><p>Qualifizierter Teilbestand</p><h2>{number.format(summary.counts.verifiedOrganizations)} Organisationen · {number.format(summary.counts.verifiedContacts)} Kontakte · {number.format(summary.counts.verifiedRelationships)} Zuordnungen</h2><span>31 Mehrfachgruppen bleiben als Beziehungen erhalten. Keine Person wurde für mehrere Organisationen dupliziert.</span></div>
      <button className="secondary-action" onClick={() => onNavigate("verified")}>Bestätigten Bestand öffnen <ArrowRight aria-hidden="true" /></button>
    </section>

    <section className="staging-safety-ledger">
      <div><ShieldCheck aria-hidden="true" /><span><strong>{number.format(summary.counts.suppressionEntries)} aktive Sperreinträge</strong><small>Jeder reale Kontakt bleibt `do_not_contact`; strengere historische Signale bleiben erhalten.</small></span></div>
      <div><Database aria-hidden="true" /><span><strong>Getrennte lokale Datenbank</strong><small>Synthetischer CRM-Core und Echtdaten-Staging bleiben technisch getrennt.</small></span></div>
      <div><Link2 aria-hidden="true" /><span><strong>Idempotente externe Referenzen</strong><small>Der zweite Importlauf erzeugte keine neuen Datensätze.</small></span></div>
    </section>
    <p className="staging-footnote">Poolumfang: {number.format(poolTotal)} lokale Datensätze. Die Anzeige ist Arbeits- und Prüfgrundlage, keine Produktiv-, Rechts- oder Kontaktfreigabe.</p>
  </div>;
}

function Metric({ value, label, detail, icon: Icon }) {
  return <div className="staging-metric"><Icon aria-hidden="true" /><span><strong>{number.format(value)}</strong><b>{label}</b><small>{detail}</small></span></div>;
}

function StagingFilters({ tab, queueMode, setQueueMode, filters, onChange, total, summary }) {
  const statusOptions = tab === "queue" ? Object.keys(reviewLabels) : ["confirmed_current", "official_dated", "historical_open", "changed_legacy", "ambiguous", "general_review"];
  return <section className="staging-controls" aria-label="Staging filtern">
    <div className="staging-control-head">
      <div><p>{tab === "verified" ? "Bestätigte aktuelle Kontakte" : tab === "organizations" ? "Bereinigte Organisationen" : tab === "contacts" ? "Kontaktkandidaten" : "Prüf- und Quarantänebestand"}</p><strong>{number.format(total)} Treffer</strong></div>
      {tab === "queue" ? <div className="queue-toggle" aria-label="Prüfansicht wählen"><button className={queueMode === "review" ? "active" : ""} onClick={() => setQueueMode("review")}>407er-Prüfqueue</button><button className={queueMode === "quarantine" ? "active" : ""} onClick={() => setQueueMode("quarantine")}>Quarantäne ({summary.counts.quarantineItems})</button></div> : null}
    </div>
    <div className="staging-filter-grid">
      <label className="staging-search"><Search aria-hidden="true" /><input value={filters.search} onChange={(event) => onChange("search", event.target.value)} placeholder="Name, Organisation, Rolle oder Kontaktkanal" aria-label="Staging durchsuchen" /></label>
      {queueMode !== "quarantine" ? <>
        <label><span>Segment</span><select value={filters.segment} onChange={(event) => onChange("segment", event.target.value)}><option value="all">Alle Segmente</option><option value="Klinik">Klinik</option><option value="Pflegeeinrichtung">Pflegeeinrichtung</option><option value="IT-Unternehmen">IT-Unternehmen</option></select></label>
        {tab !== "organizations" ? <label><span>Prüfstatus</span><select value={filters.status} onChange={(event) => onChange("status", event.target.value)}><option value="all">Alle Prüfstatus</option>{statusOptions.map((status) => <option key={status} value={status}>{reviewLabels[status] || status}</option>)}</select></label> : null}
        <label><span>Datenqualität</span><select value={filters.quality} onChange={(event) => onChange("quality", event.target.value)}><option value="all">Alle Qualitätsstände</option>{tab === "organizations" ? <><option value="reviewed">Reviewed</option><option value="unverified">Unverifiziert</option></> : <><option value="name_review">Namensprüfung</option><option value="clean">Ohne Namenshinweis</option></>}</select></label>
        <label><span>Sperrstatus</span><select value={filters.suppression} onChange={(event) => onChange("suppression", event.target.value)}><option value="blocked">Kontakt gesperrt</option><option value="all">Alle</option></select></label>
        <label><span>Organisation / Region</span><input value={filters.region} onChange={(event) => onChange("region", event.target.value)} placeholder="Ort, Bundesland oder Organisation" /></label>
        <label><span>Quelle</span><input value={filters.source} onChange={(event) => onChange("source", event.target.value)} placeholder="Datei oder Blatt" /></label>
      </> : null}
    </div>
  </section>;
}

function StagingTable({ tab, queueMode, rows, loading, onOpen }) {
  if (loading) return <div className="staging-table-state" role="status">Lokalen Bestand laden …</div>;
  if (!rows.length) return <div className="staging-table-state"><strong>Keine Treffer</strong><span>Filter anpassen. Der Datenbestand wurde nicht verändert.</span></div>;
  if (tab === "organizations") return <Table headers={["Organisation", "Segment", "Ort / Region", "Datenqualität", "Kontakte", "Quelle"]}>{rows.map((row) => <TableRow key={row.id} onClick={() => onOpen({ type: "pool-organization", id: row.id })} cells={[<Primary key="a" title={row.name} subtitle={row.external_id} />, row.segment, [row.city, row.state].filter(Boolean).join(" · ") || "–", <Status key="q" value={row.quality_status} />, number.format(row.contact_candidates), row.source_reference || "–"]} />)}</Table>;
  if (tab === "contacts") return <Table headers={["Kontakt", "Organisation", "Rolle", "Prüfstatus", "Kontaktstatus", "Quelle"]}>{rows.map((row) => <TableRow key={row.id} onClick={() => onOpen({ type: "pool-contact", id: row.id })} cells={[<Primary key="a" title={row.source_full_name || [row.first_name, row.last_name].filter(Boolean).join(" ") || "Nicht benannt"} subtitle={row.email || row.phone || "Kein bestätigter Kontaktkanal"} />, row.organization_name || "Nicht zugeordnet", row.original_role || row.target_role || "–", <Status key="s" value={row.review_bucket} />, <Status key="c" value="do_not_contact" />, row.source_reference || "–"]} />)}</Table>;
  if (tab === "verified") return <Table headers={["Bestätigter Kontakt", "Organisationen", "Rolle", "Verifiziert", "Qualität", "Sperre"]}>{rows.map((row) => <TableRow key={row.id} onClick={() => onOpen({ type: "contact", id: row.id })} cells={[<Primary key="a" title={row.source_full_name || [row.first_name, row.last_name].filter(Boolean).join(" ")} subtitle={row.email || row.phone || "Kein Kontaktkanal"} />, <span key="orgs" className="clamp-cell">{row.organizationNames || "Zuordnung offen"}</span>, row.role || "–", row.verified_at || "–", row.name_review_required ? <Status key="q" value="name_review" /> : <Status key="q" value="confirmed_current" />, <Status key="l" value="do_not_contact" />]} />)}</Table>;
  if (tab === "queue" && queueMode === "quarantine") return <Table headers={["Objekt", "Bezeichnung", "Prüfgrund", "Nächste Entscheidung", "Status"]}>{rows.map((row) => <TableRow key={row.id} onClick={() => onOpen({ type: "quarantine", id: row.id })} cells={[row.object_type, <Primary key="a" title={row.label || "Ohne Bezeichnung"} subtitle={row.source_id} />, row.review_reason, row.next_decision, <Status key="s" value={row.status} />]} />)}</Table>;
  return <Table headers={["Prüfstatus", "Organisation", "Kontakt", "Rolle", "Verifiziert", "Sperre"]}>{rows.map((row) => <TableRow key={row.id} onClick={() => onOpen({ type: "review", id: row.id })} cells={[<Status key="s" value={row.bucket} />, row.organization_name || "–", <Primary key="a" title={row.contact_name || "Nicht benannt"} subtitle={row.email || row.phone || "Kein bestätigter Kontaktkanal"} />, row.role || row.target_role || "–", row.verified_at || "–", <Status key="l" value="do_not_contact" />]} />)}</Table>;
}

function Table({ headers, children }) {
  return <div className="staging-table-wrap"><table className="staging-table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}

function TableRow({ cells, onClick }) {
  return <tr tabIndex="0" onClick={onClick} onKeyDown={(event) => { if (["Enter", " "].includes(event.key)) { event.preventDefault(); onClick(); } }}>{cells.map((cell, index) => <td key={index}>{cell || "–"}</td>)}</tr>;
}

function Primary({ title, subtitle }) { return <span className="staging-primary"><strong>{title}</strong><small>{subtitle}</small></span>; }

function Status({ value }) {
  const normalized = String(value || "unknown").toLowerCase().replace(/[^a-z0-9äöüß]+/g, "-");
  const label = reviewLabels[value] || ({ do_not_contact: "Nicht kontaktieren", name_review: "Namensprüfung", reviewed: "Reviewed", unverified: "Unverifiziert", blocked: "Gesperrt", unknown: "Ungeklärt" })[value] || value || "Ungeklärt";
  return <span className={`staging-status status-${normalized}`}>{label}</span>;
}

function Pagination({ result, onPage }) {
  if (result.pages <= 1) return null;
  return <nav className="staging-pagination" aria-label="Seitennavigation"><button disabled={result.page <= 1} onClick={() => onPage(result.page - 1)}><ArrowLeft aria-hidden="true" /> Zurück</button><span>Seite {number.format(result.page)} von {number.format(result.pages)}</span><button disabled={result.page >= result.pages} onClick={() => onPage(result.page + 1)}>Weiter <ArrowRight aria-hidden="true" /></button></nav>;
}

function SourcesAndSuppressions({ summary, data }) {
  return <div className="staging-sources">
    <section><header><p>Quellenregister</p><h2>Sieben einzeln bewertete Arbeitsblätter</h2></header><div className="source-ledger">{data?.sources?.map((source) => <article key={source.id}><div><strong>{source.source_file}</strong><span>{source.source_sheet_name} · {number.format(source.data_rows)} Zeilen</span></div><p>{source.amavio_usage}</p><small>{source.risk_boundary}</small><b>{source.decision}</b></article>)}</div></section>
    <section><header><p>Kontaktsperren</p><h2>Historische Negativsignale bleiben wirksam</h2></header><div className="suppression-summary"><strong>{number.format(summary.counts.suppressionEntries)}</strong><span>aktive Staging-Sperren</span><small>Zusätzlich {number.format(summary.counts.legacySuppressions)} dokumentierte historische Sperr- und Einzelprüfzeilen.</small></div><div className="suppression-ledger">{data?.suppressions?.map((item, index) => <div key={`${item.status}-${index}`}><Status value={item.status} /><span>{item.reason}</span><b>{number.format(item.count)}</b></div>)}</div></section>
    <section className="duplicate-ledger"><header><p>Dublettenkontrolle</p><h2>Keine stille Zusammenführung</h2></header>{data?.duplicateSignals?.map((item) => <article key={item.id}><span><strong>{item.signalType}</strong><small>{item.sourceIds}</small></span><p>{item.decisionRule}</p></article>)}</section>
  </div>;
}

function StagingDetailDialog({ detail, open, onClose }) {
  const title = detailTitle(detail);
  return <AccessibleDialog open={open} onClose={onClose} title={title} description="Lokales Echtdaten-Staging · keine Kontaktfreigabe" size="wide">
    {!detail ? <div className="staging-detail-loading">Details laden …</div> : <StagingDetail detail={detail} />}
  </AccessibleDialog>;
}

function StagingDetail({ detail }) {
  const record = detail.record || {};
  if (["pool-organization", "organization"].includes(detail.type)) return <div className="staging-detail">
    <FactGrid items={[
      ["Externe ID", record.external_id], ["Segment", record.segment], ["Marktpriorität", record.market_priority], ["Datenqualität", record.quality_status],
      ["Website", record.current_url || record.website], ["Zentrale E-Mail", record.central_email], ["Zentrale Telefon", record.central_phone], ["Outreach", "Nicht freigegeben"],
    ]} />
    <DetailSection title="Geschäftsadresse"><p>{[record.street, [record.postalCode, record.city].filter(Boolean).join(" "), record.state, record.country].filter(Boolean).join(" · ") || "Adresse nicht vollständig dokumentiert"}</p>{record.addressQuality === "review_required" ? <Status value="address_review_required" /> : null}</DetailSection>
    <DetailSection title={`Verknüpfte Kontakte (${detail.contacts?.length || 0})`}>{detail.contacts?.length ? <div className="detail-related-list">{detail.contacts.map((contact) => <div key={contact.id}><strong>{contact.name}</strong><span>{contact.role || contact.status || "–"}</span></div>)}</div> : <p>Keine Kontakte in dieser Ansicht.</p>}</DetailSection>
    <Provenance records={detail.provenance} record={record} />
  </div>;
  if (["pool-contact", "contact"].includes(detail.type)) return <div className="staging-detail">
    <div className="contact-lock"><LockKeyhole aria-hidden="true" /><span><strong>Nicht kontaktieren</strong><small><code>consentStatus = {record.consent_status}</code> · <code>outreachEligibility = blocked</code></small></span></div>
    <FactGrid items={[
      ["Externe ID", record.external_id], ["Organisation", record.resolvedOrganizationName || record.organization_name], ["Rolle", record.role || record.original_role], ["Zielrolle", record.target_role],
      ["E-Mail", record.email], ["Telefon", record.phone], ["LinkedIn", record.linkedin_url], ["Verifiziert am", record.verified_at],
      ["Namensstatus", record.name_status], ["Prüfstatus", record.verification_status], ["Kontaktstatus", record.contact_status], ["Consent", record.consent_status],
    ]} />
    {detail.relationships?.length ? <DetailSection title={`Organisationen (${detail.relationships.length})`}><div className="detail-related-list">{detail.relationships.map((relationship) => <div key={relationship.id}><strong>{relationship.organizationName}</strong><span>{[relationship.city, relationship.state, relationship.relationship_type].filter(Boolean).join(" · ")}</span></div>)}</div></DetailSection> : null}
    <DetailSection title="Beleg und Prüfhinweis"><p>{record.evidence_url || record.evidence_urls || "Keine Beleg-URL im Teilbestand"}</p><small>{record.review_reason || "Keine Außenkontaktfreigabe."}</small></DetailSection>
    <Provenance records={detail.provenance} record={record} />
  </div>;
  return <div className="staging-detail">
    <FactGrid items={Object.entries(record).filter(([, value]) => value !== null && value !== "").slice(0, 16).map(([key, value]) => [humanize(key), typeof value === "number" ? number.format(value) : value])} />
    <div className="contact-lock"><LockKeyhole aria-hidden="true" /><span><strong>Keine Außenkontaktfreigabe</strong><small>Dieser Prüfdatensatz bleibt ausschließlich im lokalen Staging.</small></span></div>
  </div>;
}

function Provenance({ records = [], record }) {
  return <DetailSection title="Herkunft und Provenienz"><div className="provenance-list">{records.length ? records.map((item) => <div key={item.id}><strong>{item.source_file}</strong><span>{item.source_sheet} · Zeile {number.format(item.source_row)}</span><small>SHA-256: {item.source_hash}</small></div>) : <div><strong>Lokale Stagingquelle</strong><span>{record.source_sheet} · Zeile {number.format(record.source_row || 0)}</span></div>}</div></DetailSection>;
}

function FactGrid({ items }) { return <dl className="staging-facts">{items.filter(([, value]) => value !== undefined && value !== null && value !== "").map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{String(value)}</dd></div>)}</dl>; }
function DetailSection({ title, children }) { return <section className="staging-detail-section"><h3>{title}</h3>{children}</section>; }
function detailTitle(detail) { if (!detail) return "Staging-Detail"; const record = detail.record || {}; return record.display_name || record.name || record.source_full_name || record.contact_name || record.label || record.organization_name || "Staging-Detail"; }
function humanize(value) { return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function StagingLoading() { return <section className="staging-workspace"><div className="staging-table-state" role="status">Lokales Echtdaten-Staging wird geladen …</div></section>; }
function StagingUnavailable({ error }) { return <section className="staging-workspace"><header className="staging-hero"><div><p>AMAVIO One · Lokaler Arbeitsbereich</p><h1>Altdaten-Pool</h1></div></header><div className="staging-error" role="alert"><AlertTriangle aria-hidden="true" /> {error || "Staging-Datenbank nicht erreichbar."}</div></section>; }
