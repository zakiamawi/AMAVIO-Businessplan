import { cloneElement, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { contactName, findDuplicateHints, owners, pipelineStages, validateRecord } from "../domain/crmDomain";
import { AccessibleDialog } from "./AccessibleDialog";

const today = "2026-10-10";

function defaultDraft(kind, context = {}) {
  if (kind === "organizations") return { displayName: "", legalName: "", sector: "Gesundheit", region: "Düsseldorf", ownerId: "usr-za", status: "active", website: "", phone: "", notes: "" };
  if (kind === "contacts") return { firstName: "", lastName: "", organizationId: context.organizationId || "", role: "", email: "", phone: "", ownerId: "usr-za", relationshipRole: "specialist", contactStatus: "active", consentStatus: "unknown", consentPurpose: "", consentSource: "", consentRecordedAt: "", consentEvidenceReference: "", notes: "" };
  if (kind === "leads") return { title: "", organizationId: context.organizationId || "", organizationHint: "", contactId: "", ownerId: "usr-za", status: "new", sourceLabel: "Synthetische lokale Eingabe", needSummary: "", contactOpenQuestion: "", nextAction: "Signal prüfen", nextActionDue: "2026-10-20", opportunityTitle: "", potential: 0, priority: "medium", notes: "", convertedOpportunityId: "", convertedAt: null };
  if (kind === "opportunities") return { organizationId: context.organizationId || "", title: "", pipelineId: "pipe-commercial-v1", stageId: "contact", status: "active", potential: 5900, currency: "EUR", ownerId: "usr-za", priority: "medium", sourceLabel: "Direktkontakt", primaryContactId: "", participantContactIds: [], nextAction: "Bedarfsgespräch vorbereiten", nextActionDue: "2026-10-20", needSummary: "", contactOpenQuestion: "", scopeSummary: "", openQuestions: "", contactException: "", offerContext: "", serviceBoundary: "", potentialOpenReason: "", offerValidUntil: "", decisionRole: "", decisionPath: "", decisionDateWindow: "", wonMarker: false, wonScope: "", note: "", lossReason: "" };
  if (kind === "tasks") return { title: "", opportunityId: context.opportunityId || "", organizationId: context.organizationId || "", contactId: context.contactId || "", ownerId: "usr-za", dueDate: "2026-10-20", priority: "medium", status: "open", description: "", completedAt: null };
  if (kind === "partnerOrganizations") return { displayName: "", category: "", relationshipStatus: "prospect", ownerId: "usr-za", nextAction: "Beziehungspfad prüfen", scopeNote: "Keine Kooperation oder Leistungszusage belegt.", contractStatus: "not_verified" };
  if (kind === "partnerContacts") return { firstName: "", lastName: "", partnerOrganizationId: context.partnerOrganizationId || "", role: "", email: "", phone: "", contactStatus: "active", notes: "" };
  if (kind === "notes") return { title: "", body: "", visibility: "internal", occurredAt: today, opportunityId: context.opportunityId || "", organizationId: context.organizationId || "", contactId: context.contactId || "", ownerId: "usr-za" };
  if (kind === "conversations") return { subject: "", occurredAt: today, channel: "video", summary: "", nextStep: "", participantContactIds: context.contactId ? [context.contactId] : [], opportunityId: context.opportunityId || "", organizationId: context.organizationId || "", contactId: context.contactId || "", ownerId: "usr-za" };
  if (kind === "appointments") return { title: "", startsAt: `${today}T10:00`, endsAt: `${today}T10:30`, status: "planned", locationNote: "Lokaler Termin – keine Kalenderverbindung", agenda: "", attendeeContactIds: context.contactId ? [context.contactId] : [], opportunityId: context.opportunityId || "", organizationId: context.organizationId || "", contactId: context.contactId || "", ownerId: "usr-za" };
  if (kind === "followUps") return { title: "", dueDate: today, status: "open", priority: "medium", description: "", opportunityId: context.opportunityId || "", organizationId: context.organizationId || "", contactId: context.contactId || "", ownerId: "usr-za", completedAt: null };
  if (kind === "offers") return { opportunityId: context.opportunityId || "", organizationId: context.organizationId || "", versionLabel: "V1", status: "draft", amount: 0, currency: "EUR", validUntil: today, scopeSummary: "", boundaryNote: "Keine Versendung und keine externe Preisfreigabe.", markedSentAt: null };
  if (kind === "decisions") return { opportunityId: context.opportunityId || "", organizationId: context.organizationId || "", title: "", status: "pending", decisionDate: "", decisionMakerRole: "", rationale: "", nextStep: "" };
  if (kind === "documentReferences") return { title: "", documentType: "Arbeitsentwurf", reference: "", versionLabel: "V1", status: "draft", confidentiality: "internal", opportunityId: context.opportunityId || "", organizationId: context.organizationId || "", contactId: context.contactId || "", notes: "" };
  if (kind === "savedViews") return { name: "", entityType: context.entityType || "notes", query: context.query || "", status: context.status || "all" };
  return { type: "internal_note", summary: "", occurredAt: today, opportunityId: context.opportunityId || "", organizationId: context.organizationId || "", contactId: context.contactId || "", authorId: "usr-za" };
}

const titles = { organizations: "Organisation", contacts: "Kontakt", leads: "Lead", opportunities: "Chance", tasks: "Aufgabe", activities: "Aktivität", partnerOrganizations: "Partner", partnerContacts: "Partnerkontakt", notes: "Notiz", conversations: "Gespräch", appointments: "Termin", followUps: "Wiedervorlage", offers: "Angebot", decisions: "Entscheidung", documentReferences: "Dokumentreferenz", savedViews: "Ansicht" };

function Field({ label, name, errors, wide = false, children }) {
  const error = errors[name];
  const fieldId = `crm-field-${name}`;
  const errorId = `${fieldId}-error`;
  return <label className={wide ? "wide" : ""} htmlFor={fieldId}>{label}{cloneElement(children, { id: fieldId, "aria-invalid": Boolean(error), "aria-describedby": error ? errorId : undefined })}<span id={errorId} className="field-error" role={error ? "alert" : undefined}>{error || ""}</span></label>;
}

export function EntityFormDialog({ config, data, onClose, onSave }) {
  const open = Boolean(config);
  const kind = config?.kind;
  const editing = config?.record || null;
  const [draft, setDraft] = useState(() => defaultDraft(kind));
  const [errors, setErrors] = useState({});
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (!config) return;
    setDraft(editing ? structuredClone(editing) : defaultDraft(kind, config.context));
    setErrors({});
  }, [config, editing, kind]);

  const duplicateHints = useMemo(() => open ? findDuplicateHints(kind, draft, data, editing?.id) : [], [data, draft, editing?.id, kind, open]);
  const organizationContacts = data.contacts.filter((contact) => !contact.archivedAt && contact.organizationId === draft.organizationId);

  function change(name, value) {
    setDraft((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "", relationship: "" }));
  }

  function submit(event) {
    event.preventDefault();
    const validation = validateRecord(kind, draft, data);
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }
    const normalized = kind === "opportunities" ? { ...draft, potential: Number(draft.potential || 0), participantContactIds: draft.primaryContactId ? [draft.primaryContactId] : [] } : kind === "offers" ? { ...draft, amount: Number(draft.amount || 0) } : draft;
    onSave(normalized);
  }

  return (
    <AccessibleDialog open={open} title={`${editing ? "Bearbeiten" : "Neu anlegen"}: ${titles[kind] || "Datensatz"}`} description="Alle Eingaben bleiben in diesem Browser und müssen synthetisch sein." onClose={onClose} size="large" initialFocusRef={firstFieldRef}>
      <form onSubmit={submit} noValidate>
        {duplicateHints.length ? <div className="duplicate-hint" role="status"><AlertTriangle aria-hidden="true" /><span><strong>Dublettenhinweis</strong>{duplicateHints.map((hint) => <small key={hint}>{hint}</small>)}</span></div> : null}
        {errors.relationship ? <div className="form-summary-error" role="alert">{errors.relationship}</div> : null}
        <div className="form-grid canonical-form">
          {kind === "organizations" && <>
            <Field label="Organisationsname *" name="displayName" errors={errors} wide><input ref={firstFieldRef} value={draft.displayName || ""} onChange={(event) => change("displayName", event.target.value)} /></Field>
            <Field label="Rechtlicher Name" name="legalName" errors={errors} wide><input value={draft.legalName || ""} onChange={(event) => change("legalName", event.target.value)} /></Field>
            <Field label="Segment *" name="sector" errors={errors}><input value={draft.sector || ""} onChange={(event) => change("sector", event.target.value)} /></Field>
            <Field label="Region *" name="region" errors={errors}><input value={draft.region || ""} onChange={(event) => change("region", event.target.value)} /></Field>
            <Field label="Verantwortlich *" name="ownerId" errors={errors}><OwnerSelect value={draft.ownerId} onChange={(value) => change("ownerId", value)} /></Field>
            <Field label="Status" name="status" errors={errors}><select value={draft.status || "active"} onChange={(event) => change("status", event.target.value)}><option value="active">Aktiv</option><option value="on_hold">Pausiert</option></select></Field>
            <Field label="Telefon" name="phone" errors={errors}><input value={draft.phone || ""} onChange={(event) => change("phone", event.target.value)} /></Field>
            <Field label="Website (nur Textreferenz)" name="website" errors={errors}><input value={draft.website || ""} onChange={(event) => change("website", event.target.value)} /></Field>
            <Field label="Interne Notiz" name="notes" errors={errors} wide><textarea value={draft.notes || ""} onChange={(event) => change("notes", event.target.value)} /></Field>
          </>}

          {kind === "contacts" && <>
            <Field label="Vorname *" name="firstName" errors={errors}><input ref={firstFieldRef} value={draft.firstName || ""} onChange={(event) => change("firstName", event.target.value)} /></Field>
            <Field label="Nachname *" name="lastName" errors={errors}><input value={draft.lastName || ""} onChange={(event) => change("lastName", event.target.value)} /></Field>
            <Field label="Organisation *" name="organizationId" errors={errors} wide><OrganizationSelect data={data} value={draft.organizationId} onChange={(value) => change("organizationId", value)} /></Field>
            <Field label="Funktion" name="role" errors={errors}><input value={draft.role || ""} onChange={(event) => change("role", event.target.value)} /></Field>
            <Field label="Beziehungsrolle" name="relationshipRole" errors={errors}><select value={draft.relationshipRole || "specialist"} onChange={(event) => change("relationshipRole", event.target.value)}><option value="decision_maker">Entscheidung</option><option value="champion">Sponsor/Champion</option><option value="budget_contact">Budgetkontakt</option><option value="specialist">Fachkontakt</option><option value="first_contact">Erstkontakt</option></select></Field>
            <Field label="E-Mail (.invalid)" name="email" errors={errors}><input type="email" value={draft.email || ""} onChange={(event) => change("email", event.target.value)} /></Field>
            <Field label="Telefon" name="phone" errors={errors}><input value={draft.phone || ""} onChange={(event) => change("phone", event.target.value)} /></Field>
            <Field label="Verantwortlich *" name="ownerId" errors={errors}><OwnerSelect value={draft.ownerId} onChange={(value) => change("ownerId", value)} /></Field>
            <Field label="Kontaktstatus" name="contactStatus" errors={errors}><select value={draft.contactStatus || "active"} onChange={(event) => change("contactStatus", event.target.value)}><option value="active">Aktiv</option><option value="do_not_contact">Nicht kontaktieren</option></select></Field>
            <Field label="Einwilligungsstatus" name="consentStatus" errors={errors} wide><select value={draft.consentStatus || "unknown"} onChange={(event) => change("consentStatus", event.target.value)}><option value="unknown">Ungeklärt – keine Rechtsannahme</option><option value="not_required_review">Prüfung erforderlich</option><option value="documented">Nur synthetisch dokumentiert</option><option value="withdrawn">Widerrufen</option><option value="blocked">Gesperrt</option></select></Field>
            {draft.consentStatus === "documented" ? <>
              <div className="form-section-title wide"><strong>Synthetische Nachweisdokumentation</strong><span>Kein Rechtsnachweis und keine produktive Kontaktfreigabe.</span></div>
              <Field label="Zweck *" name="consentPurpose" errors={errors} wide><input value={draft.consentPurpose || ""} onChange={(event) => change("consentPurpose", event.target.value)} /></Field>
              <Field label="Quelle *" name="consentSource" errors={errors}><input value={draft.consentSource || ""} onChange={(event) => change("consentSource", event.target.value)} /></Field>
              <Field label="Dokumentiert am *" name="consentRecordedAt" errors={errors}><input type="date" value={draft.consentRecordedAt || ""} onChange={(event) => change("consentRecordedAt", event.target.value)} /></Field>
              <Field label="Synthetische Nachweisreferenz *" name="consentEvidenceReference" errors={errors} wide><input value={draft.consentEvidenceReference || ""} onChange={(event) => change("consentEvidenceReference", event.target.value)} /></Field>
            </> : null}
            <Field label="Interne Notiz" name="notes" errors={errors} wide><textarea value={draft.notes || ""} onChange={(event) => change("notes", event.target.value)} /></Field>
          </>}

          {kind === "leads" && <>
            <Field label="Lead-Bezeichnung *" name="title" errors={errors} wide><input ref={firstFieldRef} value={draft.title || ""} onChange={(event) => change("title", event.target.value)} /></Field>
            <Field label="Bestehende Organisation" name="organizationId" errors={errors} wide><OrganizationSelect data={data} value={draft.organizationId} onChange={(value) => { change("organizationId", value); if (value) change("organizationHint", ""); }} /></Field>
            <Field label="Oder Organisationshinweis *" name="organizationHint" errors={errors} wide><input value={draft.organizationHint || ""} disabled={Boolean(draft.organizationId)} onChange={(event) => change("organizationHint", event.target.value)} /></Field>
            <Field label="Status" name="status" errors={errors}><select value={draft.status || "new"} disabled={draft.status === "converted"} onChange={(event) => change("status", event.target.value)}><option value="new">Neu</option><option value="reviewing">In Prüfung</option><option value="qualified">Qualifiziert</option><option value="disqualified">Nicht qualifiziert</option>{draft.status === "converted" ? <option value="converted">Konvertiert</option> : null}</select></Field>
            <Field label="Verantwortlich *" name="ownerId" errors={errors}><OwnerSelect value={draft.ownerId} onChange={(value) => change("ownerId", value)} /></Field>
            <Field label="Datenherkunft *" name="sourceLabel" errors={errors} wide><input value={draft.sourceLabel || ""} onChange={(event) => change("sourceLabel", event.target.value)} /></Field>
            <Field label="Dokumentierter Bedarf" name="needSummary" errors={errors} wide><textarea value={draft.needSummary || ""} onChange={(event) => change("needSummary", event.target.value)} /></Field>
            <Field label="Offene Kontaktfrage" name="contactOpenQuestion" errors={errors} wide><input value={draft.contactOpenQuestion || ""} onChange={(event) => change("contactOpenQuestion", event.target.value)} /></Field>
            <Field label="Nächste Handlung" name="nextAction" errors={errors} wide><input value={draft.nextAction || ""} onChange={(event) => change("nextAction", event.target.value)} /></Field>
            <Field label="Fälligkeit" name="nextActionDue" errors={errors}><input type="date" value={draft.nextActionDue || ""} onChange={(event) => change("nextActionDue", event.target.value)} /></Field>
            <Field label="Chancenbezeichnung nach Konvertierung" name="opportunityTitle" errors={errors}><input value={draft.opportunityTitle || ""} onChange={(event) => change("opportunityTitle", event.target.value)} /></Field>
            <Field label="Potenzial in EUR" name="potential" errors={errors}><input type="number" min="0" value={draft.potential ?? 0} onChange={(event) => change("potential", event.target.value)} /></Field>
            <Field label="Interne Notiz" name="notes" errors={errors} wide><textarea value={draft.notes || ""} onChange={(event) => change("notes", event.target.value)} /></Field>
          </>}

          {kind === "opportunities" && <>
            <Field label="Organisation *" name="organizationId" errors={errors} wide><OrganizationSelect data={data} value={draft.organizationId} onChange={(value) => { change("organizationId", value); change("primaryContactId", ""); }} /></Field>
            <Field label="Bezeichnung *" name="title" errors={errors} wide><input ref={firstFieldRef} value={draft.title || ""} onChange={(event) => change("title", event.target.value)} /></Field>
            <Field label="Phase" name="stageId" errors={errors}><select value={draft.stageId || "contact"} disabled={Boolean(editing)} onChange={(event) => change("stageId", event.target.value)}>{pipelineStages.map((stage) => <option key={stage.id} value={stage.id}>{stage.label}</option>)}</select></Field>
            <Field label="Verantwortlich *" name="ownerId" errors={errors}><OwnerSelect value={draft.ownerId} onChange={(value) => change("ownerId", value)} /></Field>
            <Field label="Hauptkontakt" name="primaryContactId" errors={errors} wide><select value={draft.primaryContactId || ""} onChange={(event) => change("primaryContactId", event.target.value)}><option value="">Noch nicht zugeordnet</option>{organizationContacts.map((contact) => <option key={contact.id} value={contact.id}>{contactName(contact)} · {contact.role}</option>)}</select></Field>
            <Field label="Potenzial in EUR" name="potential" errors={errors}><input type="number" min="0" value={draft.potential ?? 0} onChange={(event) => change("potential", event.target.value)} /></Field>
            <Field label="Priorität" name="priority" errors={errors}><select value={draft.priority || "medium"} onChange={(event) => change("priority", event.target.value)}><option value="high">Hoch</option><option value="medium">Mittel</option><option value="low">Niedrig</option></select></Field>
            <Field label="Datenherkunft" name="sourceLabel" errors={errors}><input value={draft.sourceLabel || ""} onChange={(event) => change("sourceLabel", event.target.value)} /></Field>
            <Field label="Nächste Handlung *" name="nextAction" errors={errors} wide><input value={draft.nextAction || ""} onChange={(event) => change("nextAction", event.target.value)} /></Field>
            <Field label="Fälligkeit *" name="nextActionDue" errors={errors}><input type="date" value={draft.nextActionDue || ""} onChange={(event) => change("nextActionDue", event.target.value)} /></Field>
            <div className="form-section-title wide"><strong>Qualifizierung</strong><span>Pflicht ab Eintritt in „Qualifiziert“.</span></div>
            <Field label="Dokumentierter Bedarf" name="needSummary" errors={errors} wide><textarea value={draft.needSummary || ""} onChange={(event) => change("needSummary", event.target.value)} /></Field>
            <Field label="Begründete offene Kontaktfrage" name="contactOpenQuestion" errors={errors} wide><input value={draft.contactOpenQuestion || ""} onChange={(event) => change("contactOpenQuestion", event.target.value)} /></Field>
            <div className="form-section-title wide"><strong>Leistungsrahmen</strong><span>Pflicht ab Eintritt in „Leistungsrahmen“.</span></div>
            <Field label="Zielbild / Leistungsrahmen" name="scopeSummary" errors={errors} wide><textarea value={draft.scopeSummary || ""} onChange={(event) => change("scopeSummary", event.target.value)} /></Field>
            <Field label="Offene Punkte" name="openQuestions" errors={errors} wide><textarea value={draft.openQuestions || ""} onChange={(event) => change("openQuestions", event.target.value)} /></Field>
            <Field label="Dokumentierte Kontaktausnahme" name="contactException" errors={errors} wide><input value={draft.contactException || ""} onChange={(event) => change("contactException", event.target.value)} /></Field>
            <div className="form-section-title wide"><strong>Angebot</strong><span>Pflicht ab Eintritt in „Angebot“.</span></div>
            <Field label="Angebotskontext" name="offerContext" errors={errors} wide><textarea value={draft.offerContext || ""} onChange={(event) => change("offerContext", event.target.value)} /></Field>
            <Field label="Leistungsgrenze" name="serviceBoundary" errors={errors} wide><textarea value={draft.serviceBoundary || ""} onChange={(event) => change("serviceBoundary", event.target.value)} /></Field>
            <Field label="Begründung bei offenem Betrag" name="potentialOpenReason" errors={errors} wide><input value={draft.potentialOpenReason || ""} onChange={(event) => change("potentialOpenReason", event.target.value)} /></Field>
            <Field label="Angebot gültig bis" name="offerValidUntil" errors={errors}><input type="date" value={draft.offerValidUntil || ""} onChange={(event) => change("offerValidUntil", event.target.value)} /></Field>
            <div className="form-section-title wide"><strong>Entscheidung und Gewinnmarker</strong><span>Pflicht ab den jeweiligen späteren Phasen.</span></div>
            <Field label="Entscheiderrolle" name="decisionRole" errors={errors}><input value={draft.decisionRole || ""} onChange={(event) => change("decisionRole", event.target.value)} /></Field>
            <Field label="Entscheidungskorridor" name="decisionDateWindow" errors={errors}><input value={draft.decisionDateWindow || ""} onChange={(event) => change("decisionDateWindow", event.target.value)} /></Field>
            <Field label="Entscheidungspfad" name="decisionPath" errors={errors} wide><textarea value={draft.decisionPath || ""} onChange={(event) => change("decisionPath", event.target.value)} /></Field>
            <Field label="Lokaler Gewinnmarker" name="wonMarker" errors={errors}><input type="checkbox" checked={Boolean(draft.wonMarker)} onChange={(event) => change("wonMarker", event.target.checked)} /></Field>
            <Field label="Vereinbarter Leistungsrahmen" name="wonScope" errors={errors} wide><textarea value={draft.wonScope || ""} onChange={(event) => change("wonScope", event.target.value)} /></Field>
            <Field label="Arbeitsnotiz" name="note" errors={errors} wide><textarea value={draft.note || ""} onChange={(event) => change("note", event.target.value)} /></Field>
          </>}

          {kind === "tasks" && <>
            <Field label="Aufgabe *" name="title" errors={errors} wide><input ref={firstFieldRef} value={draft.title || ""} onChange={(event) => change("title", event.target.value)} /></Field>
            <Field label="Chance" name="opportunityId" errors={errors} wide><OpportunitySelect data={data} value={draft.opportunityId} onChange={(value) => { const opportunity = data.opportunities.find((item) => item.id === value); change("opportunityId", value); if (opportunity) change("organizationId", opportunity.organizationId); }} /></Field>
            <Field label="Verantwortlich *" name="ownerId" errors={errors}><OwnerSelect value={draft.ownerId} onChange={(value) => change("ownerId", value)} /></Field>
            <Field label="Fälligkeit *" name="dueDate" errors={errors}><input type="date" value={draft.dueDate || ""} onChange={(event) => change("dueDate", event.target.value)} /></Field>
            <Field label="Priorität" name="priority" errors={errors}><select value={draft.priority || "medium"} onChange={(event) => change("priority", event.target.value)}><option value="high">Hoch</option><option value="medium">Mittel</option><option value="low">Niedrig</option></select></Field>
            <Field label="Status" name="status" errors={errors}><select value={draft.status || "open"} onChange={(event) => change("status", event.target.value)}><option value="open">Offen</option><option value="in_progress">In Arbeit</option><option value="completed">Erledigt</option></select></Field>
            <Field label="Beschreibung" name="description" errors={errors} wide><textarea value={draft.description || ""} onChange={(event) => change("description", event.target.value)} /></Field>
          </>}

          {kind === "activities" && <>
            <Field label="Art" name="type" errors={errors}><select ref={firstFieldRef} value={draft.type || "internal_note"} onChange={(event) => change("type", event.target.value)}><option value="call">Anrufnotiz</option><option value="meeting_note">Gesprächsnotiz</option><option value="email_note">E-Mail-Notiz (kein Versand)</option><option value="internal_note">Interne Notiz</option></select></Field>
            <Field label="Datum *" name="occurredAt" errors={errors}><input type="date" value={draft.occurredAt || today} onChange={(event) => change("occurredAt", event.target.value)} /></Field>
            <Field label="Chance" name="opportunityId" errors={errors} wide><OpportunitySelect data={data} value={draft.opportunityId} onChange={(value) => { const opportunity = data.opportunities.find((item) => item.id === value); change("opportunityId", value); if (opportunity) change("organizationId", opportunity.organizationId); }} /></Field>
            <Field label="Zusammenfassung *" name="summary" errors={errors} wide><textarea value={draft.summary || ""} onChange={(event) => change("summary", event.target.value)} /></Field>
          </>}

          {kind === "notes" && <>
            <Field label="Titel *" name="title" errors={errors} wide><input ref={firstFieldRef} value={draft.title || ""} onChange={(event) => change("title", event.target.value)} /></Field>
            <Field label="Notiz *" name="body" errors={errors} wide><textarea value={draft.body || ""} onChange={(event) => change("body", event.target.value)} /></Field>
            <Field label="Datum" name="occurredAt" errors={errors}><input type="date" value={draft.occurredAt || today} onChange={(event) => change("occurredAt", event.target.value)} /></Field>
            <Field label="Sichtbarkeit" name="visibility" errors={errors}><select value={draft.visibility || "internal"} onChange={(event) => change("visibility", event.target.value)}><option value="internal">Intern</option><option value="restricted">Intern eingeschränkt</option></select></Field>
            <RelationshipFields draft={draft} data={data} errors={errors} change={change} />
          </>}

          {kind === "conversations" && <>
            <Field label="Gesprächsbetreff *" name="subject" errors={errors} wide><input ref={firstFieldRef} value={draft.subject || ""} onChange={(event) => change("subject", event.target.value)} /></Field>
            <Field label="Datum *" name="occurredAt" errors={errors}><input type="date" value={draft.occurredAt || today} onChange={(event) => change("occurredAt", event.target.value)} /></Field>
            <Field label="Kanal" name="channel" errors={errors}><select value={draft.channel || "video"} onChange={(event) => change("channel", event.target.value)}><option value="video">Video</option><option value="phone">Telefon</option><option value="in_person">Persönlich</option><option value="internal">Intern</option></select></Field>
            <Field label="Gesprächsergebnis *" name="summary" errors={errors} wide><textarea value={draft.summary || ""} onChange={(event) => change("summary", event.target.value)} /></Field>
            <Field label="Nächster Schritt" name="nextStep" errors={errors} wide><input value={draft.nextStep || ""} onChange={(event) => change("nextStep", event.target.value)} /></Field>
            <RelationshipFields draft={draft} data={data} errors={errors} change={change} />
          </>}

          {kind === "appointments" && <>
            <Field label="Termintitel *" name="title" errors={errors} wide><input ref={firstFieldRef} value={draft.title || ""} onChange={(event) => change("title", event.target.value)} /></Field>
            <Field label="Beginn *" name="startsAt" errors={errors}><input type="datetime-local" value={draft.startsAt || ""} onChange={(event) => change("startsAt", event.target.value)} /></Field>
            <Field label="Ende *" name="endsAt" errors={errors}><input type="datetime-local" value={draft.endsAt || ""} onChange={(event) => change("endsAt", event.target.value)} /></Field>
            <Field label="Status" name="status" errors={errors}><select value={draft.status || "planned"} onChange={(event) => change("status", event.target.value)}><option value="planned">Geplant</option><option value="completed">Erledigt</option><option value="cancelled">Abgesagt</option></select></Field>
            <Field label="Ort / lokaler Hinweis" name="locationNote" errors={errors}><input value={draft.locationNote || ""} onChange={(event) => change("locationNote", event.target.value)} /></Field>
            <Field label="Agenda" name="agenda" errors={errors} wide><textarea value={draft.agenda || ""} onChange={(event) => change("agenda", event.target.value)} /></Field>
            <RelationshipFields draft={draft} data={data} errors={errors} change={change} />
          </>}

          {kind === "followUps" && <>
            <Field label="Wiedervorlage *" name="title" errors={errors} wide><input ref={firstFieldRef} value={draft.title || ""} onChange={(event) => change("title", event.target.value)} /></Field>
            <Field label="Fälligkeit *" name="dueDate" errors={errors}><input type="date" value={draft.dueDate || today} onChange={(event) => change("dueDate", event.target.value)} /></Field>
            <Field label="Status" name="status" errors={errors}><select value={draft.status || "open"} onChange={(event) => change("status", event.target.value)}><option value="open">Offen</option><option value="completed">Erledigt</option><option value="cancelled">Abgebrochen</option></select></Field>
            <Field label="Priorität" name="priority" errors={errors}><select value={draft.priority || "medium"} onChange={(event) => change("priority", event.target.value)}><option value="high">Hoch</option><option value="medium">Mittel</option><option value="low">Niedrig</option></select></Field>
            <Field label="Verantwortlich *" name="ownerId" errors={errors}><OwnerSelect value={draft.ownerId} onChange={(value) => change("ownerId", value)} /></Field>
            <Field label="Beschreibung" name="description" errors={errors} wide><textarea value={draft.description || ""} onChange={(event) => change("description", event.target.value)} /></Field>
            <RelationshipFields draft={draft} data={data} errors={errors} change={change} />
          </>}

          {kind === "offers" && <>
            <Field label="Chance *" name="opportunityId" errors={errors} wide><OpportunitySelect data={data} value={draft.opportunityId} onChange={(value) => { const opportunity = data.opportunities.find((item) => item.id === value); change("opportunityId", value); change("organizationId", opportunity?.organizationId || ""); }} /></Field>
            <Field label="Version *" name="versionLabel" errors={errors}><input ref={firstFieldRef} value={draft.versionLabel || ""} onChange={(event) => change("versionLabel", event.target.value)} /></Field>
            <Field label="Status" name="status" errors={errors}><select value={draft.status || "draft"} onChange={(event) => change("status", event.target.value)}><option value="draft">Entwurf</option><option value="reviewed">Intern geprüft</option><option value="marked_sent">Als versendet markiert – ohne Versand</option><option value="accepted">Angenommen</option><option value="rejected">Abgelehnt</option><option value="expired">Abgelaufen</option></select></Field>
            <Field label="Betrag in EUR" name="amount" errors={errors}><input type="number" min="0" value={draft.amount ?? 0} onChange={(event) => change("amount", event.target.value)} /></Field>
            <Field label="Gültig bis *" name="validUntil" errors={errors}><input type="date" value={draft.validUntil || ""} onChange={(event) => change("validUntil", event.target.value)} /></Field>
            <Field label="Leistungsrahmen *" name="scopeSummary" errors={errors} wide><textarea value={draft.scopeSummary || ""} onChange={(event) => change("scopeSummary", event.target.value)} /></Field>
            <Field label="Leistungs- und Versandgrenze" name="boundaryNote" errors={errors} wide><textarea value={draft.boundaryNote || ""} onChange={(event) => change("boundaryNote", event.target.value)} /></Field>
          </>}

          {kind === "decisions" && <>
            <Field label="Chance *" name="opportunityId" errors={errors} wide><OpportunitySelect data={data} value={draft.opportunityId} onChange={(value) => { const opportunity = data.opportunities.find((item) => item.id === value); change("opportunityId", value); change("organizationId", opportunity?.organizationId || ""); }} /></Field>
            <Field label="Entscheidungsgegenstand *" name="title" errors={errors} wide><input ref={firstFieldRef} value={draft.title || ""} onChange={(event) => change("title", event.target.value)} /></Field>
            <Field label="Status" name="status" errors={errors}><select value={draft.status || "pending"} onChange={(event) => change("status", event.target.value)}><option value="pending">Offen</option><option value="approved">Freigegeben</option><option value="declined">Abgelehnt</option><option value="deferred">Vertagt</option></select></Field>
            <Field label="Entscheidungsdatum" name="decisionDate" errors={errors}><input type="date" value={draft.decisionDate || ""} onChange={(event) => change("decisionDate", event.target.value)} /></Field>
            <Field label="Entscheiderrolle *" name="decisionMakerRole" errors={errors} wide><input value={draft.decisionMakerRole || ""} onChange={(event) => change("decisionMakerRole", event.target.value)} /></Field>
            <Field label="Begründung" name="rationale" errors={errors} wide><textarea value={draft.rationale || ""} onChange={(event) => change("rationale", event.target.value)} /></Field>
            <Field label="Nächster Schritt" name="nextStep" errors={errors} wide><input value={draft.nextStep || ""} onChange={(event) => change("nextStep", event.target.value)} /></Field>
          </>}

          {kind === "documentReferences" && <>
            <Field label="Dokumenttitel *" name="title" errors={errors} wide><input ref={firstFieldRef} value={draft.title || ""} onChange={(event) => change("title", event.target.value)} /></Field>
            <Field label="Dokumenttyp *" name="documentType" errors={errors}><input value={draft.documentType || ""} onChange={(event) => change("documentType", event.target.value)} /></Field>
            <Field label="Lokale Textreferenz *" name="reference" errors={errors} wide><input value={draft.reference || ""} onChange={(event) => change("reference", event.target.value)} placeholder="Keine URL und kein Upload" /></Field>
            <Field label="Version *" name="versionLabel" errors={errors}><input value={draft.versionLabel || ""} onChange={(event) => change("versionLabel", event.target.value)} /></Field>
            <Field label="Status" name="status" errors={errors}><select value={draft.status || "draft"} onChange={(event) => change("status", event.target.value)}><option value="draft">Entwurf</option><option value="current">Aktuell</option><option value="superseded">Ersetzt</option><option value="archived">Archiviert</option></select></Field>
            <Field label="Vertraulichkeit" name="confidentiality" errors={errors}><select value={draft.confidentiality || "internal"} onChange={(event) => change("confidentiality", event.target.value)}><option value="internal">Intern</option><option value="restricted">Intern eingeschränkt</option></select></Field>
            <RelationshipFields draft={draft} data={data} errors={errors} change={change} />
            <Field label="Notiz" name="notes" errors={errors} wide><textarea value={draft.notes || ""} onChange={(event) => change("notes", event.target.value)} /></Field>
          </>}

          {kind === "savedViews" && <>
            <Field label="Name der Ansicht *" name="name" errors={errors} wide><input ref={firstFieldRef} value={draft.name || ""} onChange={(event) => change("name", event.target.value)} /></Field>
            <Field label="Bereich" name="entityType" errors={errors}><input value={titles[draft.entityType] || draft.entityType || ""} disabled /></Field>
            <Field label="Suchbegriff" name="query" errors={errors}><input value={draft.query || ""} disabled /></Field>
            <Field label="Statusfilter" name="status" errors={errors}><input value={draft.status || "all"} disabled /></Field>
            <div className="form-section-title wide"><strong>Nur lokal gespeichert</strong><span>Die Ansicht enthält keine Datensätze und wird nicht synchronisiert.</span></div>
          </>}

          {kind === "partnerOrganizations" && <>
            <Field label="Partnername *" name="displayName" errors={errors} wide><input ref={firstFieldRef} value={draft.displayName || ""} onChange={(event) => change("displayName", event.target.value)} /></Field>
            <Field label="Kategorie *" name="category" errors={errors}><input value={draft.category || ""} onChange={(event) => change("category", event.target.value)} /></Field>
            <Field label="Beziehungsstatus" name="relationshipStatus" errors={errors}><select value={draft.relationshipStatus || "prospect"} onChange={(event) => change("relationshipStatus", event.target.value)}><option value="prospect">Prüfen</option><option value="qualified">Qualifiziert</option><option value="active">Aktiv</option><option value="paused">Pausiert</option></select></Field>
            <Field label="Verantwortlich *" name="ownerId" errors={errors}><OwnerSelect value={draft.ownerId} onChange={(value) => change("ownerId", value)} /></Field>
            <Field label="Nächster interner Schritt" name="nextAction" errors={errors} wide><input value={draft.nextAction || ""} onChange={(event) => change("nextAction", event.target.value)} /></Field>
            <Field label="Interner Beziehungskontext" name="scopeNote" errors={errors} wide><textarea value={draft.scopeNote || ""} onChange={(event) => change("scopeNote", event.target.value)} /></Field>
          </>}

          {kind === "partnerContacts" && <>
            <Field label="Vorname *" name="firstName" errors={errors}><input ref={firstFieldRef} value={draft.firstName || ""} onChange={(event) => change("firstName", event.target.value)} /></Field>
            <Field label="Nachname *" name="lastName" errors={errors}><input value={draft.lastName || ""} onChange={(event) => change("lastName", event.target.value)} /></Field>
            <Field label="Partnerorganisation *" name="partnerOrganizationId" errors={errors} wide><PartnerOrganizationSelect data={data} value={draft.partnerOrganizationId} onChange={(value) => change("partnerOrganizationId", value)} /></Field>
            <Field label="Funktion" name="role" errors={errors}><input value={draft.role || ""} onChange={(event) => change("role", event.target.value)} /></Field>
            <Field label="E-Mail (.invalid)" name="email" errors={errors}><input type="email" value={draft.email || ""} onChange={(event) => change("email", event.target.value)} /></Field>
            <Field label="Telefon" name="phone" errors={errors}><input value={draft.phone || ""} onChange={(event) => change("phone", event.target.value)} /></Field>
            <Field label="Kontaktstatus" name="contactStatus" errors={errors}><select value={draft.contactStatus || "active"} onChange={(event) => change("contactStatus", event.target.value)}><option value="active">Aktiv</option><option value="do_not_contact">Nicht kontaktieren</option></select></Field>
            <Field label="Interne Notiz" name="notes" errors={errors} wide><textarea value={draft.notes || ""} onChange={(event) => change("notes", event.target.value)} /></Field>
          </>}
        </div>
        <div className="dialog-actions"><button type="button" className="secondary-action" onClick={onClose}>Abbrechen</button><button className="primary-action" type="submit">{editing ? "Änderungen speichern" : `${titles[kind]} anlegen`}</button></div>
      </form>
    </AccessibleDialog>
  );
}

function OwnerSelect({ value, onChange, ...props }) {
  return <select {...props} value={value || ""} onChange={(event) => onChange(event.target.value)}><option value="">Bitte wählen</option>{owners.map((owner) => <option key={owner.id} value={owner.id}>{owner.name}</option>)}</select>;
}

function OrganizationSelect({ data, value, onChange, ...props }) {
  return <select {...props} value={value || ""} onChange={(event) => onChange(event.target.value)}><option value="">Bitte wählen</option>{data.organizations.filter((item) => !item.archivedAt).map((item) => <option key={item.id} value={item.id}>{item.displayName}</option>)}</select>;
}

function OpportunitySelect({ data, value, onChange, ...props }) {
  return <select {...props} value={value || ""} onChange={(event) => onChange(event.target.value)}><option value="">Bitte wählen</option>{data.opportunities.filter((item) => !item.archivedAt).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select>;
}

function PartnerOrganizationSelect({ data, value, onChange, ...props }) {
  return <select {...props} value={value || ""} onChange={(event) => onChange(event.target.value)}><option value="">Bitte wählen</option>{data.partnerOrganizations.filter((item) => !item.archivedAt).map((item) => <option key={item.id} value={item.id}>{item.displayName}</option>)}</select>;
}

function ContactSelect({ data, value, onChange, organizationId, ...props }) {
  return <select {...props} value={value || ""} onChange={(event) => onChange(event.target.value)}><option value="">Optional</option>{data.contacts.filter((item) => !item.archivedAt && (!organizationId || item.organizationId === organizationId)).map((item) => <option key={item.id} value={item.id}>{contactName(item)}</option>)}</select>;
}

function RelationshipFields({ draft, data, errors, change }) {
  return <>
    <div className="form-section-title wide"><strong>CRM-Bezug</strong><span>Mindestens Organisation, Kontakt oder Chance zuordnen.</span></div>
    <Field label="Chance" name="opportunityId" errors={errors} wide><OpportunitySelect data={data} value={draft.opportunityId} onChange={(value) => { const opportunity = data.opportunities.find((item) => item.id === value); change("opportunityId", value); if (opportunity) change("organizationId", opportunity.organizationId); }} /></Field>
    <Field label="Organisation" name="organizationId" errors={errors}><OrganizationSelect data={data} value={draft.organizationId} onChange={(value) => { change("organizationId", value); if (draft.contactId && data.contacts.find((item) => item.id === draft.contactId)?.organizationId !== value) change("contactId", ""); }} /></Field>
    <Field label="Kontakt" name="contactId" errors={errors}><ContactSelect data={data} value={draft.contactId} organizationId={draft.organizationId} onChange={(value) => change("contactId", value)} /></Field>
  </>;
}
