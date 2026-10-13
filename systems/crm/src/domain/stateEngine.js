import { assertValidRecord, canTransitionOpportunity, contactRestriction, makeId, stageById, validateStageEntry } from "./crmDomain.js";
import { runG1SyntheticControlSuite } from "./g1Governance.js";

const collectionPrefix = { organizations: "org", contacts: "con", leads: "lead", opportunities: "opp", tasks: "task", activities: "act", partnerOrganizations: "par", partnerContacts: "pcon", notes: "note", conversations: "conv", appointments: "appt", followUps: "follow", offers: "offer", decisions: "decision", documentReferences: "docref", savedViews: "view", targetSegments: "segment", researchItems: "research", outreachDrafts: "outreach", suppressionEntries: "suppress" };
const nowIso = () => new Date().toISOString();
const clone = (state) => structuredClone(state);

function appendAudit(next, { action, entityType, entityId, summary, before = null, after = null }) {
  next.auditEvents.unshift({ id: makeId("audit"), action, entityType, entityId, summary, actorId: "usr-za", occurredAt: nowIso(), before, after, synthetic: true });
}

function touchMeta(next) { next.meta.updatedAt = nowIso(); }

export function runG1Controls(state) {
  return runG1SyntheticControlSuite(state, nowIso());
}

export function recordG1RestoreDrill(state, result) {
  if (result?.status !== "passed" || result?.syntheticOnly !== true || result?.liveStateMutated !== false) {
    throw new Error("Die isolierte Wiederherstellungsprobe besitzt keinen belastbaren synthetischen Erfolgsnachweis.");
  }
  const next = clone(state);
  const timestamp = result.checkedAt || nowIso();
  const run = {
    id: `g1-run-restore-${Date.now().toString(36)}`,
    kind: "restore_drill",
    label: "Isolierte Wiederherstellungsprobe",
    result: "passed",
    evidence: `Schema v${result.schemaVersion}; ${result.recordCount} Einträge round-trip-geprüft; Prüfsumme ${result.checksumPrefix}; Live-Zustand unverändert.`,
    executedAt: timestamp,
  };
  next.g1Governance = {
    ...next.g1Governance,
    status: "no_go",
    releaseEligible: false,
    realDataEnabled: false,
    controlRuns: [run, ...(next.g1Governance?.controlRuns || [])].slice(0, 30),
    lastControlRunAt: timestamp,
    updatedAt: timestamp,
  };
  next.meta = { ...next.meta, updatedAt: timestamp, realDataEnabled: false, outboundEnabled: false };
  appendAudit(next, { action: "g1_isolated_restore_drill", entityType: "system", entityId: "g1-governance", summary: "Isolierte synthetische Wiederherstellungsprobe bestanden; Live-Zustand unverändert" });
  return { state: next, run };
}

export function createRecord(state, entityType, draft) {
  if (!collectionPrefix[entityType]) throw new Error(`Nicht unterstützter Objekttyp: ${entityType}`);
  assertValidRecord(entityType, draft, state);
  const next = clone(state);
  const timestamp = nowIso();
  const record = { ...draft, id: makeId(collectionPrefix[entityType]), synthetic: true, qualityStatus: "synthetic", dataSourceId: draft.dataSourceId || "source-local-manual", createdAt: timestamp, updatedAt: timestamp, archivedAt: null };
  if (entityType === "activities") record.authorId = record.authorId || "usr-za";
  next[entityType].unshift(record);
  appendOperationalActivity(next, entityType, record, timestamp);
  appendAudit(next, { action: "created", entityType, entityId: record.id, summary: `${entityType} lokal angelegt`, after: record });
  touchMeta(next);
  return { state: next, record };
}

export function updateRecord(state, entityType, id, patch) {
  const current = state[entityType]?.find((item) => item.id === id);
  if (!current) throw new Error("Datensatz wurde nicht gefunden.");
  const draft = { ...current, ...patch, id: current.id };
  if (collectionPrefix[entityType] && entityType !== "activities") assertValidRecord(entityType, draft, state);
  const next = clone(state);
  const updated = { ...draft, updatedAt: nowIso() };
  next[entityType] = next[entityType].map((item) => item.id === id ? updated : item);
  appendAudit(next, { action: "updated", entityType, entityId: id, summary: `${entityType} lokal bearbeitet`, before: current, after: updated });
  touchMeta(next);
  return { state: next, record: updated };
}

export function archiveRecord(state, entityType, id, reason = "Lokal archiviert") {
  const current = state[entityType]?.find((item) => item.id === id);
  if (!current) throw new Error("Datensatz wurde nicht gefunden.");
  if (current.archivedAt) return { state, record: current };
  const next = clone(state);
  const updated = { ...current, archivedAt: nowIso(), archivedBy: "usr-za", archiveReason: reason, updatedAt: nowIso() };
  next[entityType] = next[entityType].map((item) => item.id === id ? updated : item);
  appendAudit(next, { action: "archived", entityType, entityId: id, summary: reason, before: current, after: updated });
  touchMeta(next);
  return { state: next, record: updated };
}

export function restoreRecord(state, entityType, id) {
  const current = state[entityType]?.find((item) => item.id === id);
  if (!current) throw new Error("Datensatz wurde nicht gefunden.");
  const next = clone(state);
  const updated = { ...current, archivedAt: null, archivedBy: null, archiveReason: "", updatedAt: nowIso() };
  next[entityType] = next[entityType].map((item) => item.id === id ? updated : item);
  appendAudit(next, { action: "restored", entityType, entityId: id, summary: `${entityType} lokal wiederhergestellt`, before: current, after: updated });
  touchMeta(next);
  return { state: next, record: updated };
}

export function transitionOpportunity(state, id, toStage, lossReason = "") {
  const current = state.opportunities.find((item) => item.id === id);
  if (!current) throw new Error("Chance wurde nicht gefunden.");
  if (!stageById[toStage]) throw new Error("Unbekannte Pipelinephase.");
  if (!canTransitionOpportunity(current.stageId, toStage)) throw new Error(`Übergang von ${stageById[current.stageId]?.label} nach ${stageById[toStage]?.label} ist nicht erlaubt.`);
  const candidate = { ...current, lossReason: toStage === "lost" ? (lossReason || current.lossReason) : current.lossReason };
  const missing = validateStageEntry(candidate, toStage, state);
  if (missing.length) throw new Error(`Für ${stageById[toStage]?.label} fehlen: ${missing.map((item) => item.label).join(", ")}.`);
  const next = clone(state);
  const timestamp = nowIso();
  const updated = {
    ...current,
    stageId: toStage,
    status: toStage === "won" ? "won" : toStage === "lost" ? "lost" : "active",
    lossReason: toStage === "lost" ? candidate.lossReason : current.lossReason,
    wonAt: toStage === "won" ? timestamp : current.wonAt || null,
    closedAt: toStage === "lost" ? timestamp : current.closedAt || null,
    updatedAt: timestamp,
  };
  next.opportunities = next.opportunities.map((item) => item.id === id ? updated : item);
  next.activities.unshift({ id: makeId("act"), type: "stage_change", summary: `Phase geändert: ${stageById[current.stageId]?.label} → ${stageById[toStage]?.label}`, opportunityId: id, organizationId: current.organizationId, contactId: "", occurredAt: timestamp.slice(0, 10), authorId: "usr-za", synthetic: true, qualityStatus: "synthetic", dataSourceId: "source-local-system", createdAt: timestamp, updatedAt: timestamp, archivedAt: null });
  appendAudit(next, { action: "stage_changed", entityType: "opportunities", entityId: id, summary: `Phase ${current.stageId} → ${toStage}`, before: { stageId: current.stageId }, after: { stageId: toStage } });
  touchMeta(next);
  return { state: next, record: updated };
}

export function convertLeadToOpportunity(state, leadId) {
  const lead = state.leads.find((item) => item.id === leadId);
  if (!lead) throw new Error("Lead wurde nicht gefunden.");
  if (lead.archivedAt) throw new Error("Archivierter Lead kann nicht konvertiert werden.");
  if (lead.status !== "qualified") throw new Error("Nur ein qualifizierter Lead kann in eine Chance konvertiert werden.");
  if (!lead.organizationId || !state.organizations.some((item) => item.id === lead.organizationId && !item.archivedAt)) throw new Error("Für die Konvertierung ist eine aktive Organisation erforderlich.");
  if (!String(lead.needSummary || "").trim()) throw new Error("Für die Konvertierung ist ein dokumentierter Bedarf erforderlich.");
  if (!String(lead.nextAction || "").trim() || !lead.nextActionDue) throw new Error("Für die Konvertierung sind nächste Handlung und Fälligkeit erforderlich.");

  const opportunityDraft = {
    organizationId: lead.organizationId,
    title: lead.opportunityTitle || lead.title,
    pipelineId: "pipe-commercial-v1",
    stageId: "contact",
    status: "active",
    potential: Number(lead.potential || 0),
    currency: "EUR",
    ownerId: lead.ownerId,
    priority: lead.priority || "medium",
    sourceLabel: lead.sourceLabel,
    primaryContactId: lead.contactId || "",
    participantContactIds: lead.contactId ? [lead.contactId] : [],
    nextAction: lead.nextAction,
    nextActionDue: lead.nextActionDue,
    needSummary: lead.needSummary,
    contactOpenQuestion: lead.contactOpenQuestion || "",
    scopeSummary: "",
    openQuestions: "",
    contactException: "",
    offerContext: "",
    serviceBoundary: "",
    potentialOpenReason: "",
    offerValidUntil: "",
    decisionRole: "",
    decisionPath: "",
    decisionDateWindow: "",
    wonMarker: false,
    wonScope: "",
    note: lead.notes || "Aus qualifiziertem synthetischem Lead konvertiert.",
    lossReason: "",
    convertedFromLeadId: lead.id,
  };

  const created = createRecord(state, "opportunities", opportunityDraft);
  const timestamp = nowIso();
  const next = clone(created.state);
  const convertedLead = { ...lead, status: "converted", convertedOpportunityId: created.record.id, convertedAt: timestamp, updatedAt: timestamp };
  next.leads = next.leads.map((item) => item.id === lead.id ? convertedLead : item);
  appendAudit(next, { action: "lead_converted", entityType: "leads", entityId: lead.id, summary: `Lead lokal in Chance ${created.record.id} konvertiert`, before: { status: lead.status }, after: { status: "converted", convertedOpportunityId: created.record.id } });
  touchMeta(next);
  return { state: next, record: created.record, lead: convertedLead };
}

export function setHandoffApproval(state, opportunityId, approvalType, approved) {
  if (!['commercial', 'operations'].includes(approvalType)) throw new Error("Unbekannte Handoff-Freigabe.");
  const opportunity = state.opportunities.find((item) => item.id === opportunityId);
  if (!opportunity || opportunity.stageId !== "won") throw new Error("Eine lokale Übergabeprüfung ist nur für gewonnene Chancen möglich.");
  const next = clone(state);
  const timestamp = nowIso();
  let reference = next.handoffReferences.find((item) => item.opportunityId === opportunityId);
  if (!reference) {
    reference = { id: makeId("handoff"), opportunityId, status: "review_required", contractVersion: "1.0", commercialApproval: null, operationsApproval: null, synthetic: true, createdAt: timestamp, updatedAt: timestamp, archivedAt: null };
    next.handoffReferences.unshift(reference);
  }
  const field = approvalType === "commercial" ? "commercialApproval" : "operationsApproval";
  const updatedApproval = approved ? { approved: true, approvedAt: timestamp, approvedByRole: approvalType === "commercial" ? "commercial_owner" : "operations_viewer", synthetic: true } : null;
  const updated = { ...reference, [field]: updatedApproval, updatedAt: timestamp };
  updated.status = updated.commercialApproval?.approved && updated.operationsApproval?.approved ? "approved_marker" : "review_required";
  next.handoffReferences = next.handoffReferences.map((item) => item.id === reference.id ? updated : item);
  appendAudit(next, { action: "handoff_approval_updated", entityType: "handoffReferences", entityId: reference.id, summary: `${approvalType === "commercial" ? "Vertrieb / Produktverantwortung" : "Operative Prüfung"}: ${approved ? "lokal freigegeben" : "Freigabe zurückgenommen"}`, before: reference, after: updated });
  touchMeta(next);
  return { state: next, record: updated };
}

export function setTaskStatus(state, id, status) {
  if (!["open", "in_progress", "completed"].includes(status)) throw new Error("Ungültiger Aufgabenstatus.");
  return updateRecord(state, "tasks", id, { status, completedAt: status === "completed" ? nowIso() : null });
}

export function appendUndoAudit(state, label) {
  const next = clone(state);
  appendAudit(next, { action: "undo", entityType: "system", entityId: "local-state", summary: `Rückgängig: ${label}` });
  touchMeta(next);
  return next;
}

export function updateAgingRules(state, patch) {
  const next = clone(state);
  const before = { ...next.agingRules };
  const numeric = Object.fromEntries(Object.entries(patch).map(([key, value]) => [key, Math.max(0, Number(value || 0))]));
  next.agingRules = { ...next.agingRules, ...numeric, synthetic: true, updatedAt: nowIso() };
  appendAudit(next, { action: "aging_rules_updated", entityType: "system", entityId: "aging-rules", summary: "Lokale Alterungsregeln aktualisiert", before, after: next.agingRules });
  touchMeta(next);
  return { state: next, record: next.agingRules };
}

export function convertResearchToLead(state, researchId) {
  const research = state.researchItems.find((item) => item.id === researchId);
  if (!research || research.archivedAt) throw new Error("Rechercheeintrag wurde nicht gefunden.");
  if (!['reviewing', 'qualified'].includes(research.status)) throw new Error("Nur geprüfte Rechercheeinträge können als Lead übernommen werden.");
  if (!research.sourceUrl || !research.researchedAt) throw new Error("Quelle und Recherchezeitpunkt müssen dokumentiert sein.");
  const created = createRecord(state, "leads", {
    title: `${research.organizationHint} – recherchiertes Signal`, organizationId: "", organizationHint: research.organizationHint,
    contactId: "", ownerId: research.ownerId, status: "reviewing", sourceLabel: `${research.sourceType}: ${research.sourceUrl}`,
    needSummary: research.fitNote || "", contactOpenQuestion: research.contactHint || "Ansprechpartner und zulässiger Kontaktweg sind offen.",
    nextAction: "Quelle, Bedarf und Kontaktweg qualifizieren", nextActionDue: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    opportunityTitle: "", potential: 0, priority: Number(research.fitScore || 0) >= 70 ? "medium" : "low",
    notes: "Aus lokaler synthetischer Recherche übernommen; keine Außenaktion freigegeben.", convertedOpportunityId: "", convertedAt: null,
  });
  const next = clone(created.state);
  const timestamp = nowIso();
  const updated = { ...research, status: "converted", convertedLeadId: created.record.id, updatedAt: timestamp };
  next.researchItems = next.researchItems.map((item) => item.id === researchId ? updated : item);
  appendAudit(next, { action: "research_converted", entityType: "researchItems", entityId: researchId, summary: `Recherche lokal in Lead ${created.record.id} übernommen`, before: research, after: updated });
  touchMeta(next);
  return { state: next, record: created.record, research: updated };
}

export function approveOutreachDraft(state, draftId) {
  const draft = state.outreachDrafts.find((item) => item.id === draftId);
  if (!draft || draft.archivedAt) throw new Error("Outreach-Entwurf wurde nicht gefunden.");
  const contact = state.contacts.find((item) => item.id === draft.contactId && !item.archivedAt);
  const restriction = contactRestriction(contact);
  if (restriction.blocked) throw new Error(`Freigabe gesperrt: ${restriction.reason}`);
  if (!['documented', 'not_required_review'].includes(contact?.consentStatus)) throw new Error("Vor lokaler Freigabe muss der Kontakt- und Rechtsstatus dokumentiert oder als gesondert geprüft markiert sein.");
  if (!String(draft.legalReviewNote || "").trim()) throw new Error("Eine dokumentierte Versand- und Kanalprüfung ist erforderlich.");
  const next = clone(state);
  const timestamp = nowIso();
  const updated = { ...draft, status: "approved_local", approvedAt: timestamp, approvedBy: "usr-za", updatedAt: timestamp, sentAt: null };
  next.outreachDrafts = next.outreachDrafts.map((item) => item.id === draftId ? updated : item);
  appendAudit(next, { action: "outreach_approved_local", entityType: "outreachDrafts", entityId: draftId, summary: "Outreach-Entwurf lokal freigegeben; Versand bleibt technisch gesperrt", before: draft, after: updated });
  touchMeta(next);
  return { state: next, record: updated };
}

export function suppressContact(state, contactId, reason) {
  const contact = state.contacts.find((item) => item.id === contactId);
  if (!contact) throw new Error("Kontakt wurde nicht gefunden.");
  if (!String(reason || "").trim()) throw new Error("Ein Sperrgrund ist erforderlich.");
  const timestamp = nowIso();
  let next = updateRecord(state, "contacts", contactId, { contactStatus: "do_not_contact", outreachEligibility: "blocked", objectionAt: timestamp }).state;
  const entry = { contactId, reason: String(reason).trim(), source: "local_manual", effectiveAt: timestamp, ownerId: "usr-za" };
  next = createRecord(next, "suppressionEntries", entry).state;
  next.outreachDrafts = next.outreachDrafts.map((item) => item.contactId === contactId && !['cancelled'].includes(item.status) ? { ...item, status: "blocked", updatedAt: timestamp } : item);
  appendAudit(next, { action: "contact_suppressed", entityType: "contacts", entityId: contactId, summary: "Kontakt lokal gesperrt; offene Outreach-Entwürfe blockiert" });
  touchMeta(next);
  return { state: next, record: next.contacts.find((item) => item.id === contactId) };
}

export function createReadinessTask(state, signal) {
  if (!signal?.readinessKey || !String(signal.title || "").trim()) throw new Error("Der operative Prüfhinweis ist unvollständig.");
  const existing = state.tasks.find((item) => !item.archivedAt && item.readinessKey === signal.readinessKey);
  if (existing) throw new Error("Für diesen Prüfpunkt ist bereits eine Aufgabe vorhanden.");
  if (!signal.opportunityId && !signal.organizationId && !signal.contactId) throw new Error("Der Prüfpunkt benötigt einen CRM-Bezug.");
  return createRecord(state, "tasks", {
    title: signal.title,
    opportunityId: signal.opportunityId || "",
    organizationId: signal.organizationId || "",
    contactId: signal.contactId || "",
    ownerId: signal.ownerId || "usr-za",
    dueDate: signal.dueDate,
    priority: signal.priority || "medium",
    status: "open",
    description: `${signal.detail || "Operativen Prüfpunkt klären."}\n\nLokale synthetische Arbeitsaufgabe; keine Außenaktion freigegeben.`,
    completedAt: null,
    readinessKey: signal.readinessKey,
    readinessKind: signal.kind || "operational_readiness",
    sourceDraftId: signal.draftId || "",
  });
}

export function updateCostGuardrails(state, patch) {
  const next = clone(state);
  const before = { ...next.costGuardrails };
  next.costGuardrails = {
    ...next.costGuardrails,
    dailySendLimit: Math.max(0, Number(patch.dailySendLimit || 0)),
    monthlySendLimit: Math.max(0, Number(patch.monthlySendLimit || 0)),
    monthlyBudgetEur: Math.max(0, Number(patch.monthlyBudgetEur || 0)),
    requireHumanApproval: true,
    synthetic: true,
    updatedAt: nowIso(),
  };
  appendAudit(next, { action: "cost_guardrails_updated", entityType: "system", entityId: "cost-guardrails", summary: "Lokale Kosten- und Kontingentgrenzen aktualisiert", before, after: next.costGuardrails });
  touchMeta(next);
  return { state: next, record: next.costGuardrails };
}

function appendOperationalActivity(next, entityType, record, timestamp) {
  const config = {
    notes: ["internal_note", `Notiz: ${record.title}`, record.occurredAt],
    conversations: ["conversation", `Gespräch: ${record.subject}`, record.occurredAt],
    appointments: ["appointment", `Termin: ${record.title}`, record.startsAt],
    followUps: ["follow_up", `Wiedervorlage: ${record.title}`, record.dueDate],
    offers: ["offer", `Angebot ${record.versionLabel} lokal dokumentiert`, record.createdAt],
    decisions: ["decision", `Entscheidung: ${record.title}`, record.decisionDate || record.createdAt],
    documentReferences: ["document_reference", `Dokumentreferenz: ${record.title}`, record.createdAt],
  }[entityType];
  if (!config) return;
  const opportunity = next.opportunities.find((item) => item.id === record.opportunityId);
  next.activities.unshift({
    id: makeId("act"), type: config[0], summary: config[1],
    opportunityId: record.opportunityId || "", organizationId: record.organizationId || opportunity?.organizationId || "", contactId: record.contactId || "",
    sourceEntityType: entityType, sourceEntityId: record.id, occurredAt: String(config[2] || timestamp).slice(0, 10), authorId: "usr-za",
    synthetic: true, qualityStatus: "synthetic", dataSourceId: "source-local-system", createdAt: timestamp, updatedAt: timestamp, archivedAt: null,
  });
}
