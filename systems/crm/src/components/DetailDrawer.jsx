import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Archive, ArrowRight, Building2, CalendarDays, CheckCircle2, ContactRound, History, LockKeyhole, Pencil, RotateCcw, Route, ShieldCheck, UserPlus, UserRound, X } from "lucide-react";
import { contactName, contactRestriction, nextAllowedStages, organizationName, ownerById, stageById, validateStageEntry } from "../domain/crmDomain";

const money = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const focusableSelector = "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex='-1'])";

export function DetailDrawer({ selection, data, onClose, onEdit, onArchive, onRestore, onCreateTask, onCreateActivity, onCreateRelated, onTransition, onSetTaskStatus, onConvertLead, onSetHandoffApproval, onCreatePartnerContact, onOpenRelated }) {
  const drawerRef = useRef(null);
  const returnFocusRef = useRef(null);
  const [targetStage, setTargetStage] = useState("");
  const [lossReason, setLossReason] = useState("");
  const entity = selection ? data[selection.type]?.find((item) => item.id === selection.id) : null;

  useEffect(() => {
    if (!entity) return undefined;
    returnFocusRef.current = document.activeElement;
    setTargetStage(entity.stageId || "");
    setLossReason(entity.lossReason || "");
    requestAnimationFrame(() => drawerRef.current?.focus());
    function handleKey(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = [...drawerRef.current.querySelectorAll(focusableSelector)];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("keydown", handleKey); requestAnimationFrame(() => returnFocusRef.current?.focus?.()); };
  }, [entity, onClose]);

  const related = useMemo(() => entity ? buildRelated(selection.type, entity, data) : {}, [data, entity, selection?.type]);
  if (!selection || !entity) return null;

  const title = entityTitle(selection.type, entity, data);
  const typeLabel = ({ organizations: "Organisation", contacts: "Kontakt", leads: "Lead", opportunities: "Chance", tasks: "Aufgabe", partnerOrganizations: "Partner", partnerContacts: "Partnerkontakt", notes: "Notiz", conversations: "Gespräch", appointments: "Termin", followUps: "Wiedervorlage", offers: "Angebot", decisions: "Entscheidung" })[selection.type];
  const operationalTypes = ["notes", "conversations", "appointments", "followUps", "offers", "decisions"];
  const editable = ["organizations", "contacts", "leads", "opportunities", "tasks", "partnerOrganizations", "partnerContacts", ...operationalTypes].includes(selection.type);

  return (
    <div className="drawer-layer open" aria-hidden="false">
      <button className="drawer-scrim" onClick={onClose} aria-label="Detailansicht schließen" />
      <aside ref={drawerRef} className="detail-drawer canonical-drawer" role="dialog" aria-modal="true" aria-label={`${typeLabel}: ${title}`} tabIndex={-1}>
        <div className="drawer-head">
          <div><span>{typeLabel} · synthetisch</span><h2>{title}</h2><p>{entitySubtitle(selection.type, entity, data)}</p></div>
          <button className="icon-button" onClick={onClose} aria-label="Detailansicht schließen"><X aria-hidden="true" /></button>
        </div>

        <div className="drawer-actionbar">
          {editable && !entity.archivedAt ? <button onClick={() => onEdit(selection.type, entity)}><Pencil aria-hidden="true" /> Bearbeiten</button> : null}
          {!entity.archivedAt && editable ? <button onClick={() => onArchive(selection.type, entity)}><Archive aria-hidden="true" /> Archivieren</button> : null}
          {entity.archivedAt ? <button onClick={() => onRestore(selection.type, entity)}><RotateCcw aria-hidden="true" /> Wiederherstellen</button> : null}
        </div>

        {entity.archivedAt ? <div className="archived-banner"><Archive aria-hidden="true" /><span><strong>Archiviert</strong><small>{entity.archiveReason || "Lokal archiviert"}</small></span></div> : null}
        {selection.type === "organizations" ? <OrganizationDetail entity={entity} data={data} related={related} onOpenRelated={onOpenRelated} /> : null}
        {selection.type === "contacts" ? <ContactDetail entity={entity} data={data} related={related} onOpenRelated={onOpenRelated} /> : null}
        {selection.type === "leads" ? <LeadDetail entity={entity} data={data} onConvertLead={onConvertLead} onOpenRelated={onOpenRelated} /> : null}
        {selection.type === "opportunities" ? <OpportunityDetail entity={entity} data={data} related={related} targetStage={targetStage} setTargetStage={setTargetStage} lossReason={lossReason} setLossReason={setLossReason} onTransition={onTransition} onCreateTask={onCreateTask} onCreateActivity={onCreateActivity} onCreateRelated={onCreateRelated} onSetHandoffApproval={onSetHandoffApproval} onOpenRelated={onOpenRelated} /> : null}
        {selection.type === "tasks" ? <TaskDetail entity={entity} data={data} onSetTaskStatus={onSetTaskStatus} onOpenRelated={onOpenRelated} /> : null}
        {selection.type === "partnerOrganizations" ? <PartnerDetail entity={entity} data={data} onCreatePartnerContact={onCreatePartnerContact} onOpenRelated={onOpenRelated} /> : null}
        {selection.type === "partnerContacts" ? <PartnerContactDetail entity={entity} data={data} onOpenRelated={onOpenRelated} /> : null}
        {operationalTypes.includes(selection.type) ? <OperationalDetail type={selection.type} entity={entity} data={data} onOpenRelated={onOpenRelated} /> : null}

        <AuditTrail events={data.auditEvents.filter((event) => event.entityType === selection.type && event.entityId === entity.id)} />

        <div className="drawer-foot">Lokal gespeichert · Schema v{data.meta.schemaVersion} · keine externe Wirkung</div>
      </aside>
    </div>
  );
}

function OrganizationDetail({ entity, data, related, onOpenRelated }) {
  return <>
    <Facts items={[["Segment", entity.sector], ["Region", entity.region], ["Status", entity.status === "on_hold" ? "Pausiert" : "Aktiv"], ["Verantwortlich", ownerById[entity.ownerId]?.name]]} />
    <DetailSection title="Beziehungskontext"><p>{entity.notes || "Noch keine interne Notiz."}</p></DetailSection>
    <RelatedList title={`Kontakte (${related.contacts.length})`} items={related.contacts.map((item) => ({ id: item.id, type: "contacts", title: contactName(item), subtitle: item.role }))} onOpen={onOpenRelated} empty="Noch keine Kontakte verbunden." />
    <RelatedList title={`Chancen (${related.opportunities.length})`} items={related.opportunities.map((item) => ({ id: item.id, type: "opportunities", title: item.title, subtitle: stageById[item.stageId]?.label }))} onOpen={onOpenRelated} empty="Noch keine Chancen verbunden." />
  </>;
}

function ContactDetail({ entity, data, related, onOpenRelated }) {
  const organization = data.organizations.find((item) => item.id === entity.organizationId);
  const restriction = contactRestriction(entity);
  return <>
    <Facts items={[["Organisation", organization?.displayName], ["Funktion", entity.role || "–"], ["E-Mail", entity.email || "–"], ["Telefon", entity.phone || "–"], ["Kontaktstatus", entity.contactStatus === "do_not_contact" ? "Nicht kontaktieren" : "Aktiv"], ["Einwilligung", entity.consentStatus === "unknown" ? "Ungeklärt" : entity.consentStatus]]} />
    {restriction.blocked ? <div className="contract-alert danger" role="status"><LockKeyhole aria-hidden="true" /><span><strong>Außenkontakt gesperrt</strong><small>{restriction.reason}</small></span></div> : <div className="contract-alert" role="status"><ShieldCheck aria-hidden="true" /><span><strong>Status fachlich getrennt</strong><small>Es gibt weiterhin keine externe Kontaktaktion und keine abgeleitete Rechtsgrundlage.</small></span></div>}
    {organization ? <button className="related-primary" onClick={() => onOpenRelated("organizations", organization.id)}><Building2 aria-hidden="true" /> Organisation öffnen <ArrowRight aria-hidden="true" /></button> : null}
    <RelatedList title={`Beteiligte Chancen (${related.opportunities.length})`} items={related.opportunities.map((item) => ({ id: item.id, type: "opportunities", title: item.title, subtitle: stageById[item.stageId]?.label }))} onOpen={onOpenRelated} empty="Noch keiner Chance zugeordnet." />
  </>;
}

function LeadDetail({ entity, data, onConvertLead, onOpenRelated }) {
  const organization = data.organizations.find((item) => item.id === entity.organizationId);
  const opportunity = data.opportunities.find((item) => item.id === entity.convertedOpportunityId);
  const conversionMissing = [
    !organization ? "aktive Organisation" : "",
    !String(entity.needSummary || "").trim() ? "dokumentierter Bedarf" : "",
    !entity.ownerId ? "Verantwortlicher" : "",
    !String(entity.nextAction || "").trim() ? "nächste Handlung" : "",
    !entity.nextActionDue ? "Fälligkeit" : "",
  ].filter(Boolean);
  return <>
    <Facts items={[["Status", leadStatus(entity.status)], ["Organisation", organization?.displayName || entity.organizationHint], ["Quelle", entity.sourceLabel], ["Verantwortlich", ownerById[entity.ownerId]?.name], ["Nächste Handlung", entity.nextAction], ["Fällig", formatDate(entity.nextActionDue)]]} />
    <DetailSection title="Qualifizierungsnachweis"><p>{entity.needSummary || "Bedarf noch nicht dokumentiert."}</p><small>{entity.contactOpenQuestion || "Keine offene Kontaktfrage dokumentiert."}</small></DetailSection>
    {entity.status === "qualified" && !opportunity ? <div className={`conversion-box ${conversionMissing.length ? "blocked" : "ready"}`}><Route aria-hidden="true" /><span><strong>{conversionMissing.length ? "Umwandlung noch nicht möglich" : "Bereit für lokale Umwandlung"}</strong><small>{conversionMissing.length ? `Es fehlen: ${conversionMissing.join(", ")}.` : "Die Chance wird in der Phase Erstkontakt angelegt und bleibt vollständig synthetisch."}</small></span><button disabled={Boolean(conversionMissing.length)} onClick={() => onConvertLead(entity.id)}>In Chance umwandeln</button></div> : null}
    {entity.status === "converted" && opportunity ? <button className="related-primary" onClick={() => onOpenRelated("opportunities", opportunity.id)}><CheckCircle2 aria-hidden="true" /> Konvertierte Chance öffnen <ArrowRight aria-hidden="true" /></button> : null}
    <div className="boundary-note compact"><strong>Lead-Grenze</strong><p>Keine automatische Kommunikation, kein Import und keine externe Anreicherung.</p></div>
  </>;
}

function OpportunityDetail({ entity, data, related, targetStage, setTargetStage, lossReason, setLossReason, onTransition, onCreateTask, onCreateActivity, onCreateRelated, onSetHandoffApproval, onOpenRelated }) {
  const organization = data.organizations.find((item) => item.id === entity.organizationId);
  const contact = data.contacts.find((item) => item.id === entity.primaryContactId);
  const allowedStages = nextAllowedStages(entity.stageId);
  const stageCandidate = { ...entity, lossReason: targetStage === "lost" ? lossReason : entity.lossReason };
  const missing = targetStage ? validateStageEntry(stageCandidate, targetStage, data) : [];
  const handoff = data.handoffReferences.find((item) => item.opportunityId === entity.id);
  return <>
    <div className="drawer-status-row canonical-status-row"><label>Phase<select aria-label="Phase" value={targetStage} onChange={(event) => setTargetStage(event.target.value)}>{allowedStages.map((stage) => <option key={stage.id} value={stage.id}>{stage.label}</option>)}</select></label><label>Verantwortlich<input aria-label="Verantwortlich" value={ownerById[entity.ownerId]?.name || ""} disabled /></label></div>
    {targetStage === "lost" ? <label className="field-label loss-reason">Verlustgrund *<input value={lossReason} onChange={(event) => setLossReason(event.target.value)} placeholder="Sachlichen Grund dokumentieren" /></label> : null}
    {targetStage !== entity.stageId ? <div className={`stage-readiness ${missing.length ? "blocked" : "ready"}`} role="status">{missing.length ? <><AlertTriangle aria-hidden="true" /><span><strong>Phaseneintritt noch nicht möglich</strong><small>Es fehlen: {missing.map((item) => item.label).join(", ")}.</small></span></> : <><CheckCircle2 aria-hidden="true" /><span><strong>Phasenkriterien erfüllt</strong><small>Der lokale Phasenwechsel kann nachvollziehbar gespeichert werden.</small></span></>}<button className="primary-action inline-primary" disabled={Boolean(missing.length)} onClick={() => onTransition(entity.id, targetStage, lossReason)}>Phasenwechsel speichern</button></div> : null}
    <Facts items={[["Organisation", organization?.displayName], ["Potenzial", money.format(entity.potential || 0)], ["Priorität", priorityLabel(entity.priority)], ["Fällig", formatDate(entity.nextActionDue)], ["Quelle", entity.sourceLabel], ["Status", entity.status]]} />
    {organization ? <button className="related-primary" onClick={() => onOpenRelated("organizations", organization.id)}><Building2 aria-hidden="true" /> Organisation öffnen <ArrowRight aria-hidden="true" /></button> : null}
    <DetailSection title="Nächste Handlung"><p>{entity.nextAction}</p><small><CalendarDays aria-hidden="true" /> {formatDate(entity.nextActionDue)}</small></DetailSection>
    <DetailSection title="Hauptkontakt">{contact ? <button className="contact-block related-contact" onClick={() => onOpenRelated("contacts", contact.id)}><ContactRound aria-hidden="true" /><span><strong>{contactName(contact)}</strong><small>{contact.role}</small><small>{contact.email}</small></span><ArrowRight aria-hidden="true" /></button> : <p>Kein Kontakt verknüpft.</p>}</DetailSection>
    <DetailSection title="Arbeitsnotiz"><p>{entity.note || "Keine Arbeitsnotiz."}</p></DetailSection>
    <div className="drawer-section section-command"><h3>Nächste Schritte</h3><div><button onClick={() => onCreateTask(entity)}><CheckCircle2 aria-hidden="true" /> Aufgabe anlegen</button><button onClick={() => onCreateActivity(entity)}><History aria-hidden="true" /> Aktivität dokumentieren</button><button onClick={() => onCreateRelated("notes", entity)}>Notiz</button><button onClick={() => onCreateRelated("conversations", entity)}>Gespräch</button><button onClick={() => onCreateRelated("appointments", entity)}>Termin</button><button onClick={() => onCreateRelated("followUps", entity)}>Wiedervorlage</button><button onClick={() => onCreateRelated("offers", entity)}>Angebot</button><button onClick={() => onCreateRelated("decisions", entity)}>Entscheidung</button><button onClick={() => onCreateRelated("documentReferences", entity)}>Dokumentreferenz</button></div></div>
    <RelatedList title={`Aufgaben (${related.tasks.length})`} items={related.tasks.map((item) => ({ id: item.id, type: "tasks", title: item.title, subtitle: `${formatDate(item.dueDate)} · ${taskStatus(item.status)}` }))} onOpen={onOpenRelated} empty="Noch keine Aufgaben verbunden." />
    <Timeline activities={related.activities} />
    <RelatedList title={`Arbeitsjournal (${related.journal.length})`} items={related.journal} onOpen={onOpenRelated} empty="Noch keine Fachobjekte verbunden." />
    {entity.stageId === "won" ? <div className="handoff-box"><strong>Getrennte Prüfung für das Arrival Control Center (ACC)</strong><p>Beide fachlichen Prüfmarker sind erforderlich. Es entsteht weiterhin kein Fall, kein Datenpaket und keine Übertragung.</p><div className="handoff-approvals"><button className={handoff?.commercialApproval?.approved ? "approved" : ""} onClick={() => onSetHandoffApproval(entity.id, "commercial", !handoff?.commercialApproval?.approved)} aria-pressed={Boolean(handoff?.commercialApproval?.approved)}><span>{handoff?.commercialApproval?.approved ? <CheckCircle2 aria-hidden="true" /> : <CircleMark />}</span><b>Vertrieb / Produktverantwortung</b><small>{handoff?.commercialApproval?.approved ? "lokal freigegeben" : "Prüfung offen"}</small></button><button className={handoff?.operationsApproval?.approved ? "approved" : ""} onClick={() => onSetHandoffApproval(entity.id, "operations", !handoff?.operationsApproval?.approved)} aria-pressed={Boolean(handoff?.operationsApproval?.approved)}><span>{handoff?.operationsApproval?.approved ? <CheckCircle2 aria-hidden="true" /> : <CircleMark />}</span><b>Operative Prüfung</b><small>{handoff?.operationsApproval?.approved ? "lokal freigegeben" : "Prüfung offen"}</small></button></div><div className="handoff-status"><strong>Status: {handoff?.status === "approved_marker" ? "Fachlich doppelt freigegeben" : "Prüfung erforderlich"}</strong><span>Die ACC-Anbindung bleibt vollständig gesperrt · Voreinstellung ohne Personendaten</span></div><button disabled aria-disabled="true"><LockKeyhole aria-hidden="true" /> Keine Übertragung – C1 bis C7 gesperrt</button></div> : null}
  </>;
}

function TaskDetail({ entity, data, onSetTaskStatus, onOpenRelated }) {
  const opportunity = data.opportunities.find((item) => item.id === entity.opportunityId);
  return <>
    <Facts items={[["Status", taskStatus(entity.status)], ["Fällig", formatDate(entity.dueDate)], ["Priorität", priorityLabel(entity.priority)], ["Verantwortlich", ownerById[entity.ownerId]?.name]]} />
    <DetailSection title="Beschreibung"><p>{entity.description || "Keine weitere Beschreibung."}</p></DetailSection>
    {opportunity ? <button className="related-primary" onClick={() => onOpenRelated("opportunities", opportunity.id)}><ArrowRight aria-hidden="true" /> Zugehörige Chance öffnen</button> : null}
    {!entity.archivedAt ? <div className="task-status-actions"><button disabled={entity.status === "open"} onClick={() => onSetTaskStatus(entity.id, "open")}>Offen</button><button disabled={entity.status === "in_progress"} onClick={() => onSetTaskStatus(entity.id, "in_progress")}>In Arbeit</button><button disabled={entity.status === "completed"} onClick={() => onSetTaskStatus(entity.id, "completed")}>Erledigt</button></div> : null}
  </>;
}

function PartnerDetail({ entity, data, onCreatePartnerContact, onOpenRelated }) {
  const contacts = data.partnerContacts.filter((item) => item.partnerOrganizationId === entity.id && !item.archivedAt);
  return <>
    <Facts items={[["Kategorie", entity.category], ["Beziehungsstatus", entity.relationshipStatus], ["Verantwortlich", ownerById[entity.ownerId]?.name], ["Nächster Schritt", entity.nextAction]]} />
    <DetailSection title="Produktgrenze"><p>{entity.scopeNote}</p><small>Interne Pflege belegt keine Kooperation, Verfügbarkeit oder Leistungszusage. Kein Partnerlogin.</small></DetailSection>
    {!entity.archivedAt ? <button className="related-primary" onClick={() => onCreatePartnerContact(entity)}><UserPlus aria-hidden="true" /> Partnerkontakt anlegen</button> : null}
    <DetailSection title={`Partnerkontakte (${contacts.length})`}>{contacts.length ? <div className="related-list">{contacts.map((contact) => <button key={contact.id} onClick={() => onOpenRelated("partnerContacts", contact.id)}><UserRound aria-hidden="true" /><span><strong>{contactName(contact)}</strong><small>{contact.role} · {contact.email}</small></span><ArrowRight aria-hidden="true" /></button>)}</div> : <p>Noch keine Partnerkontakte.</p>}</DetailSection>
  </>;
}

function PartnerContactDetail({ entity, data, onOpenRelated }) {
  const partner = data.partnerOrganizations.find((item) => item.id === entity.partnerOrganizationId);
  return <>
    <Facts items={[["Partnerorganisation", partner?.displayName], ["Funktion", entity.role || "–"], ["E-Mail", entity.email || "–"], ["Telefon", entity.phone || "–"], ["Kontaktstatus", entity.contactStatus === "do_not_contact" ? "Nicht kontaktieren" : "Aktiv"]]} />
    {partner ? <button className="related-primary" onClick={() => onOpenRelated("partnerOrganizations", partner.id)}><Building2 aria-hidden="true" /> Partnerorganisation öffnen <ArrowRight aria-hidden="true" /></button> : null}
    <div className="boundary-note compact"><strong>Getrennte Objektklasse</strong><p>Partnerkontakte werden nicht mit Arbeitgeberkontakten oder App-Rollen vermischt.</p></div>
  </>;
}

function OperationalDetail({ type, entity, data, onOpenRelated }) {
  const opportunity = data.opportunities.find((item) => item.id === entity.opportunityId);
  const organization = data.organizations.find((item) => item.id === (entity.organizationId || opportunity?.organizationId));
  const contact = data.contacts.find((item) => item.id === entity.contactId);
  const facts = operationalFacts(type, entity);
  return <>
    <Facts items={facts} />
    <DetailSection title="Inhalt"><p>{operationalBody(type, entity) || "Keine weitere Beschreibung."}</p></DetailSection>
    {opportunity ? <button className="related-primary" onClick={() => onOpenRelated("opportunities", opportunity.id)}><ArrowRight aria-hidden="true" /> Zugehörige Chance öffnen</button> : null}
    {organization ? <button className="related-primary" onClick={() => onOpenRelated("organizations", organization.id)}><Building2 aria-hidden="true" /> Organisation öffnen</button> : null}
    {contact ? <button className="related-primary" onClick={() => onOpenRelated("contacts", contact.id)}><ContactRound aria-hidden="true" /> Kontakt öffnen</button> : null}
    {type === "documentReferences" ? <div className="boundary-note compact"><strong>Nur Metadaten</strong><p>Kein Upload, kein Dokumentenspeicher und keine externe Dateiübertragung.</p></div> : null}
    {type === "offers" && entity.status === "marked_sent" ? <div className="boundary-note compact"><strong>Kein Versand</strong><p>„Als versendet markiert“ ist ausschließlich ein lokaler synthetischer Status.</p></div> : null}
  </>;
}

function AuditTrail({ events }) {
  const visible = [...events].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)).slice(0, 12);
  return <DetailSection title={`Änderungsverlauf (${events.length})`}>{visible.length ? <ol className="audit-trail">{visible.map((event) => <li key={event.id}><span>{formatDate(event.occurredAt)}</span><strong>{event.summary}</strong><small>{auditAction(event.action)} · lokales Arbeitsprofil</small></li>)}</ol> : <p>Für den synthetischen Ausgangsdatensatz liegt noch kein eigenes Änderungsereignis vor.</p>}</DetailSection>;
}

function CircleMark() { return <span className="approval-dot" aria-hidden="true" />; }

function Facts({ items }) {
  return <dl className="drawer-facts canonical-facts">{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "–"}</dd></div>)}</dl>;
}

function DetailSection({ title, children }) { return <section className="drawer-section"><h3>{title}</h3>{children}</section>; }

function RelatedList({ title, items, onOpen, empty }) {
  return <DetailSection title={title}>{items.length ? <div className="related-list">{items.map((item) => <button key={item.id} onClick={() => onOpen(item.type, item.id)}><span><strong>{item.title}</strong><small>{item.subtitle}</small></span><ArrowRight aria-hidden="true" /></button>)}</div> : <p>{empty}</p>}</DetailSection>;
}

function Timeline({ activities }) {
  return <DetailSection title={`Aktivitätstimeline (${activities.length})`}>{activities.length ? <ol className="activity-timeline">{activities.map((activity) => <li key={activity.id}><i /><span><small>{formatDate(activity.occurredAt)}</small><strong>{activity.summary}</strong><em>{activityType(activity.type)}</em></span></li>)}</ol> : <p>Noch keine Aktivität dokumentiert.</p>}</DetailSection>;
}

function buildRelated(type, entity, data) {
  if (type === "organizations") return { contacts: data.contacts.filter((item) => item.organizationId === entity.id), opportunities: data.opportunities.filter((item) => item.organizationId === entity.id) };
  if (type === "contacts") return { opportunities: data.opportunities.filter((item) => item.primaryContactId === entity.id || item.participantContactIds?.includes(entity.id)) };
  if (type === "opportunities") return { tasks: data.tasks.filter((item) => item.opportunityId === entity.id), activities: data.activities.filter((item) => item.opportunityId === entity.id).sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)), journal: ["notes", "conversations", "appointments", "followUps", "offers", "decisions"].flatMap((journalType) => data[journalType].filter((item) => item.opportunityId === entity.id).map((item) => ({ id: item.id, type: journalType, title: entityTitle(journalType, item, data), subtitle: ({ notes: "Notiz", conversations: "Gespräch", appointments: "Termin", followUps: "Wiedervorlage", offers: "Angebot", decisions: "Entscheidung" })[journalType] }))) };
  return {};
}

function entityTitle(type, entity, data) {
  if (type === "organizations" || type === "partnerOrganizations") return entity.displayName;
  if (type === "contacts" || type === "partnerContacts") return contactName(entity);
  if (type === "leads") return entity.title;
  if (type === "opportunities") return organizationName(data, entity.organizationId);
  if (type === "conversations") return entity.subject;
  if (type === "offers") return `Angebot ${entity.versionLabel}`;
  return entity.title;
}
function entitySubtitle(type, entity, data) {
  if (type === "organizations") return `${entity.sector} · ${entity.region}`;
  if (type === "contacts") return `${entity.role || "Kontakt"} · ${organizationName(data, entity.organizationId)}`;
  if (type === "partnerContacts") return `${entity.role || "Partnerkontakt"} · ${data.partnerOrganizations.find((item) => item.id === entity.partnerOrganizationId)?.displayName || "Partner"}`;
  if (type === "leads") return `${leadStatus(entity.status)} · ${entity.organizationId ? organizationName(data, entity.organizationId) : entity.organizationHint}`;
  if (type === "opportunities") return entity.title;
  if (type === "tasks") return `${taskStatus(entity.status)} · ${formatDate(entity.dueDate)}`;
  if (type === "notes") return formatDate(entity.occurredAt);
  if (type === "conversations") return `${formatDate(entity.occurredAt)} · ${entity.channel || "Gespräch"}`;
  if (type === "appointments") return `${formatDate(entity.startsAt)} · ${entity.status}`;
  if (type === "followUps") return `${formatDate(entity.dueDate)} · ${entity.status}`;
  if (type === "offers") return `${entity.status} · ${formatDate(entity.validUntil)}`;
  if (type === "decisions") return `${entity.status} · ${formatDate(entity.decisionDate)}`;
  if (type === "documentReferences") return `${entity.documentType} · ${entity.versionLabel}`;
  return entity.category;
}
function formatDate(value) { return value ? new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${String(value).slice(0, 10)}T12:00:00`)) : "–"; }
function priorityLabel(value) { return ({ high: "Hoch", medium: "Mittel", low: "Niedrig" })[value] || "–"; }
function taskStatus(value) { return ({ open: "Offen", in_progress: "In Arbeit", completed: "Erledigt" })[value] || value; }
function activityType(value) { return ({ call: "Anrufnotiz", meeting_note: "Gesprächsnotiz", email_note: "E-Mail-Notiz", internal_note: "Interne Notiz", conversation: "Gespräch", appointment: "Termin", follow_up: "Wiedervorlage", offer: "Angebot", decision: "Entscheidung", document_reference: "Dokumentreferenz", stage_change: "Phasenhistorie", system_event: "Systemhinweis" })[value] || value; }
function leadStatus(value) { return ({ new: "Neu", reviewing: "In Prüfung", qualified: "Qualifiziert", converted: "Konvertiert", disqualified: "Nicht qualifiziert" })[value] || value; }

function operationalFacts(type, entity) {
  if (type === "notes") return [["Datum", formatDate(entity.occurredAt)], ["Sichtbarkeit", entity.visibility === "restricted" ? "Intern eingeschränkt" : "Intern"], ["Verantwortlich", ownerById[entity.ownerId]?.name]];
  if (type === "conversations") return [["Datum", formatDate(entity.occurredAt)], ["Kanal", ({ video: "Video", phone: "Telefon", in_person: "Persönlich", internal: "Intern" })[entity.channel] || entity.channel], ["Nächster Schritt", entity.nextStep]];
  if (type === "appointments") return [["Beginn", formatDateTime(entity.startsAt)], ["Ende", formatDateTime(entity.endsAt)], ["Status", ({ planned: "Geplant", completed: "Erledigt", cancelled: "Abgesagt" })[entity.status]], ["Ort / Hinweis", entity.locationNote]];
  if (type === "followUps") return [["Fällig", formatDate(entity.dueDate)], ["Status", ({ open: "Offen", completed: "Erledigt", cancelled: "Abgebrochen" })[entity.status]], ["Priorität", priorityLabel(entity.priority)], ["Verantwortlich", ownerById[entity.ownerId]?.name]];
  if (type === "offers") return [["Version", entity.versionLabel], ["Status", offerStatus(entity.status)], ["Betrag", money.format(entity.amount || 0)], ["Gültig bis", formatDate(entity.validUntil)]];
  if (type === "decisions") return [["Status", decisionStatus(entity.status)], ["Datum", formatDate(entity.decisionDate)], ["Entscheiderrolle", entity.decisionMakerRole], ["Nächster Schritt", entity.nextStep]];
  return [["Typ", entity.documentType], ["Referenz", entity.reference], ["Version", entity.versionLabel], ["Status", entity.status], ["Vertraulichkeit", entity.confidentiality === "restricted" ? "Intern eingeschränkt" : "Intern"]];
}
function operationalBody(type, entity) { return ({ notes: entity.body, conversations: entity.summary, appointments: entity.agenda, followUps: entity.description, offers: `${entity.scopeSummary}${entity.boundaryNote ? `\n\n${entity.boundaryNote}` : ""}`, decisions: entity.rationale, documentReferences: entity.notes })[type]; }
function formatDateTime(value) { return value ? new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value)) : "–"; }
function offerStatus(value) { return ({ draft: "Entwurf", reviewed: "Intern geprüft", marked_sent: "Als versendet markiert", accepted: "Angenommen", rejected: "Abgelehnt", expired: "Abgelaufen" })[value] || value; }
function decisionStatus(value) { return ({ pending: "Offen", approved: "Freigegeben", declined: "Abgelehnt", deferred: "Vertagt" })[value] || value; }
function auditAction(value) { return ({ created: "Angelegt", updated: "Bearbeitet", archived: "Archiviert", restored: "Wiederhergestellt", stage_changed: "Phasenwechsel", lead_converted: "Lead umgewandelt" })[value] || value; }
