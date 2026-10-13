import test from "node:test";
import assert from "node:assert/strict";
import { createSeedState } from "../../src/data/seed.js";
import { allowedStageTransitions, canTransitionOpportunity, SCHEMA_VERSION } from "../../src/domain/crmDomain.js";
import { migrateToR38 } from "../../src/domain/migrations.js";
import { approveOutreachDraft, convertLeadToOpportunity, convertResearchToLead, runG1Controls, setHandoffApproval, suppressContact, transitionOpportunity } from "../../src/domain/stateEngine.js";

test("jede kanonische Phase besitzt einen expliziten Übergangsvertrag", () => {
  assert.deepEqual(Object.keys(allowedStageTransitions).sort(), ["contact", "decision", "lost", "proposal", "qualified", "scoping", "won"]);
  assert.equal(canTransitionOpportunity("contact", "qualified"), true);
  assert.equal(canTransitionOpportunity("contact", "proposal"), false);
});

test("erlaubter Phasenwechsel schreibt Historie und Audit-Ereignis", () => {
  const state = createSeedState();
  const beforeActivities = state.activities.length;
  const result = transitionOpportunity(state, "opp-106", "qualified");
  assert.equal(result.record.stageId, "qualified");
  assert.equal(result.state.activities.length, beforeActivities + 1);
  assert.equal(result.state.activities[0].type, "stage_change");
  assert.equal(result.state.auditEvents[0].action, "stage_changed");
  assert.equal(state.opportunities.find((item) => item.id === "opp-106").stageId, "contact", "Ausgangszustand bleibt unverändert");
});

test("unzulässiger Sprung und Verlust ohne Grund werden abgewiesen", () => {
  const state = createSeedState();
  assert.throws(() => transitionOpportunity(state, "opp-106", "proposal"), /nicht erlaubt/);
  assert.throws(() => transitionOpportunity(state, "opp-106", "lost"), /Verlustgrund/);
  assert.equal(transitionOpportunity(state, "opp-106", "lost", "Kein Budget im synthetischen Szenario").record.status, "lost");
});

test("verschärfte Phasenkriterien blockieren Leistungsrahmen ohne Zielbild und offene Punkte", () => {
  const state = createSeedState();
  const qualified = transitionOpportunity(state, "opp-106", "qualified").state;
  assert.throws(() => transitionOpportunity(qualified, "opp-106", "scoping"), /Zielbild oder Notiz zum Leistungsrahmen/);
  const prepared = structuredClone(qualified);
  const opportunity = prepared.opportunities.find((item) => item.id === "opp-106");
  opportunity.scopeSummary = "Synthetischer Scope";
  opportunity.openQuestions = "Standortumfang offen";
  assert.equal(transitionOpportunity(prepared, "opp-106", "scoping").record.stageId, "scoping");
});

test("nur qualifizierter Lead mit Organisation, Bedarf und nächstem Schritt wird konvertiert", () => {
  const state = createSeedState();
  assert.throws(() => convertLeadToOpportunity(state, "lead-102"), /Nur ein qualifizierter Lead/);
  const result = convertLeadToOpportunity(state, "lead-101");
  assert.equal(result.lead.status, "converted");
  assert.equal(result.record.convertedFromLeadId, "lead-101");
  assert.equal(result.record.stageId, "contact");
  assert.ok(result.state.auditEvents.some((event) => event.action === "lead_converted"));
});

test("ACC-Prüfmarker verlangt beide lokale Freigaben und überträgt nichts", () => {
  const state = createSeedState();
  const first = setHandoffApproval(state, "opp-108", "commercial", true);
  assert.equal(first.record.status, "review_required");
  const second = setHandoffApproval(first.state, "opp-108", "operations", true);
  assert.equal(second.record.status, "approved_marker");
  assert.equal("payload" in second.record, false);
  assert.equal("accId" in second.record, false);
});

test("Recherche wird erst nach Quellenprüfung lokal zum Lead", () => {
  const state = createSeedState();
  const result = convertResearchToLead(state, "research-101");
  assert.equal(result.research.status, "converted");
  assert.equal(result.record.status, "reviewing");
  assert.match(result.record.sourceLabel, /example\.invalid/);
  assert.equal(result.state.meta.outboundEnabled, false);
});

test("Outreach-Freigabe verlangt dokumentierten Status und erzeugt keinen Versand", () => {
  const state = createSeedState();
  assert.throws(() => approveOutreachDraft(state, "outreach-101"), /Kontakt- und Rechtsstatus/);
  const prepared = structuredClone(state);
  prepared.contacts.find((item) => item.id === "con-101").consentStatus = "not_required_review";
  const approved = approveOutreachDraft(prepared, "outreach-101");
  assert.equal(approved.record.status, "approved_local");
  assert.equal(approved.record.sentAt, null);
  assert.equal(approved.state.meta.outboundEnabled, false);
});

test("Kontaktsperre blockiert verbundene Outreach-Entwürfe", () => {
  const result = suppressContact(createSeedState(), "con-101", "Synthetischer Widerspruch");
  assert.equal(result.record.contactStatus, "do_not_contact");
  assert.equal(result.state.outreachDrafts.find((item) => item.contactId === "con-101").status, "blocked");
  assert.equal(result.state.suppressionEntries.length, 1);
});

test("G1-v7-Vertrag migriert v5 lokal und kann Freigabesperren nicht aufheben", () => {
  const legacy = createSeedState();
  legacy.meta.schemaVersion = 5;
  delete legacy.g1Governance;
  const migrated = migrateToR38(legacy);
  assert.equal(migrated.meta.schemaVersion, SCHEMA_VERSION);
  assert.equal(migrated.meta.realDataEnabled, false);
  assert.equal(migrated.g1Governance.releaseEligible, false);
  assert.equal(migrated.g1Governance.productOwnerDecision.reference, "PO-CRM-043");
  assert.deepEqual(migrated.g1Governance.productOwnerDecision.gateIds, ["G1-01", "G1-05", "G1-07", "G1-09"]);
  const checked = runG1Controls(migrated).state;
  assert.equal(checked.g1Governance.status, "no_go");
  assert.equal(checked.meta.outboundEnabled, false);
});

test("R3.7/v6 wird unter Erhalt der Sperren in R3.8/v7 überführt", () => {
  const legacy = createSeedState();
  legacy.meta.schemaVersion = 6;
  legacy.meta.status = "local-r3-7-g1-entry-gate-closure";
  delete legacy.g1Governance.legalAssurance;
  delete legacy.g1Governance.accessAssurance;
  const migrated = migrateToR38(legacy);
  assert.equal(migrated.meta.schemaVersion, 7);
  assert.equal(migrated.meta.realDataEnabled, false);
  assert.equal(migrated.meta.outboundEnabled, false);
  assert.equal(migrated.g1Governance.legalAssurance.productiveContactAllowed, false);
  assert.equal(migrated.g1Governance.accessAssurance.authenticationImplemented, false);
  assert.equal(migrated.g1Governance.accessAssurance.productiveAccessAllowed, false);
  assert.equal(migrated.g1Governance.productOwnerDecision.releaseDecision, "no_go");
  assert.ok(migrated.auditEvents.some((event) => /R3\.7\/v6 auf R3\.8\/v7/.test(event.summary)));
});
