export const SCHEMA_VERSION = 7;
export const STORAGE_KEY = "amavio-one-crm-r3-8-g1-legal-access-assurance-v7";
export const LEGACY_STORAGE_KEY = "amavio-one-crm-cockpit-v1";
export const CANONICAL_CORE_STORAGE_KEY = "amavio-one-crm-canonical-core-v2";

export const workspaceContract = Object.freeze({
  mode: "single_internal",
  label: "Interner AMAVIO-Arbeitsbereich",
  tenantCapable: false,
  externalAccess: false,
  securityEnforced: false,
});

export const roleContracts = Object.freeze([
  { id: "crm_admin", label: "CRM-Administration", scope: "Fachlicher Vollzugriff im Zielvertrag" },
  { id: "commercial_owner", label: "Vertriebsverantwortung", scope: "Eigene und zugewiesene Organisationen und Chancen" },
  { id: "commercial_editor", label: "Vertriebsbearbeitung", scope: "Freigegebene kommerzielle Datensätze" },
  { id: "operations_viewer", label: "Operative Prüfung", scope: "Freigegebene Übergabekontexte, nur lesend" },
  { id: "privacy_reviewer", label: "Datenschutzprüfung", scope: "Kontaktstatus, Herkunft und Audit-Metadaten" },
]);

export const lockedProductiveCapabilities = Object.freeze([
  "real_data_activation", "authentication", "external_import", "email_send", "calendar_sync", "document_storage", "app_integration", "productive_ai", "hosting_deployment",
]);

export const pipelineStages = [
  { id: "contact", label: "Erstkontakt", order: 10 },
  { id: "qualified", label: "Qualifiziert", order: 20 },
  { id: "scoping", label: "Leistungsrahmen", order: 30 },
  { id: "proposal", label: "Angebot", order: 40 },
  { id: "decision", label: "Entscheidung", order: 50 },
  { id: "won", label: "Gewonnen", order: 60 },
];

export const terminalStages = [{ id: "lost", label: "Verloren", order: 70 }];
export const allStages = [...pipelineStages, ...terminalStages];
export const stageById = Object.fromEntries(allStages.map((stage) => [stage.id, stage]));

export const owners = [
  { id: "usr-za", initials: "ZA", name: "Zaki Amawi", role: "crm_admin" },
  { id: "usr-ls", initials: "LS", name: "Lena Schuster", role: "commercial_editor" },
  { id: "usr-mk", initials: "MK", name: "Max Krämer", role: "commercial_editor" },
];
export const ownerById = Object.fromEntries(owners.map((owner) => [owner.id, owner]));

export const entityLabels = {
  organizations: "Organisation",
  contacts: "Kontakt",
  leads: "Lead",
  opportunities: "Chance",
  tasks: "Aufgabe",
  activities: "Aktivität",
  partnerOrganizations: "Partner",
  partnerContacts: "Partnerkontakt",
  notes: "Notiz",
  conversations: "Gespräch",
  appointments: "Termin",
  followUps: "Wiedervorlage",
  offers: "Angebot",
  decisions: "Entscheidung",
  documentReferences: "Dokumentreferenz",
  savedViews: "Gespeicherte Ansicht",
  targetSegments: "Zielsegment",
  researchItems: "Rechercheeintrag",
  outreachDrafts: "Outreach-Entwurf",
  suppressionEntries: "Kontaktsperre",
};

export const operationalEntityTypes = ["notes", "conversations", "appointments", "followUps", "offers", "decisions", "documentReferences"];

export const operationalTypeMeta = Object.freeze({
  notes: { label: "Notiz", plural: "Notizen" },
  conversations: { label: "Gespräch", plural: "Gespräche" },
  appointments: { label: "Termin", plural: "Termine" },
  followUps: { label: "Wiedervorlage", plural: "Wiedervorlagen" },
  offers: { label: "Angebot", plural: "Angebote" },
  decisions: { label: "Entscheidung", plural: "Entscheidungen" },
  documentReferences: { label: "Dokumentreferenz", plural: "Dokumentreferenzen" },
});

export const defaultAgingRules = Object.freeze({
  opportunityInactivityDays: 14,
  followUpWarningDays: 2,
  offerExpiryWarningDays: 7,
});

export const allowedStageTransitions = {
  contact: ["qualified", "lost"],
  qualified: ["contact", "scoping", "lost"],
  scoping: ["qualified", "proposal", "lost"],
  proposal: ["scoping", "decision", "lost"],
  decision: ["proposal", "won", "lost"],
  won: ["decision"],
  lost: ["qualified"],
};

export function canTransitionOpportunity(from, to) {
  return from === to || (allowedStageTransitions[from] || []).includes(to);
}

export function nextAllowedStages(current) {
  return allStages.filter((stage) => stage.id === current || canTransitionOpportunity(current, stage.id));
}

export function validateStageEntry(opportunity, toStage, data) {
  const missing = [];
  const requireText = (field, label) => {
    if (!String(opportunity[field] || "").trim()) missing.push({ field, label });
  };
  const hasContact = Boolean(opportunity.primaryContactId && data.contacts.some((item) => item.id === opportunity.primaryContactId && item.organizationId === opportunity.organizationId));

  requireText("organizationId", "Organisation");
  requireText("title", "Chancenbezeichnung");
  requireText("ownerId", "Verantwortlicher");
  requireText("nextAction", "nächste Handlung");
  requireText("nextActionDue", "Fälligkeit der nächsten Handlung");

  if (["qualified", "scoping", "proposal", "decision", "won"].includes(toStage)) {
    requireText("needSummary", "dokumentierter Bedarf");
    if (!hasContact && !String(opportunity.contactOpenQuestion || "").trim()) missing.push({ field: "contactOpenQuestion", label: "Kontaktrolle oder begründete offene Kontaktfrage" });
  }
  if (["scoping", "proposal", "decision", "won"].includes(toStage)) {
    requireText("scopeSummary", "Zielbild oder Notiz zum Leistungsrahmen");
    requireText("openQuestions", "dokumentierte offene Punkte");
    if (!hasContact && !String(opportunity.contactException || "").trim()) missing.push({ field: "contactException", label: "Hauptkontakt oder dokumentierte Ausnahme" });
  }
  if (["proposal", "decision", "won"].includes(toStage)) {
    requireText("offerContext", "Angebotskontext");
    requireText("serviceBoundary", "Leistungsgrenze");
    if (!(Number(opportunity.potential || 0) > 0) && !String(opportunity.potentialOpenReason || "").trim()) missing.push({ field: "potentialOpenReason", label: "Betrag oder begründeter offener Betrag" });
    if (!opportunity.offerValidUntil && !opportunity.nextActionDue) missing.push({ field: "offerValidUntil", label: "Angebotsgültigkeit oder Folgeschritt" });
  }
  if (["decision", "won"].includes(toStage)) {
    requireText("decisionRole", "Entscheiderrolle");
    requireText("decisionPath", "Entscheidungspfad");
    requireText("decisionDateWindow", "Entscheidungsdatum oder -korridor");
  }
  if (toStage === "won") {
    if (opportunity.wonMarker !== true) missing.push({ field: "wonMarker", label: "ausdrücklicher lokaler Gewinnmarker" });
    requireText("wonScope", "dokumentierter vereinbarter Leistungsrahmen");
  }
  if (toStage === "lost") requireText("lossReason", "sachlicher Verlustgrund");

  return uniqueMissing(missing);
}

function uniqueMissing(items) {
  const seen = new Set();
  return items.filter((item) => !seen.has(item.field) && seen.add(item.field));
}

export function makeId(prefix, now = Date.now()) {
  const random = Math.random().toString(36).slice(2, 7);
  return `${prefix}-${now.toString(36)}-${random}`;
}

export function activeRecords(records, includeArchived = false) {
  return includeArchived ? records : records.filter((record) => !record.archivedAt);
}

export function organizationName(data, organizationId) {
  return data.organizations.find((organization) => organization.id === organizationId)?.displayName || "Nicht zugeordnet";
}

export function contactName(contact) {
  return [contact?.firstName, contact?.lastName].filter(Boolean).join(" ") || "Unbenannter Kontakt";
}

export function normalizeText(value) {
  return String(value || "").trim().toLocaleLowerCase("de-DE");
}

export function findDuplicateHints(kind, draft, data, editingId = null) {
  const same = (value, other) => normalizeText(value) && normalizeText(value) === normalizeText(other);
  if (kind === "organizations") {
    return data.organizations.filter((item) => item.id !== editingId && !item.archivedAt && same(draft.displayName, item.displayName)).map((item) => `Ähnliche Organisation vorhanden: ${item.displayName}`);
  }
  if (kind === "contacts") {
    return data.contacts
      .filter((item) => item.id !== editingId && !item.archivedAt)
      .filter((item) => (draft.email && same(draft.email, item.email)) || (same(draft.firstName, item.firstName) && same(draft.lastName, item.lastName) && draft.organizationId === item.organizationId))
      .map((item) => `Möglicher Kontakt-Dublett: ${contactName(item)}`);
  }
  if (kind === "opportunities") {
    return data.opportunities.filter((item) => item.id !== editingId && !item.archivedAt && item.organizationId === draft.organizationId && same(draft.title, item.title)).map((item) => `Ähnliche Chance vorhanden: ${item.title}`);
  }
  if (kind === "researchItems") {
    return (data.researchItems || [])
      .filter((item) => item.id !== editingId && !item.archivedAt)
      .filter((item) => (draft.sourceUrl && same(draft.sourceUrl, item.sourceUrl)) || (draft.organizationHint && same(draft.organizationHint, item.organizationHint)))
      .map((item) => `Möglicher Recherche-Dublett: ${item.organizationHint}`);
  }
  return [];
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRecord(kind, draft, data) {
  const errors = {};
  const hasRelationship = () => Boolean(draft.opportunityId || draft.organizationId || draft.contactId);
  const validOpportunity = () => data.opportunities.some((item) => item.id === draft.opportunityId && !item.archivedAt);
  if (kind === "organizations") {
    if (!String(draft.displayName || "").trim()) errors.displayName = "Name ist erforderlich.";
    if (!String(draft.sector || "").trim()) errors.sector = "Segment ist erforderlich.";
    if (!String(draft.region || "").trim()) errors.region = "Region ist erforderlich.";
    if (!draft.ownerId) errors.ownerId = "Verantwortlicher ist erforderlich.";
  }
  if (kind === "leads") {
    if (!String(draft.title || "").trim()) errors.title = "Lead-Bezeichnung ist erforderlich.";
    if (!draft.organizationId && !String(draft.organizationHint || "").trim()) errors.organizationHint = "Organisation oder Organisationshinweis ist erforderlich.";
    if (!draft.ownerId) errors.ownerId = "Verantwortlicher ist erforderlich.";
    if (!String(draft.sourceLabel || "").trim()) errors.sourceLabel = "Datenherkunft ist erforderlich.";
    if (!["new", "reviewing", "qualified", "disqualified", "converted"].includes(draft.status)) errors.status = "Ein gültiger Lead-Status ist erforderlich.";
  }
  if (kind === "contacts") {
    if (!String(draft.firstName || "").trim()) errors.firstName = "Vorname ist erforderlich.";
    if (!String(draft.lastName || "").trim()) errors.lastName = "Nachname ist erforderlich.";
    if (!draft.organizationId || !data.organizations.some((item) => item.id === draft.organizationId)) errors.organizationId = "Eine gültige Organisation ist erforderlich.";
    if (draft.email && !emailPattern.test(draft.email)) errors.email = "E-Mail-Format ist ungültig.";
    if (draft.email && !draft.email.endsWith(".invalid")) errors.email = "Im synthetischen Prototyp sind nur .invalid-Adressen zulässig.";
    if (!draft.ownerId) errors.ownerId = "Verantwortlicher ist erforderlich.";
    if (draft.consentStatus === "documented") {
      if (!String(draft.consentPurpose || "").trim()) errors.consentPurpose = "Für einen dokumentierten Status ist der Zweck erforderlich.";
      if (!String(draft.consentSource || "").trim()) errors.consentSource = "Für einen dokumentierten Status ist die Quelle erforderlich.";
      if (!draft.consentRecordedAt) errors.consentRecordedAt = "Für einen dokumentierten Status ist der Zeitpunkt erforderlich.";
      if (!String(draft.consentEvidenceReference || "").trim()) errors.consentEvidenceReference = "Eine synthetische Nachweisreferenz ist erforderlich.";
    }
  }
  if (kind === "opportunities") {
    if (!draft.organizationId || !data.organizations.some((item) => item.id === draft.organizationId)) errors.organizationId = "Eine gültige Organisation ist erforderlich.";
    if (!String(draft.title || "").trim()) errors.title = "Bezeichnung ist erforderlich.";
    if (!draft.stageId || !stageById[draft.stageId]) errors.stageId = "Eine gültige Phase ist erforderlich.";
    if (!draft.ownerId) errors.ownerId = "Verantwortlicher ist erforderlich.";
    if (!String(draft.nextAction || "").trim()) errors.nextAction = "Nächste Handlung ist erforderlich.";
    if (!draft.nextActionDue) errors.nextActionDue = "Fälligkeit ist erforderlich.";
    if (Number(draft.potential || 0) < 0) errors.potential = "Potenzial darf nicht negativ sein.";
    if (draft.primaryContactId) {
      const contact = data.contacts.find((item) => item.id === draft.primaryContactId);
      if (!contact || contact.organizationId !== draft.organizationId) errors.primaryContactId = "Hauptkontakt muss zur ausgewählten Organisation gehören.";
    }
  }
  if (kind === "partnerOrganizations") {
    if (!String(draft.displayName || "").trim()) errors.displayName = "Partnername ist erforderlich.";
    if (!String(draft.category || "").trim()) errors.category = "Kategorie ist erforderlich.";
    if (!draft.ownerId) errors.ownerId = "Verantwortlicher ist erforderlich.";
    if (!["prospect", "qualified", "active", "paused"].includes(draft.relationshipStatus)) errors.relationshipStatus = "Ein gültiger Beziehungsstatus ist erforderlich.";
  }
  if (kind === "partnerContacts") {
    if (!String(draft.firstName || "").trim()) errors.firstName = "Vorname ist erforderlich.";
    if (!String(draft.lastName || "").trim()) errors.lastName = "Nachname ist erforderlich.";
    if (!draft.partnerOrganizationId || !data.partnerOrganizations.some((item) => item.id === draft.partnerOrganizationId)) errors.partnerOrganizationId = "Eine gültige Partnerorganisation ist erforderlich.";
    if (draft.email && !emailPattern.test(draft.email)) errors.email = "E-Mail-Format ist ungültig.";
    if (draft.email && !draft.email.endsWith(".invalid")) errors.email = "Im synthetischen Prototyp sind nur .invalid-Adressen zulässig.";
  }
  if (kind === "tasks") {
    if (!String(draft.title || "").trim()) errors.title = "Aufgabentitel ist erforderlich.";
    if (!draft.ownerId) errors.ownerId = "Verantwortlicher ist erforderlich.";
    if (!draft.dueDate) errors.dueDate = "Fälligkeit ist erforderlich.";
    if (!draft.opportunityId && !draft.organizationId && !draft.contactId) errors.relationship = "Mindestens ein CRM-Bezug ist erforderlich.";
  }
  if (kind === "activities") {
    if (!String(draft.summary || "").trim()) errors.summary = "Zusammenfassung ist erforderlich.";
    if (!draft.occurredAt) errors.occurredAt = "Datum ist erforderlich.";
    if (!draft.opportunityId && !draft.organizationId && !draft.contactId) errors.relationship = "Mindestens ein CRM-Bezug ist erforderlich.";
  }
  if (kind === "notes") {
    if (!String(draft.title || "").trim()) errors.title = "Titel ist erforderlich.";
    if (!String(draft.body || "").trim()) errors.body = "Notizinhalt ist erforderlich.";
    if (!hasRelationship()) errors.relationship = "Mindestens ein CRM-Bezug ist erforderlich.";
  }
  if (kind === "conversations") {
    if (!String(draft.subject || "").trim()) errors.subject = "Gesprächsbetreff ist erforderlich.";
    if (!draft.occurredAt) errors.occurredAt = "Gesprächsdatum ist erforderlich.";
    if (!String(draft.summary || "").trim()) errors.summary = "Gesprächsergebnis ist erforderlich.";
    if (!hasRelationship()) errors.relationship = "Mindestens ein CRM-Bezug ist erforderlich.";
  }
  if (kind === "appointments") {
    if (!String(draft.title || "").trim()) errors.title = "Termintitel ist erforderlich.";
    if (!draft.startsAt) errors.startsAt = "Beginn ist erforderlich.";
    if (!draft.endsAt) errors.endsAt = "Ende ist erforderlich.";
    if (draft.startsAt && draft.endsAt && draft.endsAt < draft.startsAt) errors.endsAt = "Das Ende darf nicht vor dem Beginn liegen.";
    if (!["planned", "completed", "cancelled"].includes(draft.status)) errors.status = "Ein gültiger Terminstatus ist erforderlich.";
    if (!hasRelationship()) errors.relationship = "Mindestens ein CRM-Bezug ist erforderlich.";
  }
  if (kind === "followUps") {
    if (!String(draft.title || "").trim()) errors.title = "Bezeichnung ist erforderlich.";
    if (!draft.dueDate) errors.dueDate = "Fälligkeit ist erforderlich.";
    if (!draft.ownerId) errors.ownerId = "Verantwortlicher ist erforderlich.";
    if (!["open", "completed", "cancelled"].includes(draft.status)) errors.status = "Ein gültiger Status ist erforderlich.";
    if (!hasRelationship()) errors.relationship = "Mindestens ein CRM-Bezug ist erforderlich.";
  }
  if (kind === "offers") {
    if (!validOpportunity()) errors.opportunityId = "Eine aktive Chance ist erforderlich.";
    if (!String(draft.versionLabel || "").trim()) errors.versionLabel = "Version ist erforderlich.";
    if (!["draft", "reviewed", "marked_sent", "accepted", "rejected", "expired"].includes(draft.status)) errors.status = "Ein gültiger Angebotsstatus ist erforderlich.";
    if (Number(draft.amount || 0) < 0) errors.amount = "Betrag darf nicht negativ sein.";
    if (!String(draft.scopeSummary || "").trim()) errors.scopeSummary = "Leistungsrahmen ist erforderlich.";
    if (!draft.validUntil) errors.validUntil = "Gültigkeit ist erforderlich.";
  }
  if (kind === "decisions") {
    if (!validOpportunity()) errors.opportunityId = "Eine aktive Chance ist erforderlich.";
    if (!String(draft.title || "").trim()) errors.title = "Entscheidungsgegenstand ist erforderlich.";
    if (!["pending", "approved", "declined", "deferred"].includes(draft.status)) errors.status = "Ein gültiger Entscheidungsstatus ist erforderlich.";
    if (draft.status !== "pending" && !draft.decisionDate) errors.decisionDate = "Für diesen Status ist ein Entscheidungsdatum erforderlich.";
    if (!String(draft.decisionMakerRole || "").trim()) errors.decisionMakerRole = "Entscheiderrolle ist erforderlich.";
  }
  if (kind === "documentReferences") {
    if (!String(draft.title || "").trim()) errors.title = "Dokumenttitel ist erforderlich.";
    if (!String(draft.documentType || "").trim()) errors.documentType = "Dokumenttyp ist erforderlich.";
    if (!String(draft.reference || "").trim()) errors.reference = "Eine lokale Textreferenz ist erforderlich.";
    if (!String(draft.versionLabel || "").trim()) errors.versionLabel = "Version ist erforderlich.";
    if (!["draft", "current", "superseded", "archived"].includes(draft.status)) errors.status = "Ein gültiger Dokumentstatus ist erforderlich.";
    if (!hasRelationship()) errors.relationship = "Mindestens ein CRM-Bezug ist erforderlich.";
  }
  if (kind === "savedViews") {
    if (!String(draft.name || "").trim()) errors.name = "Name ist erforderlich.";
    if (![...operationalEntityTypes, "aging"].includes(draft.entityType)) errors.entityType = "Ein gültiger Ansichtsbereich ist erforderlich.";
  }
  if (kind === "targetSegments") {
    if (!String(draft.name || "").trim()) errors.name = "Segmentname ist erforderlich.";
    if (!String(draft.fitCriteria || "").trim()) errors.fitCriteria = "Mindestens ein Passungskriterium ist erforderlich.";
    if (!draft.ownerId) errors.ownerId = "Verantwortlicher ist erforderlich.";
  }
  if (kind === "researchItems") {
    if (!String(draft.organizationHint || "").trim()) errors.organizationHint = "Organisationshinweis ist erforderlich.";
    if (!String(draft.sourceUrl || "").trim()) errors.sourceUrl = "Quellen-URL ist erforderlich.";
    if (draft.sourceUrl && !/^https?:\/\//i.test(draft.sourceUrl)) errors.sourceUrl = "Die Quellen-URL muss mit http:// oder https:// beginnen.";
    if (!String(draft.sourceType || "").trim()) errors.sourceType = "Quellenart ist erforderlich.";
    if (!draft.researchedAt) errors.researchedAt = "Recherchezeitpunkt ist erforderlich.";
    if (!draft.ownerId) errors.ownerId = "Verantwortlicher ist erforderlich.";
    if (!["captured", "reviewing", "qualified", "rejected", "converted"].includes(draft.status)) errors.status = "Ein gültiger Recherchestatus ist erforderlich.";
  }
  if (kind === "outreachDrafts") {
    const contact = data.contacts.find((item) => item.id === draft.contactId && !item.archivedAt);
    if (!contact) errors.contactId = "Ein aktiver Kontakt ist erforderlich.";
    if (!String(draft.subject || "").trim()) errors.subject = "Betreff ist erforderlich.";
    if (!String(draft.body || "").trim()) errors.body = "Entwurfstext ist erforderlich.";
    if (!String(draft.purpose || "").trim()) errors.purpose = "Kontaktzweck ist erforderlich.";
    if (!["draft", "review_required", "approved_local", "blocked", "cancelled"].includes(draft.status)) errors.status = "Ein gültiger Outreach-Status ist erforderlich.";
    if (!draft.ownerId) errors.ownerId = "Verantwortlicher ist erforderlich.";
  }
  if (kind === "suppressionEntries") {
    if (!draft.contactId || !data.contacts.some((item) => item.id === draft.contactId)) errors.contactId = "Kontakt ist erforderlich.";
    if (!String(draft.reason || "").trim()) errors.reason = "Sperrgrund ist erforderlich.";
  }
  return errors;
}

export function assertValidRecord(kind, draft, data) {
  const errors = validateRecord(kind, draft, data);
  if (Object.keys(errors).length) {
    const error = new Error("Bitte Pflichtfelder und Beziehungen prüfen.");
    error.validation = errors;
    throw error;
  }
}

export function searchCrm(data, query, includeArchived = false) {
  const needle = normalizeText(query);
  if (!needle) return [];
  const contains = (...values) => normalizeText(values.join(" ")).includes(needle);
  const results = [];
  activeRecords(data.organizations, includeArchived).forEach((item) => {
    if (contains(item.displayName, item.legalName, item.sector, item.region, item.notes)) results.push({ type: "organizations", id: item.id, title: item.displayName, subtitle: `${item.sector} · ${item.region}` });
  });
  activeRecords(data.contacts, includeArchived).forEach((item) => {
    if (contains(contactName(item), item.role, item.email, organizationName(data, item.organizationId))) results.push({ type: "contacts", id: item.id, title: contactName(item), subtitle: `${item.role || "Kontakt"} · ${organizationName(data, item.organizationId)}` });
  });
  activeRecords(data.leads, includeArchived).forEach((item) => {
    if (contains(item.title, item.organizationHint, organizationName(data, item.organizationId), item.needSummary, item.sourceLabel)) results.push({ type: "leads", id: item.id, title: item.title, subtitle: `${item.organizationId ? organizationName(data, item.organizationId) : item.organizationHint} · Lead` });
  });
  activeRecords(data.opportunities, includeArchived).forEach((item) => {
    if (contains(item.title, organizationName(data, item.organizationId), item.nextAction, item.sourceLabel, item.note)) results.push({ type: "opportunities", id: item.id, title: organizationName(data, item.organizationId), subtitle: `${item.title} · ${stageById[item.stageId]?.label || item.stageId}` });
  });
  activeRecords(data.tasks, includeArchived).forEach((item) => {
    const opportunity = data.opportunities.find((candidate) => candidate.id === item.opportunityId);
    if (contains(item.title, opportunity?.title, organizationName(data, item.organizationId || opportunity?.organizationId))) results.push({ type: "tasks", id: item.id, title: item.title, subtitle: opportunity?.title || organizationName(data, item.organizationId) });
  });
  activeRecords(data.partnerOrganizations, includeArchived).forEach((item) => {
    if (contains(item.displayName, item.category, item.nextAction)) results.push({ type: "partnerOrganizations", id: item.id, title: item.displayName, subtitle: item.category });
  });
  activeRecords(data.partnerContacts, includeArchived).forEach((item) => {
    const partner = data.partnerOrganizations.find((candidate) => candidate.id === item.partnerOrganizationId);
    if (contains(contactName(item), item.role, item.email, partner?.displayName)) results.push({ type: "partnerContacts", id: item.id, title: contactName(item), subtitle: `${item.role || "Partnerkontakt"} · ${partner?.displayName || "Partner"}` });
  });
  activeRecords(data.notes, includeArchived).forEach((item) => {
    if (contains(item.title, item.body, organizationName(data, item.organizationId))) results.push({ type: "notes", id: item.id, title: item.title, subtitle: "Notiz · Fachblock" });
  });
  activeRecords(data.conversations, includeArchived).forEach((item) => {
    if (contains(item.subject, item.summary, item.nextStep, organizationName(data, item.organizationId))) results.push({ type: "conversations", id: item.id, title: item.subject, subtitle: "Gespräch · Fachblock" });
  });
  activeRecords(data.appointments, includeArchived).forEach((item) => {
    if (contains(item.title, item.agenda, item.locationNote, organizationName(data, item.organizationId))) results.push({ type: "appointments", id: item.id, title: item.title, subtitle: "Termin · Fachblock" });
  });
  activeRecords(data.followUps, includeArchived).forEach((item) => {
    if (contains(item.title, item.description, organizationName(data, item.organizationId))) results.push({ type: "followUps", id: item.id, title: item.title, subtitle: "Wiedervorlage · Fachblock" });
  });
  activeRecords(data.offers, includeArchived).forEach((item) => {
    const opportunity = data.opportunities.find((candidate) => candidate.id === item.opportunityId);
    if (contains("Angebot", item.versionLabel, item.scopeSummary, opportunity?.title, organizationName(data, opportunity?.organizationId))) results.push({ type: "offers", id: item.id, title: `Angebot ${item.versionLabel}`, subtitle: `${opportunity?.title || "Chance"} · Fachblock` });
  });
  activeRecords(data.decisions, includeArchived).forEach((item) => {
    const opportunity = data.opportunities.find((candidate) => candidate.id === item.opportunityId);
    if (contains(item.title, item.rationale, item.decisionMakerRole, opportunity?.title)) results.push({ type: "decisions", id: item.id, title: item.title, subtitle: "Entscheidung · Fachblock" });
  });
  activeRecords(data.documentReferences, includeArchived).forEach((item) => {
    if (contains(item.title, item.documentType, item.reference, item.versionLabel)) results.push({ type: "documentReferences", id: item.id, title: item.title, subtitle: `${item.reference} · Dokumentreferenz · kein Upload` });
  });
  activeRecords(data.targetSegments || [], includeArchived).forEach((item) => {
    if (contains(item.name, item.fitCriteria, item.region, item.sector)) results.push({ type: "targetSegments", id: item.id, title: item.name, subtitle: "Zielsegment · Growth" });
  });
  activeRecords(data.researchItems || [], includeArchived).forEach((item) => {
    if (contains(item.organizationHint, item.website, item.sourceUrl, item.fitNote, item.sourceType)) results.push({ type: "researchItems", id: item.id, title: item.organizationHint, subtitle: "Recherche · Quelle dokumentiert" });
  });
  activeRecords(data.outreachDrafts || [], includeArchived).forEach((item) => {
    const contact = data.contacts.find((candidate) => candidate.id === item.contactId);
    if (contains(item.subject, item.body, item.purpose, contactName(contact))) results.push({ type: "outreachDrafts", id: item.id, title: item.subject, subtitle: `${contactName(contact)} · Entwurf ohne Versand` });
  });
  return results.slice(0, 30);
}

export function isSyntheticState(data) {
  const collections = ["organizations", "contacts", "leads", "opportunities", "tasks", "activities", "partnerOrganizations", "partnerContacts", "notes", "conversations", "appointments", "followUps", "offers", "decisions", "documentReferences", "savedViews", "handoffReferences", "targetSegments", "researchItems", "outreachDrafts", "suppressionEntries"];
  return data?.meta?.synthetic === true
    && data?.meta?.schemaVersion === SCHEMA_VERSION
    && data?.meta?.workspaceMode === workspaceContract.mode
    && data?.meta?.tenantCapable === false
    && collections.every((key) => Array.isArray(data[key]) && data[key].every((record) => record.synthetic === true))
    && data?.agingRules?.synthetic === true;
}

export function getAgingSignals(data, today = new Date().toISOString().slice(0, 10)) {
  const rules = { ...defaultAgingRules, ...(data.agingRules || {}) };
  const day = 86400000;
  const atNoon = (value) => new Date(`${String(value).slice(0, 10)}T12:00:00`).getTime();
  const daysBetween = (from, to) => Math.floor((atNoon(to) - atNoon(from)) / day);
  const signals = [];
  activeRecords(data.opportunities).filter((item) => !["won", "lost"].includes(item.stageId)).forEach((item) => {
    const latestActivity = data.activities.filter((activity) => !activity.archivedAt && activity.opportunityId === item.id).map((activity) => activity.occurredAt).sort().at(-1);
    const referenceDate = latestActivity || item.updatedAt || item.createdAt;
    const idleDays = daysBetween(referenceDate, today);
    if (idleDays >= Number(rules.opportunityInactivityDays)) signals.push({ id: `aging-opportunity-${item.id}`, kind: "opportunity", entityType: "opportunities", entityId: item.id, severity: "warning", title: `${item.title}: ${idleDays} Tage ohne Aktivität`, dueDate: item.nextActionDue });
  });
  activeRecords(data.followUps).filter((item) => item.status === "open").forEach((item) => {
    const distance = daysBetween(today, item.dueDate);
    if (distance < 0) signals.push({ id: `aging-followup-${item.id}`, kind: "followUp", entityType: "followUps", entityId: item.id, severity: "overdue", title: `${item.title}: ${Math.abs(distance)} Tage überfällig`, dueDate: item.dueDate });
    else if (distance <= Number(rules.followUpWarningDays)) signals.push({ id: `aging-followup-${item.id}`, kind: "followUp", entityType: "followUps", entityId: item.id, severity: "warning", title: `${item.title}: in ${distance} Tagen fällig`, dueDate: item.dueDate });
  });
  activeRecords(data.offers).filter((item) => !["accepted", "rejected", "expired"].includes(item.status)).forEach((item) => {
    const distance = daysBetween(today, item.validUntil);
    if (distance < 0) signals.push({ id: `aging-offer-${item.id}`, kind: "offer", entityType: "offers", entityId: item.id, severity: "overdue", title: `Angebot ${item.versionLabel}: Gültigkeit überschritten`, dueDate: item.validUntil });
    else if (distance <= Number(rules.offerExpiryWarningDays)) signals.push({ id: `aging-offer-${item.id}`, kind: "offer", entityType: "offers", entityId: item.id, severity: "warning", title: `Angebot ${item.versionLabel}: noch ${distance} Tage gültig`, dueDate: item.validUntil });
  });
  return signals.sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)));
}

export function contactRestriction(contact) {
  if (!contact) return { blocked: true, reason: "Kein Kontakt zugeordnet." };
  if (contact.contactStatus === "do_not_contact") return { blocked: true, reason: "Kontaktstatus: Nicht kontaktieren." };
  if (["withdrawn", "blocked"].includes(contact.consentStatus)) return { blocked: true, reason: contact.consentStatus === "withdrawn" ? "Einwilligungs-/Rechtsstatus: Widerrufen." : "Einwilligungs-/Rechtsstatus: Gesperrt." };
  return { blocked: false, reason: "Keine Außenaktion vorhanden; Status nur lokal dokumentiert." };
}
