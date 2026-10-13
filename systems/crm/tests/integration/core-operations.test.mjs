import test from "node:test";
import assert from "node:assert/strict";
import { createSeedState } from "../../src/data/seed.js";
import { searchCrm } from "../../src/domain/crmDomain.js";
import { archiveRecord, convertLeadToOpportunity, createReadinessTask, createRecord, recordG1RestoreDrill, restoreRecord, runG1Controls, setHandoffApproval, setTaskStatus, transitionOpportunity, updateRecord } from "../../src/domain/stateEngine.js";
import { buildG1GateEvaluation } from "../../src/domain/g1Governance.js";
import { buildOperationalSignals } from "../../src/domain/outreachReadiness.js";

test("zusammenhängender lokaler CRM-Kernfluss wahrt Beziehungen, Historie und Archiv", () => {
  let state = createSeedState();
  let result = createRecord(state, "organizations", { displayName: "QA Gesundheitswerk", legalName: "", sector: "Gesundheit", region: "Düsseldorf", ownerId: "usr-za", status: "active", website: "", phone: "", notes: "Nur synthetischer Integrationstest" });
  state = result.state;
  const organization = result.record;

  result = createRecord(state, "contacts", { firstName: "Qara", lastName: "Test", organizationId: organization.id, role: "Testkontakt", email: "qara.test@example.invalid", phone: "", ownerId: "usr-za", relationshipRole: "decision_maker", contactStatus: "active", consentStatus: "unknown", notes: "" });
  state = result.state;
  const contact = result.record;

  result = createRecord(state, "opportunities", { organizationId: organization.id, title: "QA Core Pilot", pipelineId: "pipe-commercial-v1", stageId: "contact", status: "active", potential: 5900, currency: "EUR", ownerId: "usr-za", priority: "medium", sourceLabel: "Synthetischer Test", primaryContactId: contact.id, participantContactIds: [contact.id], nextAction: "Testschritt", nextActionDue: "2026-10-20", needSummary: "Synthetischer Bedarf ist dokumentiert.", contactOpenQuestion: "", scopeSummary: "", openQuestions: "", contactException: "", offerContext: "", serviceBoundary: "", potentialOpenReason: "", offerValidUntil: "", decisionRole: "", decisionPath: "", decisionDateWindow: "", wonMarker: false, wonScope: "", note: "", lossReason: "" });
  state = result.state;
  const opportunity = result.record;

  result = createRecord(state, "tasks", { title: "QA nächste Handlung", opportunityId: opportunity.id, organizationId: organization.id, contactId: contact.id, ownerId: "usr-za", dueDate: "2026-10-20", priority: "high", status: "open", description: "", completedAt: null });
  state = result.state;
  const task = result.record;

  result = createRecord(state, "activities", { type: "meeting_note", summary: "Synthetische QA-Aktivität dokumentiert", occurredAt: "2026-10-09", opportunityId: opportunity.id, organizationId: organization.id, contactId: contact.id, authorId: "usr-za" });
  state = result.state;
  assert.equal(result.record.opportunityId, opportunity.id);

  state = transitionOpportunity(state, opportunity.id, "qualified").state;
  state = setTaskStatus(state, task.id, "completed").state;
  assert.equal(state.tasks.find((item) => item.id === task.id).status, "completed");
  assert.ok(searchCrm(state, "QA Core Pilot").some((item) => item.id === opportunity.id));

  state = archiveRecord(state, "opportunities", opportunity.id, "Integrationstest").state;
  assert.equal(searchCrm(state, "QA Core Pilot").some((item) => item.type === "opportunities"), false);
  state = restoreRecord(state, "opportunities", opportunity.id).state;
  assert.ok(searchCrm(state, "QA Core Pilot").some((item) => item.id === opportunity.id));
  assert.ok(state.auditEvents.some((event) => event.action === "restored" && event.entityId === opportunity.id));
});

test("R3-Verträge verbinden Lead-Konvertierung, Partnerpflege und lokale ACC-Doppelfreigabe", () => {
  let state = createSeedState();
  const organization = state.organizations[0];
  const contact = state.contacts.find((item) => item.organizationId === organization.id);

  let result = createRecord(state, "leads", {
    title: "QA qualifizierter Lead",
    organizationId: organization.id,
    organizationHint: "",
    ownerId: "usr-za",
    sourceLabel: "Synthetischer Integrationstest",
    status: "qualified",
    needSummary: "Bedarf für lokalen Vertragstest",
    nextAction: "Chance lokal anlegen",
    nextActionDue: "2026-10-21",
    primaryContactId: contact?.id || "",
    notes: "",
  });
  state = result.state;
  result = convertLeadToOpportunity(state, result.record.id);
  state = result.state;
  assert.equal(result.record.stageId, "contact");
  assert.ok(state.leads.some((item) => item.status === "converted" && item.convertedOpportunityId === result.record.id));

  result = createRecord(state, "partnerOrganizations", { displayName: "QA Partnernetz", category: "Lokaler Partner", region: "Düsseldorf", ownerId: "usr-za", relationshipStatus: "qualified", notes: "Nur synthetisch" });
  state = result.state;
  const partner = result.record;
  result = createRecord(state, "partnerContacts", { partnerOrganizationId: partner.id, firstName: "Pat", lastName: "Test", role: "Koordination", email: "pat.test@example.invalid", phone: "", notes: "" });
  state = result.state;
  assert.equal(result.record.partnerOrganizationId, partner.id);

  const wonOpportunity = state.opportunities.find((item) => item.stageId === "won");
  state = setHandoffApproval(state, wonOpportunity.id, "commercial", true).state;
  state = setHandoffApproval(state, wonOpportunity.id, "operations", true).state;
  const handoff = state.handoffReferences.find((item) => item.opportunityId === wonOpportunity.id);
  assert.equal(handoff.status, "approved_marker");
  assert.equal("payload" in handoff, false);
  assert.equal("accId" in handoff, false);
});

test("R3.2-Fachblock verbindet sieben lokale Fachobjekte, Aktivität, Audit und Archiv", () => {
  let state = createSeedState();
  const context = { opportunityId: "opp-101", organizationId: "org-101", contactId: "con-101" };
  const drafts = [
    ["notes", { ...context, title: "QA Notiz", body: "Synthetischer Inhalt", visibility: "internal", occurredAt: "2026-10-10", ownerId: "usr-za" }],
    ["conversations", { ...context, subject: "QA Gespräch", occurredAt: "2026-10-10", channel: "video", summary: "Ergebnis", nextStep: "Folgeschritt", ownerId: "usr-za" }],
    ["appointments", { ...context, title: "QA Termin", startsAt: "2026-10-11T10:00", endsAt: "2026-10-11T10:30", status: "planned", locationNote: "Lokal", agenda: "Agenda", ownerId: "usr-za" }],
    ["followUps", { ...context, title: "QA Wiedervorlage", dueDate: "2026-10-12", status: "open", priority: "high", description: "Nachhalten", ownerId: "usr-za" }],
    ["offers", { opportunityId: "opp-101", organizationId: "org-101", versionLabel: "QA-V1", status: "draft", amount: 5900, currency: "EUR", validUntil: "2026-10-31", scopeSummary: "QA Leistungsrahmen", boundaryNote: "Kein Versand" }],
    ["decisions", { opportunityId: "opp-101", organizationId: "org-101", title: "QA Entscheidung", status: "pending", decisionDate: "", decisionMakerRole: "Geschäftsführung", rationale: "Offen", nextStep: "Prüfen" }],
    ["documentReferences", { ...context, title: "QA Dokumentreferenz", documentType: "Arbeitsentwurf", reference: "QA-LOCAL-REF-1", versionLabel: "V1", status: "current", confidentiality: "internal", notes: "Nur lokale Metadaten" }],
  ];
  const created = [];
  for (const [kind, draft] of drafts) {
    const result = createRecord(state, kind, draft);
    state = result.state;
    created.push([kind, result.record]);
    assert.ok(state.auditEvents.some((event) => event.entityType === kind && event.entityId === result.record.id && event.action === "created"));
    assert.ok(state.activities.some((activity) => activity.sourceEntityType === kind && activity.sourceEntityId === result.record.id));
  }
  const [noteKind, note] = created[0];
  state = updateRecord(state, noteKind, note.id, { body: "Bearbeiteter synthetischer Inhalt" }).state;
  assert.equal(state.notes.find((item) => item.id === note.id).body, "Bearbeiteter synthetischer Inhalt");
  state = archiveRecord(state, noteKind, note.id).state;
  assert.ok(state.notes.find((item) => item.id === note.id).archivedAt);
  state = restoreRecord(state, noteKind, note.id).state;
  assert.equal(state.notes.find((item) => item.id === note.id).archivedAt, null);
});

test("R3.5 überführt einen abgeleiteten Prüfpunkt genau einmal in eine lokale Aufgabe", () => {
  let state = createSeedState();
  const signal = buildOperationalSignals(state, "opp-101")[0];
  const result = createReadinessTask(state, signal);
  state = result.state;
  assert.equal(result.record.readinessKey, signal.readinessKey);
  assert.equal(result.record.opportunityId, "opp-101");
  assert.match(result.record.description, /keine Außenaktion freigegeben/i);
  assert.throws(() => createReadinessTask(state, signal), /bereits eine Aufgabe/);
  assert.ok(state.auditEvents.some((event) => event.action === "created" && event.entityId === result.record.id));
});

test("G1 Assurance verbindet sechs Kontrollläufe, Audit und unverändertes NO-GO", () => {
  const initial = createSeedState();
  const result = runG1Controls(initial);
  const readiness = buildG1GateEvaluation(result.state, { mode: "sqlite" });
  assert.equal(result.runs.length, 6);
  assert.ok(readiness.locallyPrepared >= 6);
  assert.equal(readiness.releaseEligible, false);
  assert.equal(result.state.meta.realDataEnabled, false);
  assert.equal(result.state.meta.outboundEnabled, false);
  assert.ok(result.state.auditEvents.some((event) => event.action === "g1_synthetic_control_suite"));
});

test("R3.10 protokolliert nur einen belastbaren isolierten Restore-Nachweis", () => {
  const initial = createSeedState();
  const result = recordG1RestoreDrill(initial, { status: "passed", syntheticOnly: true, liveStateMutated: false, schemaVersion: 7, checksumPrefix: "123456789abc", recordCount: 42, checkedAt: "2026-10-13T15:00:00.000Z" });
  assert.equal(result.run.kind, "restore_drill");
  assert.equal(result.state.g1Governance.releaseEligible, false);
  assert.equal(result.state.g1Governance.realDataEnabled, false);
  assert.equal(result.state.g1Governance.productOwnerDecision.reference, "PO-CRM-043");
  assert.equal(result.state.g1Governance.productOwnerDecision.releaseDecision, "no_go");
  assert.equal(result.state.meta.realDataEnabled, false);
  assert.equal(result.state.meta.outboundEnabled, false);
  assert.ok(result.state.auditEvents.some((event) => event.action === "g1_isolated_restore_drill"));
  assert.throws(() => recordG1RestoreDrill(initial, { status: "passed", syntheticOnly: false, liveStateMutated: false }), /keinen belastbaren synthetischen Erfolgsnachweis/);
});
