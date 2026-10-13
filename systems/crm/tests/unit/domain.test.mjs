import test from "node:test";
import assert from "node:assert/strict";
import { createSeedState } from "../../src/data/seed.js";
import { contactRestriction, findDuplicateHints, isSyntheticState, lockedProductiveCapabilities, searchCrm, validateRecord, validateStageEntry, workspaceContract } from "../../src/domain/crmDomain.js";

test("synthetischer Canonical-Core-Seed erfüllt die Sicherheitsgrenze", () => {
  const state = createSeedState();
  assert.equal(isSyntheticState(state), true);
  assert.equal(state.meta.schemaVersion, 7);
  assert.equal(state.meta.workspaceMode, "single_internal");
  assert.equal(state.meta.tenantCapable, false);
  assert.equal(workspaceContract.securityEnforced, false);
  assert.ok(state.contacts.every((record) => !record.email || record.email.endsWith(".invalid")));
  assert.equal(state.meta.realDataEnabled, false);
  assert.equal(state.meta.outboundEnabled, false);
});

test("Suche findet die tatsächlich angekündigten Kernobjekte", () => {
  const state = createSeedState();
  assert.equal(searchCrm(state, "Klinikverbund Rhein").some((result) => result.type === "organizations"), true);
  assert.equal(searchCrm(state, "Anna Keller").some((result) => result.type === "contacts"), true);
  assert.equal(searchCrm(state, "Arrival-Control-Kompaktpilot").some((result) => result.type === "opportunities"), true);
  assert.equal(searchCrm(state, "Unterlagen für Entscheidungsgespräch").some((result) => result.type === "tasks"), true);
  assert.equal(searchCrm(state, "Welcome Region").some((result) => result.type === "partnerOrganizations"), true);
  assert.equal(searchCrm(state, "Pflegeverbund").some((result) => result.type === "leads"), true);
  assert.equal(searchCrm(state, "Lea Muster").some((result) => result.type === "partnerContacts"), true);
  assert.equal(searchCrm(state, "Entscheidungsgespräch vorbereiten").some((result) => result.type === "notes"), true);
  assert.equal(searchCrm(state, "Qualifizierungsgespräch").some((result) => result.type === "conversations"), true);
  assert.equal(searchCrm(state, "Entscheidungsgespräch").some((result) => result.type === "appointments"), true);
  assert.equal(searchCrm(state, "Freigabeweg nachhalten").some((result) => result.type === "followUps"), true);
  assert.equal(searchCrm(state, "Angebot V1").some((result) => result.type === "offers"), true);
  assert.equal(searchCrm(state, "Pilotfreigabe").some((result) => result.type === "decisions"), true);
  assert.equal(searchCrm(state, "LOCAL-REF-RS-V1").some((result) => result.type === "documentReferences"), true);
  assert.equal(searchCrm(state, "Gesundheitszentrum Musterstadt").some((result) => result.type === "researchItems"), true);
  assert.equal(searchCrm(state, "Austausch zur Ankunftsbegleitung").some((result) => result.type === "outreachDrafts"), true);
});

test("dokumentierter Consent verlangt Zweck, Quelle, Zeitpunkt und synthetische Referenz", () => {
  const state = createSeedState();
  const draft = { ...state.contacts[0], consentStatus: "documented", consentPurpose: "", consentSource: "", consentRecordedAt: "", consentEvidenceReference: "" };
  const errors = validateRecord("contacts", draft, state);
  assert.ok(errors.consentPurpose);
  assert.ok(errors.consentSource);
  assert.ok(errors.consentRecordedAt);
  assert.ok(errors.consentEvidenceReference);
});

test("Phaseneintritt benennt fehlende Evidenz ohne Ersatzwerte zu erfinden", () => {
  const state = createSeedState();
  const opportunity = { ...state.opportunities.find((item) => item.id === "opp-106"), needSummary: "", primaryContactId: "", contactOpenQuestion: "" };
  const missing = validateStageEntry(opportunity, "qualified", state);
  assert.ok(missing.some((item) => item.field === "needSummary"));
  assert.ok(missing.some((item) => item.field === "contactOpenQuestion"));
});

test("Kontakt- und Rechtsstatus erzeugen eine sichtbare lokale Sperrentscheidung", () => {
  assert.equal(contactRestriction({ contactStatus: "active", consentStatus: "unknown" }).blocked, false);
  assert.equal(contactRestriction({ contactStatus: "active", consentStatus: "withdrawn" }).blocked, true);
  assert.equal(contactRestriction({ contactStatus: "do_not_contact", consentStatus: "unknown" }).blocked, true);
});

test("Rechercheeinträge zeigen lokale Dublettenhinweise für Quelle oder Organisation", () => {
  const state = createSeedState();
  const existing = state.researchItems[0];
  const bySource = findDuplicateHints("researchItems", { sourceUrl: existing.sourceUrl, organizationHint: "Andere Schreibweise" }, state);
  const byName = findDuplicateHints("researchItems", { sourceUrl: "https://neu.invalid/quelle", organizationHint: existing.organizationHint }, state);
  assert.match(bySource[0], /Recherche-Dublett/);
  assert.match(byName[0], /Recherche-Dublett/);
});

test("lokale Datenbank ist freigegeben, reale Daten und Außenaktionen bleiben geschlossen", () => {
  assert.deepEqual(lockedProductiveCapabilities, ["real_data_activation", "authentication", "external_import", "email_send", "calendar_sync", "document_storage", "app_integration", "productive_ai", "hosting_deployment"]);
  assert.equal(lockedProductiveCapabilities.includes("database"), false);
});

test("Pflichtfelder, Beziehungen und synthetische E-Mail-Domain werden validiert", () => {
  const state = createSeedState();
  const errors = validateRecord("contacts", { firstName: "", lastName: "Test", organizationId: "unbekannt", email: "real@example.com", ownerId: "" }, state);
  assert.ok(errors.firstName);
  assert.ok(errors.organizationId);
  assert.ok(errors.email);
  assert.ok(errors.ownerId);
});

test("lokaler Dublettenhinweis blockiert nicht, benennt aber Übereinstimmungen", () => {
  const state = createSeedState();
  const hints = findDuplicateHints("organizations", { displayName: "Klinikverbund Rhein" }, state);
  assert.equal(hints.length, 1);
  assert.match(hints[0], /Klinikverbund Rhein/);
});

test("R3.2-Fachobjekte verlangen belastbare Beziehungen und Pflichtfelder", () => {
  const state = createSeedState();
  assert.ok(validateRecord("notes", { title: "", body: "", opportunityId: "", organizationId: "", contactId: "" }, state).relationship);
  assert.ok(validateRecord("appointments", { title: "Termin", startsAt: "2026-10-11T12:00", endsAt: "2026-10-11T11:00", status: "planned", organizationId: "org-101" }, state).endsAt);
  assert.ok(validateRecord("offers", { opportunityId: "unbekannt", versionLabel: "", status: "draft", amount: -1, scopeSummary: "", validUntil: "" }, state).opportunityId);
  assert.ok(validateRecord("decisions", { opportunityId: "opp-101", title: "Freigabe", status: "approved", decisionDate: "", decisionMakerRole: "" }, state).decisionDate);
  assert.ok(validateRecord("documentReferences", { title: "", documentType: "", reference: "", versionLabel: "", status: "current", opportunityId: "" }, state).relationship);
});
